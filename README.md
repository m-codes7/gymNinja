# GymNinja

A personal gym tracking web app built with React. Create a profile, log your workouts, track your goals, and visualise your weight progress. All in one dashboard.

> **Privacy first:** GymNinja has no backend, no accounts, and no data collection. Everything you enter is stored entirely in **your own browser's localStorage** and never leaves your machine. There are no servers, no analytics, and no third parties — your data is for your personal use only.

## Features

- **Profile setup** — enter your name, age, height and weight to get started
- **Personalised welcome screen** — greeted by name, with one press of Enter to enter the gym
- **Custom workout splits** — create, edit, and delete your own splits (e.g. Push/Pull/Legs) with days and exercises
- **Workout logging** — record sessions with date, split/day, exercises, sets, reps and weight, and session duration
- **Automatic stats** — GymNinja calculates your time in the gym per week and total weight lifted
- **Goal tracking** — set lift targets or weekly training-time goals, and mark them as achieved
- **Weight tracker** — log your body weight over time and view a line chart of your progress

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [React 19](https://react.dev) |
| Build tool | [Vite 8](https://vite.dev) |
| Routing | [React Router 7](https://reactrouter.com) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Charting | [Recharts 3](https://recharts.org) |
| Data storage | Browser localStorage (Web Storage API) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (version 18 or later recommended)
- npm (bundled with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd gym-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and go to [http://localhost:5173](http://localhost:5173)

### Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Build the production bundle into dist/
npm run preview  # Preview the production build locally
npm run lint     # Run oxlint
```

## How It Works

```
/ (Sign up) → /welcome (Welcome screen) → /dashboard (Dashboard)
```

- **`/`** — Create your profile (name, age, height, weight). Your starting weight is recorded automatically as your first weight entry.
- **`/welcome`** — A personalised greeting. Press **Enter** or click anywhere to continue.
- **`/dashboard`** — The full dashboard with stats, splits, goals, workout logging, and weight tracking.

If you've already created a profile, visiting `/` takes you straight to the welcome screen. A **Log out** button clears your data and returns to the start.

### Where is my data stored?

All data lives in a single localStorage key (`gym-ninja-data`) in your browser. It persists across refreshes and browser restarts, and it is never sent anywhere. Clearing your browser data for the site — or clicking **Log out** in the app — erases it.

## Project Structure

```
gym-tracker/
├── index.html                  # HTML entry point
├── vite.config.js              # Vite + Tailwind configuration
└── src/
    ├── main.jsx                # App bootstrap (BrowserRouter)
    ├── App.jsx                 # Route definitions
    ├── storage.js              # localStorage load/save helpers
    ├── pages/
    │   ├── SignUp.jsx          # Profile creation (name, age, height, weight)
    │   ├── Welcome.jsx         # Personalised welcome screen
    │   └── Dashboard.jsx       # Main dashboard (owns all app state)
    └── components/
        ├── StatsOverview.jsx   # Weekly gym time + total weight lifted
        ├── SplitsManager.jsx   # Create/edit/delete workout splits
        ├── GoalsManager.jsx    # Goals with "achieved" tracking
        ├── WorkoutLogger.jsx   # Log workouts & view history
        └── WeightTracker.jsx   # Weight logging + recharts line chart
```

## Roadmap Ideas

- Export/import your data as a JSON file for portability
- More chart types (volume trends, exercise progress)
- Workout templates / exercise database
- Notifications or reminders

---
Built with React, Vite, Tailwind CSS, and Recharts.
