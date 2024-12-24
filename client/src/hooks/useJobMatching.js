import { useState, useEffect } from 'react'
import api from '@/services/api'

export const useJobMatching = (userSkills) => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMatches = async () => {
      if (!userSkills?.length) return

      try {
        setLoading(true)
        setError(null)
        
        // Fetch all jobs
        const jobs = await api.jobs.getAll()
        
        // Simple matching algorithm based on skills overlap
        const matchedJobs = jobs.map(job => {
          const jobSkills = job.required_skills || []
          const matchingSkills = userSkills.filter(skill => 
            jobSkills.includes(skill.toLowerCase())
          )
          
          return {
            ...job,
            matchScore: (matchingSkills.length / jobSkills.length) * 100,
            matchingSkills,
          }
        })

        // Sort by match score
        const sortedMatches = matchedJobs
          .filter(job => job.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)

        setMatches(sortedMatches)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [userSkills])

  return { matches, loading, error }
}

export default useJobMatching
