import { config } from "../../config.js";
import WebhookStore from "../webhooks/store.js";
import ZaloAPI from "./index.js";

/**
 * @param {import('zca-js').Message} message
 */
export async function zaloCommandHandlers(message) {
    if (message.isSelf) return;
    if (message.data.uidFrom !== config.adminUID) return;
    if (typeof message.data.content !== "string") return;

    const content = message.data.content.toLowerCase().trim();
    const isCommand = content.startsWith("/");

    if (!isCommand) return;
    const args = content.slice(1).split(/\s+/);
    const command = args.shift();

    switch (command) {
        case "add": {
            WebhookStore.getInstance().addThread(message.threadId, message.type);

            ZaloAPI.getInstance()
                .getAPI()
                .sendMessage(
                    "✅ Đăng ký nhận thông báo thành công!",
                    message.threadId,
                    message.type
                )
                .catch(console.error);

            break;
        }
        case "remove": {
            WebhookStore.getInstance().removeThread(message.threadId);

            ZaloAPI.getInstance()
                .getAPI()
                .sendMessage(
                    "✅ Hủy đăng ký nhận thông báo thành công!",
                    message.threadId,
                    message.type
                )
                .catch(console.error);

            break;
        }
        default: {
            ZaloAPI.getInstance().getAPI().sendMessage(
                {
                    msg: `/add\n/remove`,
                },
                message.threadId,
                message.type
            );

            break;
        }
    }
}
