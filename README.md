# Kanban-Board

A minimal, client-side Kanban board demo with drag-and-drop, persistent localStorage state, and a simple offline-first sync manager (with an optional demo server).

## About
This is a single-page web app built with plain HTML, CSS, and modular JavaScript. It lets you add, edit, drag, and reorder tasks across three columns (Not Started, In Progress, Completed). Changes are saved to `localStorage` and queued by a lightweight `SyncManager` so operations can be flushed to a backend when online. A tiny demo server (`server.js`) is included to accept `POST /api/sync` payloads for testing.

## Features
- Drag-and-drop task movement and reordering
- Create/edit/delete tasks with `contenteditable` items
- Local persistence via `localStorage`
- Offline-first queueing and compression of operations (`SyncManager`)
- Demo sync endpoint (`server.js`) for testing real sync flow

## Quick start
- Open locally: open `index.html` in your browser (static demo).
- Run demo sync server (optional):
  - `npm install` (if needed)
  - `npm start` (starts the demo server on port 3000)
- The app will enqueue ops and POST to `/api/sync` when online.

## Usage notes
- Click **+ Add** in a column to create a new task; click to edit (press Enter or blur to save).
- Drag a task to move it between columns or reorder within a column.
- Sync status is shown in the header; pending ops are retried when online.

## Developer notes
- Entry files: `index.html`, `style.css`, `src/js/...` (modular view, API, and sync code).
- Start demo server: `npm start` (server logs received sync payloads).
- Data keys in `localStorage`: `kanban-data` and `kanban-ops-queue`.

## Enabling GitHub Pages
1. In your repository on GitHub, go to **Settings → Pages**.
2. Under **Source** choose the `main` branch and `/ (root)` folder, then save.
3. If you previously tried to create a file on GitHub with the same name and saw an error, that means the file already existed on the branch—edit or remove the existing file instead of creating a duplicate.

## License
MIT
