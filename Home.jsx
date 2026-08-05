function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-white mb-4">
        AI-Powered Resume Screener
      </h1>
      <p className="text-gray-400 text-lg max-w-xl mx-auto">
        Upload resumes, score candidates against job descriptions using AI,
        and schedule interviews — all in one place.
      </p>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-2">📄</div>
          <h3 className="font-semibold text-white mb-1">Upload Resumes</h3>
          <p className="text-gray-400 text-sm">Extract text from PDF resumes automatically.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-2">🤖</div>
          <h3 className="font-semibold text-white mb-1">AI Scoring</h3>
          <p className="text-gray-400 text-sm">Get instant match scores with reasoning.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="font-semibold text-white mb-1">Schedule Interviews</h3>
          <p className="text-gray-400 text-sm">Propose and track interview slots easily.</p>
        </div>
      </div>
    </div>
  )
}

export default Home