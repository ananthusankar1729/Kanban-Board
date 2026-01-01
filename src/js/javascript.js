import kanban from "./view/kanban.js";
import SyncManager from "./sync/SyncManager.js";

new kanban(
    document.querySelector(".kanban")
);

// Start the simple localStorage-based sync manager (flushes on reconnection)
SyncManager.start();
