const STORAGE_KEY = 'gym-ninja-data'

function getDefaultData() {
  return { user: null, splits: [], workouts: [], goals: [], weights: [] }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultData()
    const parsed = JSON.parse(raw)
    return { ...getDefaultData(), ...parsed }
  } catch {
    return getDefaultData()
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY)
}

export function hasUser() {
  return Boolean(loadData().user)
}

export function getUUID() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}