import { zaloCommandHandlers } from "./commandHandlers.js";
import ZaloAPI from "./index.js";

let listener = null;

export function startZaloListener() {
    if (listener) {
        listener.stop();
    }

    const zalo = ZaloAPI.getInstance();
    const api = zalo.getAPI();

    if (!api) {
        console.error("Zalo API is not initialized. Cannot start listener.");
        return;
    }

    const { listener: listenerLocal } = api;

    listenerLocal.on("message", (msg) => {
        zaloCommandHandlers(msg).catch(console.error);
    });

    listenerLocal.start();

    listener = listenerLocal;
}

process.on("beforeExit", () => {
    if (listener) {
        listener.stop();
    }
});
