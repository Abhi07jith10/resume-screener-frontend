import { useState, useEffect } from 'react'
import api from '../api/axios'

function Applications() {
  const [applications, setApplications] = useState([])
  const [candidates, setCandidates] = useState([])
  const [jobs, setJobs] = useState([])
  const [interviewSlots, setInterviewSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [selectedCandidate, setSelectedCandidate] = useState('')
  const [selectedJob, setSelectedJob] = useState('')

  const [schedulingAppId, setSchedulingAppId] = useState(null)
  const [interviewDateTime, setInterviewDateTime] = useState('')

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [appsRes, candidatesRes, jobsRes, slotsRes] = await Promise.all([
        api.get('/applications/'),
        api.get('/candidates/'),
        api.get('/jobs/'),
        api.get('/interview-slots/'),
      ])
      setApplications(appsRes.data)
      setCandidates(candidatesRes.data)
      setJobs(jobsRes.data)
      setInterviewSlots(slotsRes.data)
      setError(null)
    } catch (err) {
      setError('Failed to load data. Is the backend server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCandidate || !selectedJob) return

    try {
      setSubmitting(true)
      setError(null)
      await api.post('/applications/', {
        candidate_id: parseInt(selectedCandidate),
        job_id: parseInt(selectedJob),
      })
      setSelectedCandidate('')
      setSelectedJob('')
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create application.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleScheduleSubmit = async (e, applicationId) => {
    e.preventDefault()
    if (!interviewDateTime) return

    try {
      setError(null)
      await api.post('/interview-slots/', {
        application_id: applicationId,
        datetime: interviewDateTime,
      })
      setSchedulingAppId(null)
      setInterviewDateTime('')
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to schedule interview.')
    }
  }

  const getCandidateName = (id) => candidates.find((c) => c.id === id)?.name || `Candidate #${id}`
  const getJobTitle = (id) => jobs.find((j) => j.id === id)?.title || `Job #${id}`
  const getSlotForApplication = (appId) => interviewSlots.find((s) => s.application_id === appId)

  const scoreStyles = (score) => {
    if (score >= 70) return { text: 'text-green-400', ring: 'ring-green-500/30', bg: 'bg-green-500/10' }
    if (score >= 40) return { text: 'text-yellow-400', ring: 'ring-yellow-500/30', bg: 'bg-yellow-500/10' }
    return { text: 'text-red-400', ring: 'ring-red-500/30', bg: 'bg-red-500/10' }
  }

  const statusBadge = (status) => {
    const map = {
      reviewed: 'bg-blue-600/20 text-blue-400',
      pending: 'bg-gray-700 text-gray-300',
    }
    return map[status] || 'bg-gray-700 text-gray-300'
  }

  const sortedApplications = [...applications].sort((a, b) => (b.score || 0) - (a.score || 0))

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Applications</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8 flex flex-wrap gap-3 items-center"
      >
        <select
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Select Candidate</option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Select Job</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {submitting ? 'Scoring...' : 'Score Application'}
        </button>
      </form>

      {loading && <p className="text-gray-400">Loading applications...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {!loading && (
        <div className="flex flex-col gap-4">
          {sortedApplications.length === 0 && (
            <p className="text-gray-500">No applications yet.</p>
          )}
          {sortedApplications.map((app) => {
            const slot = getSlotForApplication(app.id)
            const styles = scoreStyles(app.score || 0)
            return (
              <div
                key={app.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-white font-medium">
                      {getCandidateName(app.candidate_id)}
                      <span className="text-gray-500 font-normal"> applied for </span>
                      {getJobTitle(app.job_id)}
                    </p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${statusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold px-4 py-2 rounded-lg ring-1 ${styles.text} ${styles.bg} ${styles.ring}`}>
                    {app.score ?? '—'}<span className="text-sm font-normal">/100</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  {slot ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">📅</span>
                      <span className="text-gray-300">
                        Interview scheduled for{' '}
                        <strong className="text-white">{new Date(slot.datetime).toLocaleString()}</strong>
                      </span>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full ml-1">
                        {slot.status}
                      </span>
                    </div>
                  ) : schedulingAppId === app.id ? (
                    <form
                      onSubmit={(e) => handleScheduleSubmit(e, app.id)}
                      className="flex flex-wrap gap-2 items-center"
                    >
                      <input
                        type="datetime-local"
                        value={interviewDateTime}
                        onChange={(e) => setInterviewDateTime(e.target.value)}
                        required
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Confirm Slot
                      </button>
                      <button
                        type="button"
                        onClick={() => setSchedulingAppId(null)}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setSchedulingAppId(app.id)}
                      className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Propose Interview Slot
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Applications