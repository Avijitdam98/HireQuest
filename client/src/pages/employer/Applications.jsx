import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MessageSquare, FileText, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', user?.id);

      if (!jobs?.length) {
        setApplications([]);
        return;
      }

      const jobIds = jobs.map(job => job.id);

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs (
            id,
            title,
            company,
            location
          ),
          profile:profiles (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleChat = async (application) => {
    try {
      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('application_id', application.id)
        .single();

      if (existingChat) {
        navigate('/chat', { state: { chatId: existingChat.id } });
        return;
      }

      // Create new chat
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert([
          {
            application_id: application.id,
            employer_id: user.id,
            jobseeker_id: application.profile.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      navigate('/chat', { state: { chatId: newChat.id } });
    } catch (error) {
      console.error('Error handling chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-600">
            No applications yet
          </h3>
          <p className="text-gray-500">
            When candidates apply to your jobs, they'll appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {application.job.title}
                  </h3>
                  <p className="text-gray-600">
                    {application.job.company} • {application.job.location}
                  </p>
                  <div className="mt-2">
                    <p className="font-medium">{application.profile.full_name}</p>
                    <p className="text-gray-600 text-sm">
                      {application.profile.email}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Applied {format(new Date(application.created_at), 'PPP')}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={application.status || 'pending'}>
                    {application.status || 'Pending'}
                  </Badge>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(application.cv_url, '_blank')}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View CV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChat(application)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {application.status !== 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() =>
                          handleStatusUpdate(application.id, 'approved')
                        }
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                    )}
                    {application.status !== 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() =>
                          handleStatusUpdate(application.id, 'rejected')
                        }
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
