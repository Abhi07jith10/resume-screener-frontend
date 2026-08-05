import { useState, useEffect } from 'react'
import api from '../api/axios'

function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const response = await api.get('/candidates/')
      setCandidates(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load candidates. Is the backend server running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/candidates/', { name, email })
      setName('')
      setEmail('')
      fetchCandidates()
    } catch (err) {
      setError('Failed to create candidate.')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Candidates</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8 flex flex-wrap gap-3 items-center"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 flex-1 min-w-[180px]"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 flex-1 min-w-[180px]"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Add Candidate
        </button>
      </form>

      {loading && <p className="text-gray-400">Loading candidates...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.length === 0 && (
            <p className="text-gray-500 col-span-full">No candidates yet.</p>
          )}
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-600 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-3">
                {candidate.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-semibold text-white">{candidate.name}</h3>
              <p className="text-gray-400 text-sm">{candidate.email}</p>
              {candidate.resume_text ? (
                <span className="inline-block mt-2 text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full">
                  Resume uploaded
                </span>
              ) : (
                <span className="inline-block mt-2 text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full">
                  No resume
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Candidates