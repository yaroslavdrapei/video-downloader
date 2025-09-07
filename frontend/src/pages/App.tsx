import { VideoForm } from '@/components/VideoForm'

export function App() {
  return (
    <div className="bg-black text-white min-h-screen bg-grid">
      <header className="border-b border-border sticky top-0 backdrop-blur bg-black/70">
        <div className="container py-4 flex items-center justify-between">
          <div className="font-semibold tracking-wide">Video Downloader</div>
          <a className="text-sm text-blue-300 hover:text-blue-200" href="/api/v0/status" target="_blank" rel="noreferrer">API Status</a>
        </div>
      </header>
      <main className="container py-8">
        <section className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 shadow-card">
          <h1 className="text-xl font-semibold mb-2">Download from any supported link</h1>
          <p className="text-sm text-gray-400 mb-6">Paste a video URL, fetch available formats, then download.</p>
          <VideoForm />
        </section>
      </main>
      <footer className="container py-8 text-center text-xs text-gray-500">
        Built with React, Tailwind, and shadcn-style components.
      </footer>
    </div>
  )
}


