import { CopilotClient, defineTool, SessionEvent } from "@github/copilot-sdk";
import * as convert from "xml-js";
import readline from "readline";
import process from "process";
import fs from "fs";

const LOG_LEVELS = { DEBUG: 0, INFO: 1, ERROR: 2 };
let currentLogLevel = LOG_LEVELS.ERROR;
const log = (level: number, message: string) => {
    if (level === 0) {
        message = `[DEBUG] ${message}\n`;
    } else if (level === 1) {
        message = `[INFO]  ${message}\n`;
    } else if (level === 2) {
        message = `[ERROR] ${message}\n`;
    }
    if (level >= currentLogLevel) {
        if (level === LOG_LEVELS.ERROR) {
            console.error(message);
        } else {
            console.log(message);
        }
    }
};

const keyLocation = 'C:/Users/user/Desktop/Coding/GITHub_Copilot_Key.txt';
let fileKey = "";
try {
    fileKey = fs.readFileSync(keyLocation, "utf-8").trim();
} catch (error) {
    log(LOG_LEVELS.ERROR, `The GITHub token file could not be read at ${keyLocation}: ${error}`);
}

const githubToken = fileKey;
if (!githubToken) {
    log(LOG_LEVELS.ERROR, "No GitHub token found. Exiting the program.");
    process.exit(1);
}

const getSocialStories = defineTool("get_social_stories", {
    description: "Get the latest social media stories from a given platform.",
    handler: async () => {
        const response = await fetch("http://news.yahoo.com/rss");
        const storiesXml = await response.text();
        log(LOG_LEVELS.DEBUG, `Get Stories XML: ${storiesXml}`);
        return convert.xml2json(storiesXml, { compact: true });
    },
});

const client = new CopilotClient({
    logLevel: "all",
    ...(githubToken ? { githubToken } : { useLoggedInUser: true }),
});

const session = await client.createSession({
    systemMessage: {
        content: "You are a helpful assistant that gets and summarizes social media stories.",
    },
    model: "gpt-4o",
    streaming: true,
    tools: [getSocialStories],
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

session.on((event: SessionEvent) => {
    log(LOG_LEVELS.DEBUG, `Event received: ${event.type}`);
    if (event.type === "assistant.message_delta") {
        process.stdout.write(event.data.deltaContent);
    } else if (event.type === "assistant.reasoning_delta") {
        process.stdout.write(event.data.deltaContent);
    } else if (event.type === "session.idle") {
        log(LOG_LEVELS.DEBUG, "Session is idle");
        console.log();
    }
});

const prompt = () => {
    rl.question("Enter Your Prompt: ", async (input) => {
        if (input.toLowerCase() === "exit") {
            await client.stop();
            rl.close();
            return;
        }

        log(LOG_LEVELS.DEBUG, `Sending prompt: ${input}`);
        process.stdout.write("Backend Response: ");
        try {
            log(LOG_LEVELS.DEBUG, `Calling sendAndWait...`);
            await session.sendAndWait({ prompt: input }, 60000 * 5);
            log(LOG_LEVELS.DEBUG, `sendAndWait completed`);
        } catch (error) {
            log(LOG_LEVELS.DEBUG, `sendAndWait failed ${error}`);
        }
        console.log("\n\n\n");
        prompt();
    });
};

prompt();