import { useEffect, useState } from 'react'
import { getUUID } from '../storage'

function todayStr() {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10)
}

function emptyExercise(name = '') {
  return {
    id: getUUID(),
    name,
    sets: [{ id: getUUID(), reps: '', weight: '' }],
  }
}

function emptyWorkout() {
  return {
    date: todayStr(),
    splitName: '',
    day: '',
    durationMinutes: '',
    exercises: [emptyExercise()],
  }
}

function WorkoutLogger({ splits, workouts, setWorkouts }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyWorkout())
  const [selectedSplitId, setSelectedSplitId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!showForm) return
    const split = splits.find((s) => s.id === selectedSplitId)
    if (!split) return
    const day = split.days.find((d) => d.name === form.day)
    if (!day) return
    if (form.exercises.some((ex) => ex.name !== '')) return
    setForm((f) => ({
      ...f,
      exercises: day.exercises.map((name) => emptyExercise(name)),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSplitId, form.day, showForm])

  function handleSplitChange(splitId) {
    setSelectedSplitId(splitId)
    const split = splits.find((s) => s.id === splitId)
    setForm((f) => ({
      ...f,
      splitName: split ? split.name : '',
      day: split && split.days.length > 0 ? split.days[0].name : '',
      exercises: split && split.days.length > 0
        ? split.days[0].exercises.map((name) => emptyExercise(name))
        : [emptyExercise()],
    }))
  }

  function handleDayChange(dayName) {
    const split = splits.find((s) => s.id === selectedSplitId)
    const day = split && split.days.find((d) => d.name === dayName)
    setForm((f) => ({
      ...f,
      day: dayName,
      exercises: day
        ? day.exercises.map((name) => emptyExercise(name))
        : [emptyExercise()],
    }))
  }

  function updateExercise(exId, name) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((ex) =>
        ex.id === exId ? { ...ex, name } : ex,
      ),
    }))
  }

  function addSet(exId) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((ex) =>
        ex.id === exId
          ? { ...ex, sets: [...ex.sets, { id: getUUID(), reps: '', weight: '' }] }
          : ex,
      ),
    }))
  }

  function removeSet(exId, setId) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((ex) =>
        ex.id === exId
          ? {
              ...ex,
              sets:
                ex.sets.length > 1
                  ? ex.sets.filter((s) => s.id !== setId)
                  : ex.sets,
            }
          : ex,
      ),
    }))
  }

  function updateSet(exId, setId, patch) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((ex) =>
        ex.id === exId
          ? {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, ...patch } : s,
              ),
            }
          : ex,
      ),
    }))
  }

  function addExercise() {
    setForm((f) => ({ ...f, exercises: [...f.exercises, emptyExercise()] }))
  }

  function removeExercise(exId) {
    setForm((f) => ({
      ...f,
      exercises:
        f.exercises.length > 1
          ? f.exercises.filter((ex) => ex.id !== exId)
          : f.exercises,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.durationMinutes || Number(form.durationMinutes) <= 0) {
      setError('Enter a session duration in minutes.')
      return
    }

    const exercises = form.exercises
      .filter((ex) => ex.name.trim())
      .map((ex) => ({
        name: ex.name.trim(),
        sets: ex.sets
          .filter((s) => s.reps && s.weight)
          .map((s) => ({
            reps: Number(s.reps),
            weight: Number(s.weight),
          })),
      }))
      .filter((ex) => ex.sets.length > 0)

    if (exercises.length === 0) {
      setError('Add at least one exercise with reps and weight.')
      return
    }

    const workout = {
      id: getUUID(),
      date: form.date,
      splitName: form.splitName,
      day: form.day,
      durationMinutes: Number(form.durationMinutes),
      exercises,
    }

    setWorkouts((prev) => [...prev, workout])
    setForm(emptyWorkout())
    setSelectedSplitId('')
    setShowForm(false)
    setError('')
  }

  const inputClass =
    'rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder-neutral-500 outline-none transition focus:border-emerald-400'

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Workout Overview</h2>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
        >
          + Log Workout
        </button>
      </div>

      {workouts.length === 0 && !showForm ? (
        <p className="rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 py-6 text-center text-neutral-400">
          No workouts logged yet. Log your first session!
        </p>
      ) : (
        <ul className="space-y-3">
          {workouts
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((w) => (
              <li
                key={w.id}
                className="rounded-lg border border-neutral-700 bg-neutral-800 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">
                    {w.splitName || 'Full Body'}{' '}
                    {w.day && (
                      <span className="text-sm font-normal text-neutral-400">
                        · {w.day}
                      </span>
                    )}
                  </p>
                  <span className="text-sm text-neutral-400">{w.date}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-400">
                  <span>{w.exercises.length} exercises</span>
                  <span>{w.durationMinutes} min</span>
                  <span>
                    {w.exercises.reduce(
                      (sum, ex) =>
                        sum +
                        ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
                      0,
                    )}{' '}
                    kg lifted
                  </span>
                </div>
              </li>
            ))}
        </ul>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-neutral-700 bg-neutral-800 p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Log Workout</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded px-2 py-1 text-sm text-neutral-400 transition hover:bg-neutral-700"
            >
              Close
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass + ' w-full'}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">
                Split
              </label>
              <select
                value={selectedSplitId}
                onChange={(e) => handleSplitChange(e.target.value)}
                className={inputClass + ' w-full'}
              >
                <option value="">No split</option>
                {splits.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">
                Day
              </label>
              <select
                value={form.day}
                onChange={(e) => handleDayChange(e.target.value)}
                disabled={!selectedSplitId}
                className={
                  inputClass + ' w-full disabled:cursor-not-allowed disabled:opacity-40'
                }
              >
                <option value="">
                  {selectedSplitId ? 'Select day' : 'Pick a split first'}
                </option>
                {splits
                  .find((s) => s.id === selectedSplitId)
                  ?.days.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-neutral-300">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={form.durationMinutes}
              onChange={(e) =>
                setForm({ ...form, durationMinutes: e.target.value })
              }
              placeholder="e.g. 60"
              className={inputClass + ' w-full sm:w-40'}
            />
          </div>

          <div className="mt-5 space-y-3">
            {form.exercises.map((ex) => (
              <div key={ex.id} className="rounded-lg bg-neutral-900 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ex.name}
                    onChange={(e) => updateExercise(ex.id, e.target.value)}
                    placeholder="Exercise name"
                    className={inputClass + ' flex-1'}
                  />
                  <button
                    type="button"
                    onClick={() => removeExercise(ex.id)}
                    disabled={form.exercises.length <= 1}
                    className="rounded bg-neutral-800 px-3 text-sm text-red-400 transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {ex.sets.map((set) => (
                    <div key={set.id} className="flex items-center gap-2">
                      <span className="w-6 text-xs text-neutral-500">Set</span>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          updateSet(ex.id, set.id, { reps: e.target.value })
                        }
                        placeholder="Reps"
                        className={inputClass + ' w-24'}
                      />
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) =>
                          updateSet(ex.id, set.id, { weight: e.target.value })
                        }
                        placeholder="kg"
                        className={inputClass + ' w-24'}
                      />
                      <button
                        type="button"
                        onClick={() => removeSet(ex.id, set.id)}
                        disabled={ex.sets.length <= 1}
                        className="rounded bg-neutral-800 px-2 text-sm text-red-400 transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addSet(ex.id)}
                  className="mt-2 rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-300 transition hover:bg-neutral-700"
                >
                  + Add Set
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addExercise}
            className="mt-3 rounded-lg bg-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-600"
          >
            + Add Exercise
          </button>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-emerald-500 py-2 font-semibold text-neutral-950 transition hover:bg-emerald-400"
          >
            Save Workout
          </button>
        </form>
      )}
    </div>
  )
}

export default WorkoutLogger