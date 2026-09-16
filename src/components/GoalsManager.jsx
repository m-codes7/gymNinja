import { useState } from 'react'
import { getUUID } from '../storage'

function GoalsManager({ goals, setGoals }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'weight', exercise: '', target: '' })
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.target || Number(form.target) <= 0) {
      setError('Enter a valid target.')
      return
    }
    if (form.type === 'weight' && !form.exercise.trim()) {
      setError("Enter the exercise you're targeting.")
      return
    }

    const goal = {
      id: getUUID(),
      type: form.type,
      exercise: form.exercise.trim(),
      target: Number(form.target),
      achieved: false,
    }
    setGoals((prev) => [...prev, goal])
    setForm({ type: 'weight', exercise: '', target: '' })
    setShowForm(false)
    setError('')
  }

  function toggleAchieved(goal) {
    setGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? { ...g, achieved: !g.achieved } : g)),
    )
  }

  function handleDelete(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  function goalContent(goal) {
    return goal.type === 'weight' ? (
      <p className="text-sm text-neutral-400">
        <span className="font-semibold text-white">{goal.exercise}</span> →
        <span className="font-semibold text-emerald-400">
          {' '}
          {goal.target} kg
        </span>
      </p>
    ) : (
      <p className="text-sm text-neutral-400">
        Train{' '}
        <span className="font-semibold text-emerald-400">
          {goal.target} hours
        </span>{' '}
        per week
      </p>
    )
  }

  const inputClass =
    'w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder-neutral-500 outline-none transition focus:border-emerald-400'

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Goals</h2>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
        >
          + New Goal
        </button>
      </div>

      {goals.length === 0 && !showForm ? (
        <p className="rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 py-6 text-center text-neutral-400">
          No goals yet. Set a target to chase!
        </p>
      ) : (
        <>
          {goals.filter((g) => !g.achieved).length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-neutral-400">
                Active Goals
              </h3>
              <ul className="space-y-2">
                {goals
                  .filter((g) => !g.achieved)
                  .map((goal) => (
                    <li
                      key={goal.id}
                      className="flex items-center justify-between rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3"
                    >
                      <div className="flex-1">{goalContent(goal)}</div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleAchieved(goal)}
                          className="rounded bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                        >
                          Achieved
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="rounded px-2 py-1 text-xs text-red-400 transition hover:bg-neutral-700"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {goals.filter((g) => g.achieved).length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-emerald-400">
                Goals Achieved
              </h3>
              <ul className="space-y-2">
                {goals
                  .filter((g) => g.achieved)
                  .map((goal) => (
                    <li
                      key={goal.id}
                      className="flex items-center justify-between rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-4 py-3"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <span className="text-lg">✓</span>
                        {goalContent(goal)}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleAchieved(goal)}
                          className="rounded px-2 py-1 text-xs text-neutral-400 transition hover:bg-neutral-700"
                        >
                          Undo
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="rounded px-2 py-1 text-xs text-red-400 transition hover:bg-neutral-700"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-neutral-700 bg-neutral-800 p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">New Goal</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded px-2 py-1 text-sm text-neutral-400 transition hover:bg-neutral-700"
            >
              Close
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'weight' })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                form.type === 'weight'
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              Lift Target
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'time' })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                form.type === 'time'
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              Weekly Time
            </button>
          </div>

          {form.type === 'weight' && (
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-neutral-300">
                Exercise
              </label>
              <input
                type="text"
                value={form.exercise}
                onChange={(e) =>
                  setForm({ ...form, exercise: e.target.value })
                }
                placeholder="e.g. Bench Press"
                className={inputClass}
              />
            </div>
          )}

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-neutral-300">
              {form.type === 'weight' ? 'Target Weight (kg)' : 'Hours per Week'}
            </label>
            <input
              type="number"
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              placeholder={form.type === 'weight' ? 'e.g. 100' : 'e.g. 5'}
              className={inputClass}
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-emerald-500 py-2 font-semibold text-neutral-950 transition hover:bg-emerald-400"
          >
            Add Goal
          </button>
        </form>
      )}
    </div>
  )
}

export default GoalsManager