export default class SyncManager {
    static KEY = 'kanban-ops-queue';

    static getQueue() {
        const json = localStorage.getItem(this.KEY);
        return json ? JSON.parse(json) : [];
    }

    static saveQueue(queue) {
        localStorage.setItem(this.KEY, JSON.stringify(queue));
        this.updateStatus();
    }

    static enqueue(op) {
        const queue = this.getQueue();
        const operation = {
            opId: op.opId || `${Date.now()}-${Math.random()}`,
            type: op.type,
            itemId: op.itemId,
            clientTempId: op.clientTempId,
            payload: op.payload || {},
            timestamp: op.timestamp || Date.now(),
        };
        queue.push(operation);
        this.saveQueue(queue);
        // try to flush immediately if online
        if (navigator.onLine) this.flush();
        return operation.opId;
    }

    static getPendingCount() {
        return this.getQueue().length;
    }

    static compressOps(ops) {
        // Simple compression: keep the last op per itemId (delete takes precedence)
        const map = new Map();
        for (const op of ops) {
            const key = op.itemId || op.clientTempId || op.opId;
            if (!map.has(key)) {
                map.set(key, op);
                continue;
            }
            const prev = map.get(key);
            if (op.type === 'delete') {
                map.set(key, op);
            } else if (prev.type === 'delete') {
                // keep delete
                map.set(key, prev);
            } else {
                // keep latest
                map.set(key, op);
            }
        }
        return Array.from(map.values());
    }

    static async flush() {
        const queue = this.getQueue();
        if (!queue.length) {
            this.updateStatus();
            return;
        }
        if (!navigator.onLine) return;

        this.updateStatus('syncing');

        const payload = { ops: this.compressOps(queue) };

        try {
            const res = await fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                // handle permanent 404 differently so user knows server isn't reachable
                if (res.status === 404) {
                    console.error('Sync endpoint not found (404). Please run the demo server or configure the correct endpoint.');
                    this.updateStatus('server-not-found');
                    return;
                }
                throw new Error(`Sync failed: ${res.status}`);
            }

            // For a quick prototype, assume server applied ops successfully and clear queue.
            // A real server should return per-op statuses and id mappings for temp ids.
            this.saveQueue([]);
            this.updateStatus('synced');
            return await res.json();
        } catch (err) {
            console.warn('Sync failed; will retry when online', err);
            this.updateStatus('pending');
            // leave queue intact for retry
        }
    }

    static updateStatus(state) {
        const el = document.querySelector('#status-indicator .status-text');
        if (!el) return;
        const count = this.getPendingCount();
        if (state === 'syncing') {
            el.textContent = `Syncing… (${count} pending)`;
        } else if (count === 0) {
            el.textContent = 'Online';
        } else {
            // if offline or pending
            el.textContent = `Offline — ${count} pending`;
        }
    }

    static start() {
        window.addEventListener('online', () => this.flush());
        // update status on load
        this.updateStatus();
        if (navigator.onLine) this.flush();
    }
}
