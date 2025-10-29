import { config } from "../../config.js";

import express from "express";
import { verifySignature } from "./verifySignature.js";
import { githubPushEventHandler } from "./githubPushEventHandler.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/github-webhook", async (req, res) => {
    try {
        if (
            await verifySignature(
                config.githubWebhookSecret,
                req.headers["x-hub-signature-256"],
                req.body
            )
        ) {
            console.log("Received valid GitHub webhook event:", req.body);
        } else {
            console.warn("Invalid GitHub webhook signature.");
        }

        githubPushEventHandler({ payload: req.body });
        res.status(200).send("OK");
    } catch (error) {
        console.error("Error processing GitHub webhook:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/", (req, res) => {
    res.send("GitHub Push Notification Service is running.");
});

export const startServer = () => {
    app.listen(config.port, config.host, () => {
        console.log(`Server is running at http://localhost:${config.port}`);
    });
};
