A minimal, client-side Kanban board demo with drag‑and‑drop, persistent localStorage state, and a simple offline-first sync manager (with an optional demo server).

About (short paragraph)
This project is a single-page web app built with plain HTML, CSS, and modular JavaScript. It lets you add, edit, drag, and reorder tasks across three columns (Not Started, In Progress, Completed). Changes are saved to localStorage and queued by a small SyncManager so operations can be flushed to a backend when online; a tiny demo server (server.js) accepts POST /api/sync for testing.

Key features

1.Drag-and-drop task movement and reordering 
2.Create/edit/delete tasks with contenteditable items 
3.Local persistence via localStorage 
4.Offline-first queueing and compression of operations (SyncManager) 
5.Demo sync endpoint (server.js) for testing real sync flow 
