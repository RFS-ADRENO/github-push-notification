export const config = {
    // ENV variables
    credentialPath: process.env.CREDENTIAL_PATH || "./credentials.json",
    port: parseInt(process.env.PORT || "3000"),
    host: process.env.HOST || "0.0.0.0",
    githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET || "",

    adminUID: process.env.ADMIN_UID || "7020318121810504398",
    useZaloListener: process.env.USE_ZALO_LISTENER === "true" || false,
};
