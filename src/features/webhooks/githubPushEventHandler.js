import { TextStyle } from "zca-js";
import ZaloAPI from "../zalo/index.js";
import WebhookStore from "./store.js";

/**
 * Copilot Generated
 * @param {import("@octokit/webhooks").EmitterWebhookEvent<"push">} event
 */
export const githubPushEventHandler = async (event) => {
    const api = ZaloAPI.getInstance().getAPI();
    if (!api) {
        console.error("Zalo API is not initialized. Cannot send notifications.");
        return;
    }

    const listRegistered = WebhookStore.getInstance().getRegisteredThreads();
    for (const each of listRegistered) {
        const { threadId, threadType } = each;

        const branchName = event.payload.ref.replace("refs/heads/", "");
        const commitCount = event.payload.commits.length;
        const repoUrl = event.payload.repository.html_url;

        // New card-style layout
        const separator = "─".repeat(30);
        const header = `🚀 GITHUB PUSH NOTIFICATION`;
        
        // Repository info in compact format
        const repoSection = `${event.payload.repository.full_name} → ${branchName}`;
        const authorSection = `${event.payload.pusher.name} • ${commitCount} commit${commitCount > 1 ? 's' : ''}`;
        
        // Compact commit format
        const commitList = event.payload.commits
            .map((commit, index) => {
                const shortSha = commit.id.substring(0, 7);
                const time = new Date(commit.timestamp).toLocaleString("vi-VN", {
                    day: '2-digit',
                    month: '2-digit', 
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return `${shortSha} ${commit.message} (${commit.author.name} - ${time})`;
            })
            .join("\n");

        const footer = `🔗 ${repoUrl}/compare/${event.payload.before.substring(0,7)}...${event.payload.after.substring(0,7)}`;

        // Construct message with new layout
        const message = `${header}\n${separator}\n${repoSection}\n${authorSection}\n${separator}\n${commitList}\n${separator}\n${footer}`;

        // Card-style layout styling
        let currentPos = 0;
        const styles = [];

        // Style header (Bold + Big)
        styles.push(
            { st: TextStyle.Bold, start: currentPos, len: header.length },
            { st: TextStyle.Big, start: currentPos, len: header.length }
        );
        currentPos += header.length + 1; // +1 for \n
        
        // Skip separator line
        currentPos += separator.length + 1; // +1 for \n
        
        // Style repository name (Bold)
        styles.push({ st: TextStyle.Bold, start: currentPos, len: event.payload.repository.full_name.length });
        
        // Style branch name (Bold + Green)
        const branchStart = currentPos + event.payload.repository.full_name.length + 3; // +3 for " → "
        styles.push(
            { st: TextStyle.Bold, start: branchStart, len: branchName.length },
            { st: TextStyle.Green, start: branchStart, len: branchName.length }
        );
        currentPos += repoSection.length + 1; // +1 for \n
        
        // Style author name (Bold)
        styles.push({ st: TextStyle.Bold, start: currentPos, len: event.payload.pusher.name.length });
        currentPos += authorSection.length + 1; // +1 for \n
        
        // Skip separator
        currentPos += separator.length + 1; // +1 for \n
        
        // Style commit SHAs (Bold for each commit)
        for (let i = 0; i < event.payload.commits.length; i++) {
            const shortSha = event.payload.commits[i].id.substring(0, 7);
            styles.push({ st: TextStyle.Bold, start: currentPos, len: shortSha.length });
            
            if (i < event.payload.commits.length - 1) {
                currentPos += commitList.split('\n')[i].length + 1; // +1 for \n
            } else {
                currentPos += commitList.split('\n')[i].length + 1; // +1 for \n
            }
        }
        
        // Skip separator
        currentPos += separator.length + 1; // +1 for \n
        
        // Style footer link (Underline)
        styles.push({ st: TextStyle.Underline, start: currentPos, len: footer.length });

        api.sendMessage(
            {
                msg: message,
                styles: styles,
            },
            threadId,
            threadType
        ).catch(console.error);
    }
};
