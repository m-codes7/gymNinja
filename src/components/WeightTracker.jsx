import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getUUID } from '../storage'

function todayStr() {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10)
}

function WeightTracker({ weights, setWeights }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: todayStr(), value: '' })
  const [error, setError] = useState('')

  const chartData = weights
    .slice()
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((w) => ({
      date: w.date,
      weight: w.value,
      label: w.date,
    }))

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.value || Number(form.value) <= 0) {
      setError('Enter a valid weight.')
      return
    }

    const entry = {
      id: getUUID(),
      date: form.date,
      value: Number(form.value),
    }
    setWeights((prev) => [...prev, entry])
    setForm({ date: todayStr(), value: '' })
    setShowForm(false)
    setError('')
  }

  function handleDelete(id) {
    setWeights((prev) => prev.filter((w) => w.id !== id))
  }

  const inputClass =
    'w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder-neutral-500 outline-none transition focus:border-emerald-400'

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Weight Tracker</h2>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
        >
          + Log Weight
        </button>
      </div>

      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#737373', fontSize: 12 }}
                stroke="#262626"
              />
              <YAxis
                tick={{ fill: '#737373', fontSize: 12 }}
                stroke="#262626"
                domain={['auto', 'auto']}
                unit=" kg"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid #262626',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => [`${value} kg`, 'Weight']}
                labelStyle={{ color: '#a3a3a3' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#34d399"
                strokeWidth={2}
                dot={{ fill: '#34d399', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-neutral-700 bg-neutral-800/50 py-6 text-center text-neutral-400">
          No weight data yet. Log your first entry!
        </p>
      )}

      {chartData.length > 0 && (
        <div className="mt-4 max-h-40 overflow-y-auto">
          <ul className="space-y-1">
            {weights
              .slice()
              .sort((a, b) => (a.date > b.date ? 1 : -1))
              .map((w) => (
                <li
                  key={w.id}
                  className="flex items-center justify-between rounded-lg bg-neutral-800 px-3 py-2 text-sm"
                >
                  <span className="text-neutral-400">{w.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">{w.value} kg</span>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="text-xs text-red-400 transition hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-neutral-700 bg-neutral-800 p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Log Weight</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded px-2 py-1 text-sm text-neutral-400 transition hover:bg-neutral-700"
            >
              Close
            </button>
          </div>

          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-neutral-300">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-neutral-300">
                Weight (kg)
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="e.g. 82.5"
                className={inputClass}
                step="0.1"
              />
            </div>
          </div>

          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-emerald-500 py-2 font-semibold text-neutral-950 transition hover:bg-emerald-400"
          >
            Save
          </button>
        </form>
      )}
    </div>
  )
}

export default WeightTracker