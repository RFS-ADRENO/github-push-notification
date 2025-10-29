import { config } from "../../config.js";
import { Zalo } from "zca-js";
import path from "path";
import fs from "fs";

const CREDENTIAL_PATH = path.resolve(config.credentialPath);

const zalo = new Zalo({
    selfListen: false,
});

export async function loginToZalo() {
    if (fs.existsSync(CREDENTIAL_PATH)) {
        const credentials = JSON.parse(fs.readFileSync(CREDENTIAL_PATH, "utf-8"));
        const { cookie, imei, userAgent } = credentials;
        if (cookie && imei && userAgent) {
            let apiLocal = await zalo.login({ cookie, imei, userAgent }).catch((err) => {
                console.error("Zalo login with credentials failed:", err);
                return null;
            });

            if (apiLocal) {
                console.log("Zalo login successful.");
                return apiLocal;
            }
        }
    }

    console.log("Creating a new Zalo login session...");
    const apiLocal = await zalo.loginQR();

    const context = apiLocal.getContext();
    const newCredentials = {
        cookie: context.cookie.toJSON().cookies,
        imei: context.imei,
        userAgent: context.userAgent,
    };
    fs.writeFileSync(CREDENTIAL_PATH, JSON.stringify(newCredentials, null, 2));

    console.log("Zalo login successful and credentials saved.");
    return apiLocal;
}
