function getWeekStart() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  return monday.getTime()
}

function StatsOverview({ workouts }) {
  const weekStart = getWeekStart()
  const thisWeek = workouts.filter((w) => new Date(w.date + 'T00:00:00').getTime() >= weekStart)

  const weeklyMinutes = thisWeek.reduce(
    (sum, w) => sum + (w.durationMinutes || 0),
    0,
  )
  const weeklyHours = (weeklyMinutes / 60).toFixed(1)

  const totalWeight = workouts.reduce(
    (sum, w) =>
      sum +
      w.exercises.reduce(
        (s, ex) =>
          s + ex.sets.reduce((x, set) => x + set.reps * set.weight, 0),
        0,
      ),
    0,
  )

  const totalWorkouts = workouts.length

  const stats = [
    {
      label: 'Time in Gym This Week',
      value: `${weeklyHours}`,
      unit: 'hours',
      sub: thisWeek.length > 0 ? `${thisWeek.length} session${thisWeek.length > 1 ? 's' : ''}` : 'no sessions yet',
    },
    {
      label: 'Total Weight Lifted',
      value: Number(totalWeight).toLocaleString(),
      unit: 'kg',
      sub: `${totalWorkouts} workout${totalWorkouts === 1 ? '' : 's'} logged`,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
        >
          <p className="text-sm font-medium text-neutral-400">{stat.label}</p>
          <p className="mt-2 text-4xl font-extrabold text-white">
            {stat.value}
            <span className="ml-1 text-lg font-medium text-emerald-400">
              {stat.unit}
            </span>
          </p>
          <p className="mt-1 text-xs text-neutral-500">{stat.sub}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsOverview