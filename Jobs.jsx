import { useState, useEffect } from 'react'
import api from '../api/axios'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/jobs/')
      setJobs(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load jobs. Is the backend server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/jobs/', {
        title,
        description,
        required_skills: requiredSkills,
      })
      setTitle('')
      setDescription('')
      setRequiredSkills('')
      fetchJobs()
    } catch (err) {
      setError('Failed to create job.')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Jobs</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8 flex flex-col gap-3 max-w-xl"
      >
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
        />
        <input
          type="text"
          placeholder="Required Skills (comma-separated)"
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2 rounded-lg transition-colors self-start"
        >
          Add Job
        </button>
      </form>

      {loading && <p className="text-gray-400">Loading jobs...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.length === 0 && (
            <p className="text-gray-500 col-span-full">No jobs posted yet.</p>
          )}
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-600 transition-colors"
            >
              <h3 className="font-semibold text-white text-lg mb-2">{job.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{job.description}</p>
              {job.required_skills && (
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.split(',').map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Jobs