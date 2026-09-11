export function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-content mb-4">Coming Soon</h1>
        <p className="text-content-secondary mb-6">This page is under development.</p>
        <button
          onClick={() => {
            window.location.href = "/"
          }}
          className="px-6 py-3 bg-primary text-content-inverse rounded-lg hover:opacity-90 transition-opacity"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
