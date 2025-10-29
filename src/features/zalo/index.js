import { loginToZalo } from "./login.js";

class ZaloAPI {
    /**
     * @type {ZaloAPI|null}
     */
    static instance = null;
    
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
        return this.api;
    }
    
    getAPI() {
        return this.api;
    }
}

export default ZaloAPI;
