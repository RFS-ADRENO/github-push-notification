import path from "node:path";
import fs from "node:fs";

function safeParseJSON(jsonString, defaultValue) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return defaultValue;
    }
}

class WebhookStore {
    /**
     * @type {WebhookStore|null}
     */
    static instance = null;
    static DISK_PATH = 'webhook_store.json';

    /**
     * @returns {WebhookStore}
     */
    static getInstance() {
        if (!WebhookStore.instance) {
            WebhookStore.instance = new WebhookStore();
        }
        return WebhookStore.instance;
    }

    constructor() {
        this.registeredThreads = new Array();
    }

    loadFromDisk() {
        if (!fs.existsSync(path.resolve(WebhookStore.DISK_PATH))) {
            this.registeredThreads = [];
            return;
        }

        const data = fs.readFileSync(path.resolve(WebhookStore.DISK_PATH), 'utf-8');
        this.registeredThreads = safeParseJSON(data, []);
    }

    addThread(threadId, threadType) {
        if (this.registeredThreads.some(thread => thread.threadId === threadId)) {
            return;
        }
        this.registeredThreads.push({ threadId, threadType });
        this.saveToDisk();
    }

    removeThread(threadId) {
        this.registeredThreads = this.registeredThreads.filter(thread => thread.threadId !== threadId);
        this.saveToDisk();
    }

    getRegisteredThreads() {
        return this.registeredThreads;
    }

    saveToDisk() {
        fs.writeFileSync(
            path.resolve(WebhookStore.DISK_PATH),
            JSON.stringify(this.registeredThreads, null, 2),
            'utf-8'
        );
    }
}

export default WebhookStore;
