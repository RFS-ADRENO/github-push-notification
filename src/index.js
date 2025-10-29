import { config } from "./config.js";
import { startServer } from "./features/webhooks/server.js";
import WebhookStore from "./features/webhooks/store.js";
import ZaloAPI from "./features/zalo/index.js";
import { startZaloListener } from "./features/zalo/listener.js";


await ZaloAPI.getInstance().startSession();
if (config.useZaloListener) startZaloListener();

WebhookStore.getInstance().loadFromDisk();
startServer();
