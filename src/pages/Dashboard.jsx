import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { clearData, loadData, saveData } from '../storage'
import SplitsManager from '../components/SplitsManager'
import GoalsManager from '../components/GoalsManager'
import WorkoutLogger from '../components/WorkoutLogger'
import StatsOverview from '../components/StatsOverview'
import WeightTracker from '../components/WeightTracker'

function Dashboard() {
  const navigate = useNavigate()
  const initial = loadData()
  const [user] = useState(initial.user)
  const [splits, setSplits] = useState(initial.splits)
  const [workouts, setWorkouts] = useState(initial.workouts)
  const [goals, setGoals] = useState(initial.goals)
  const [weights, setWeights] = useState(initial.weights || [])

  if (!user) {
    return <Navigate to="/" replace />
  }

  function handleSplitChange(next) {
    setSplits(next)
    saveData({ user, splits: next, workouts, goals, weights })
  }

  function handleWorkoutChange(next) {
    setWorkouts(next)
    saveData({ user, splits, workouts: next, goals, weights })
  }

  function handleGoalChange(next) {
    setGoals(next)
    saveData({ user, splits, workouts, goals: next, weights })
  }

  function handleWeightChange(next) {
    setWeights(next)
    saveData({ user, splits, workouts, goals, weights: next })
  }

  function handleLogout() {
    if (confirm('Clear your data and log out?')) {
      clearData()
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 pb-16">
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-extrabold text-white">
            Gym<span className="text-emerald-400">Ninja</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400">
              {user.name} · {user.age} yrs · {user.height} cm · {user.weight} kg
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-300 transition hover:bg-neutral-700"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 pt-8">
        <StatsOverview workouts={workouts} />

        <div className="grid gap-6 lg:grid-cols-2">
          <SplitsManager splits={splits} setSplits={handleSplitChange} />
          <GoalsManager goals={goals} setGoals={handleGoalChange} />
        </div>

        <WorkoutLogger
          splits={splits}
          workouts={workouts}
          setWorkouts={handleWorkoutChange}
        />

        <WeightTracker
          weights={weights}
          setWeights={handleWeightChange}
        />
      </main>

    </div>
  )
}

export default Dashboard