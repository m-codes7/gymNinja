import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { loadData } from '../storage'

function Welcome() {
  const navigate = useNavigate()
  const data = loadData()

  useEffect(() => {
    if (!data.user) return
    function handleKeyDown(e) {
      if (e.key === 'Enter') navigate('/dashboard')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [data.user, navigate])

  if (!data.user) {
    return <Navigate to="/" replace />
  }

  const firstName = data.user.name.trim().split(/\s+/)[0]

  return (
    <div
      className="flex min-h-screen cursor-pointer flex-col items-center justify-center bg-neutral-950 px-4 text-center"
      onClick={() => navigate('/dashboard')}
    >
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
        Welcome, <span className="text-emerald-400">{firstName}</span>
      </h1>
      <p className="mt-6 text-neutral-400">
        Press <kbd className="rounded bg-neutral-800 px-2 py-1 text-sm text-neutral-300">Enter</kbd> or click anywhere to enter the gym.
      </p>
    </div>
  )
}

export default Welcome