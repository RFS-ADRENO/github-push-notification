import { loginToZalo } from "./login.js";

class ZaloAPI {
    /**
     * @type {ZaloAPI|null}
     */
    static instance = null;

    #keepAliveInterval = null;

    constructor() {
        if (ZaloAPI.instance) {
            return ZaloAPI.instance;
        }

        this.api = null;
        ZaloAPI.instance = this;
    }

    static getInstance() {
        if (!ZaloAPI.instance) {
            ZaloAPI.instance = new ZaloAPI();
        }
        return ZaloAPI.instance;
    }

    async startSession() {
        this.api = await loginToZalo();

        if (this.#keepAliveInterval) {
            clearInterval(this.#keepAliveInterval);
        }

        this.#keepAliveInterval = setInterval(() => {
            this.keepAlive();
        }, 2 * 60 * 1000); // every 2 minutes

        return this.api;
    }

    getAPI() {
        return this.api;
    }

    keepAlive() {
        if (this.api) {
            this.api.keepAlive().catch(console.error);
        }
    }
}

export default ZaloAPI;
