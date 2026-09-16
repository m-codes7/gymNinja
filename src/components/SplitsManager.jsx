import { useState } from 'react'
import { getUUID } from '../storage'

const DAY_PRESETS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

function EmptySplitForm() {
  return {
    name: '',
    days: [{ id: getUUID(), name: 'Monday', exercises: '' }],
  }
}

function SplitsManager({ splits, setSplits }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EmptySplitForm())
  const [error, setError] = useState('')

  function openCreate() {
    setEditingId(null)
    setForm(EmptySplitForm())
    setShowForm(true)
    setError('')
  }

  function openEdit(split) {
    setEditingId(split.id)
    setForm({
      name: split.name,
      days: split.days.map((d) => ({
        id: d.id,
        name: d.name,
        exercises: d.exercises.join(', '),
      })),
    })
    setShowForm(true)
    setError('')
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EmptySplitForm())
    setError('')
  }

  function updateDay(id, patch) {
    setForm((f) => ({
      ...f,
      days: f.days.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }))
  }

  function addDay() {
    setForm((f) => ({
      ...f,
      days: [
        ...f.days,
        { id: getUUID(), name: 'Monday', exercises: '' },
      ],
    }))
  }

  function removeDay(id) {
    setForm((f) => ({
      ...f,
      days: f.days.length > 1 ? f.days.filter((d) => d.id !== id) : f.days,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Give your split a name.')
      return
    }

    const days = form.days
      .filter((d) => d.exercises.trim())
      .map((d) => ({
        id: d.id,
        name: d.name || 'Workout',
        exercises: d.exercises
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
      }))

    if (days.length === 0) {
      setError('Add at least one day with exercises.')
      return
    }

    const split = { id: editingId || getUUID(), name: form.name.trim(), days }

    if (editingId) {
      setSplits((prev) => prev.map((s) => (s.id === editingId ? split : s)))
    } else {
      setSplits((prev) => [...prev, split])
    }
    closeForm()
  }

  function handleDelete(id) {
    if (confirm('Delete this split?')) {
      setSplits((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const inputClass =
    'w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder-neutral-500 outline-none transition focus:border-emerald-400'

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Current Splits</h2>
        <button
          onClick={openCreate}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
        >
          + New Split
        </button>
      </div>

      {splits.length === 0 && !showForm ? (
        <p className="rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 py-6 text-center text-neutral-400">
          No splits yet. Create your first workout split!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {splits.map((split) => (
            <div
              key={split.id}
              className="rounded-xl border border-neutral-700 bg-neutral-800 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-emerald-400">{split.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(split)}
                    className="rounded px-2 py-1 text-xs text-neutral-300 transition hover:bg-neutral-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(split.id)}
                    className="rounded px-2 py-1 text-xs text-red-400 transition hover:bg-neutral-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <ul className="mt-3 space-y-2">
                {split.days.map((day) => (
                  <li key={day.id} className="text-sm">
                    <span className="font-medium text-neutral-300">
                      {day.name}:
                    </span>{' '}
                    <span className="text-neutral-400">
                      {day.exercises.join(', ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-neutral-700 bg-neutral-800 p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">
              {editingId ? 'Edit Split' : 'New Split'}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="rounded px-2 py-1 text-sm text-neutral-400 transition hover:bg-neutral-700"
            >
              Close
            </button>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-neutral-300">
              Split Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Push/Pull/Legs"
              className={inputClass}
            />
          </div>

          <div className="mt-4 space-y-3">
            {form.days.map((day) => (
              <div key={day.id} className="rounded-lg bg-neutral-900 p-3">
                <div className="flex gap-2">
                  <select
                    value={day.name}
                    onChange={(e) => updateDay(day.id, { name: e.target.value })}
                    className={inputClass + ' sm:w-40'}
                  >
                    {DAY_PRESETS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeDay(day.id)}
                    disabled={form.days.length <= 1}
                    className="rounded bg-neutral-800 px-3 text-sm text-red-400 transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={day.exercises}
                  onChange={(e) =>
                    updateDay(day.id, { exercises: e.target.value })
                  }
                  placeholder="Exercises (comma separated), e.g. Bench Press, OHP, Tricep Dips"
                  className={inputClass + ' mt-2'}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addDay}
            className="mt-3 rounded-lg bg-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-600"
          >
            + Add Day
          </button>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-emerald-500 py-2 font-semibold text-neutral-950 transition hover:bg-emerald-400"
          >
            {editingId ? 'Save Changes' : 'Create Split'}
          </button>
        </form>
      )}
    </div>
  )
}

export default SplitsManager