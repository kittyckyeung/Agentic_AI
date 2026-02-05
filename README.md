# Agentic AI

An AI assistant powered by GitHub Copilot SDK that fetches social media stories from RSS feeds.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm package manager
- TypeScript
- GitHub Copilot CLI

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kittyckyeung/Agentic_AI.git
cd Agentic_AI
```

2. Install dependencies:
```bash
npm install
```

3. Install and authenticate GitHub Copilot CLI:
```bash
npm install -g @github/copilot-cli
copilot auth login
```

## How to Execute the Program

### Option 1: Using ts-node (Recommended for Development)

1. Install ts-node globally or as a dev dependency:
```bash
npm install -D ts-node
```

2. Run the program:
```bash
npx ts-node index.ts
```

### Option 2: Compile and Run

1. Compile TypeScript to JavaScript:
```bash
npx tsc index.ts
```

2. Run the compiled JavaScript:
```bash
node index.js
```

### Option 3: Using npm scripts

Add the following to your `package.json` scripts section:
```json
"scripts": {
  "start": "ts-node index.ts",
  "build": "tsc",
  "dev": "ts-node index.ts"
}
```

Then run:
```bash
npm start
```

## Usage

1. After starting the program, you'll see a prompt: `Enter your prompt:`

2. Type your questions or requests. The AI can:
   - Fetch latest social media stories from Yahoo RSS feed
   - Summarize stories
   - Answer general questions

3. To exit the program, type:
```
exit
```

## Example Interaction

```
Enter your prompt: What are the latest news stories?
Response: [AI fetches and summarizes the latest stories from Yahoo RSS feed]

Enter your prompt: exit
```

## Logging Levels

The program supports configurable logging levels for better debugging and control:

- **DEBUG**: Detailed information for debugging purposes.
- **INFO**: General information about the program's execution.
- **ERROR**: Errors that occur during execution.

To adjust the logging level, modify the `currentLogLevel` variable in `index.ts`:
```typescript
let currentLogLevel = LOG_LEVELS.DEBUG; // Change to LOG_LEVELS.INFO or LOG_LEVELS.ERROR as needed
```

## Dependencies

- `@github/copilot-sdk`: GitHub Copilot SDK for AI functionality
- `xml-js`: XML to JSON conversion for RSS feed parsing
- `readline`: Interactive command-line interface
- `process`: Node.js process management

## Troubleshooting

- If you encounter module resolution errors, ensure you have Node.js v18+ and all dependencies installed
- Make sure you have proper internet connection for fetching RSS feeds
- Verify that TypeScript is properly configured in your environment
- If you see authentication or model-listing errors, re-run `copilot auth login` and ensure your account has Copilot access