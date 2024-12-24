CREATE OR REPLACE FUNCTION public.get_dashboard_analytics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    WITH stats AS (
        SELECT 
            (SELECT COUNT(*) FROM profiles) as total_users,
            (SELECT COUNT(*) FROM jobs WHERE status = 'active') as active_jobs,
            (SELECT COUNT(*) FROM applications) as total_applications,
            (
                SELECT ROUND(
                    (COUNT(*) FILTER (WHERE status = 'accepted')::float / 
                    NULLIF(COUNT(*), 0)::float) * 100
                )
                FROM applications
                WHERE created_at >= NOW() - INTERVAL '30 days'
            ) as success_rate,
            (
                SELECT json_agg(job_stats)
                FROM (
                    SELECT 
                        j.title,
                        COUNT(a.id) as application_count,
                        j.created_at as posted_at
                    FROM jobs j
                    LEFT JOIN applications a ON j.id = a.job_id
                    WHERE j.status = 'active'
                    GROUP BY j.id
                    ORDER BY COUNT(a.id) DESC
                    LIMIT 3
                ) job_stats
            ) as top_jobs,
            (
                SELECT json_agg(recent)
                FROM (
                    SELECT 
                        CASE 
                            WHEN a.id IS NOT NULL THEN 'application'
                            WHEN j.id IS NOT NULL THEN 'job'
                            WHEN p.id IS NOT NULL THEN 'user'
                        END as type,
                        CASE 
                            WHEN a.id IS NOT NULL THEN 'New application received'
                            WHEN j.id IS NOT NULL THEN 'New job posted'
                            WHEN p.id IS NOT NULL THEN 'New user registered'
                        END as title,
                        CASE 
                            WHEN a.id IS NOT NULL THEN (
                                SELECT title FROM jobs WHERE id = a.job_id
                            )
                            WHEN j.id IS NOT NULL THEN j.title
                            WHEN p.id IS NOT NULL THEN p.full_name
                        END as description,
                        GREATEST(
                            COALESCE(a.created_at, '1970-01-01'::timestamp),
                            COALESCE(j.created_at, '1970-01-01'::timestamp),
                            COALESCE(p.created_at, '1970-01-01'::timestamp)
                        ) as created_at
                    FROM (
                        SELECT id, job_id, created_at FROM applications
                        UNION ALL
                        SELECT id, NULL, created_at FROM jobs
                        UNION ALL
                        SELECT id, NULL, created_at FROM profiles
                    ) events
                    LEFT JOIN applications a ON events.id = a.id AND events.job_id IS NOT NULL
                    LEFT JOIN jobs j ON events.id = j.id AND events.job_id IS NULL
                    LEFT JOIN profiles p ON events.id = p.id AND events.job_id IS NULL
                    ORDER BY created_at DESC
                    LIMIT 5
                ) recent
            ) as recent_activity
    )
    SELECT json_build_object(
        'total_users', stats.total_users,
        'active_jobs', stats.active_jobs,
        'total_applications', stats.total_applications,
        'success_rate', COALESCE(stats.success_rate, 0),
        'top_jobs', COALESCE(stats.top_jobs, '[]'::json),
        'recent_activity', COALESCE(stats.recent_activity, '[]'::json)
    ) INTO result
    FROM stats;

    RETURN result;
END;
$$;
