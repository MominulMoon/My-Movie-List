# My Movie List

A lightweight React movie tracker app where users can search movies, rate watched movies, and keep watched history saved in a CSV-backed backend.

---

## Introduction

**My Movie List** is a simple and practical movie app built with React.  
It uses the OMDb API for search/details and a small Node.js + Express backend for storing watched movie data in a `.csv` file.

This project is designed to be:

- Easy to run
- Easy to understand
- Lightweight for local development and learning

---

## Project Structure

```txt
My-Movie-List/
├─ src/                    # React frontend
│  ├─ App.jsx
│  ├─ MovieDetails.jsx
│  ├─ MovieList.jsx
│  ├─ WatchedMovieList.jsx
│  └─ ...other UI components
├─ server/                 # Node + Express backend
│  ├─ index.js             # API endpoints for watched movies
│  └─ data/
│     └─ watched.csv       # Persistent watched movie storage
├─ vite.config.js          # Vite config + API proxy
├─ package.json            # Scripts and dependencies
└─ README.md
```

---

## User Guide

### 1) Install dependencies

```bash
npm i
```

### 2) Run full application (frontend + backend)

```bash
npm run dev:full
```

This runs:

- React frontend (Vite)
- Express backend (CSV API)

### 3) Other useful commands

```bash
# Run only frontend
npm run dev

# Run only backend
npm run dev:server

# Build production frontend
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Product Features

- Search movies by title from OMDb API
- View movie details (rating, runtime, plot, cast, etc.)
- Give personal star rating before adding to watched list
- Save watched movies with rating data
- Delete watched movies from UI and backend storage
- Persistent storage in `server/data/watched.csv`
- Clean, simple, and lightweight architecture

---

## Data Persistence Note

At first, watched movie data was only in frontend state, so data disappeared after reload/close.  
To solve this, a backend API was added to read/write watched movies into a CSV file.

### Difficulty faced

One of the main development challenges was adding reliable data updates to backend `.csv` storage, especially making sure:

- New watched movies are written correctly
- Deleted movies are removed from CSV
- Frontend and backend stay in sync during development

---

## Why This Project Is Lightweight

- Minimal dependencies
- No complex database setup
- CSV-based local persistence
- Fast startup with Vite + small Express server
- Suitable for learning React state + backend integration

---

## Developer Bio

**MD Moon Babu**  
**RUET CSE**

Passionate about building practical and user-friendly software while continuously improving full-stack development skills.

---

## Future Improvements (Optional Ideas)

- Add edit/update rating for already watched movies
- Add sorting/filtering (by rating, runtime, year)
- Add export/import for watched data
- Add deployment-ready database option (SQLite or MongoDB)
- Add tests for API and UI flows
