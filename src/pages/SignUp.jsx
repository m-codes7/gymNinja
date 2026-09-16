import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { hasUser, saveData, loadData, getUUID } from '../storage'
import itachiImg from '../assets/itachi.png'

function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', age: '', height: '', weight: '' })
  const [errors, setErrors] = useState({})

  if (hasUser()) {
    return <Navigate to="/welcome" replace />
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!form.age || Number(form.age) <= 0) nextErrors.age = 'Please enter a valid age.'
    if (!form.height || Number(form.height) <= 0) nextErrors.height = 'Please enter a valid height.'
    if (!form.weight || Number(form.weight) <= 0) nextErrors.weight = 'Please enter a valid weight.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const data = loadData()
    data.user = {
      id: getUUID(),
      name: form.name.trim(),
      age: Number(form.age),
      height: Number(form.height),
      weight: Number(form.weight),
    }
    data.weights = [
      {
        id: getUUID(),
        date: new Date().toISOString().slice(0, 10),
        value: Number(form.weight),
      },
    ]
    saveData(data)
    navigate('/welcome')
  }

  const inputClass =
    'w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30'

  const fieldError = (key) =>
    errors[key] ? (
      <p className="mt-1 text-sm text-red-400">{errors[key]}</p>
    ) : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src={itachiImg}
            alt="Itachi"
            className="mx-auto mb-5 w-44 object-contain"
          />
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Gym<span className="text-emerald-400">Ninja</span>
          </h1>
          <p className="mt-2 text-neutral-400">
            Create your profile to start your journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Alex"
                className={inputClass}
                autoFocus
              />
              {fieldError('name')}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="25"
                  className={inputClass}
                />
                {fieldError('age')}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  placeholder="180"
                  className={inputClass}
                />
                {fieldError('height')}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="80"
                  className={inputClass}
                />
                {fieldError('weight')}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-lg bg-emerald-500 py-3 font-semibold text-neutral-950 transition hover:bg-emerald-400 active:scale-[0.98]"
          >
            Start Training
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp