# Today in History CLI

[![npm version](https://img.shields.io/npm/v/@nehanahmed/today-in-history.svg)](https://www.npmjs.com/package/@nehanahmed/today-in-history)
[![npm downloads](https://img.shields.io/npm/dm/@nehanahmed/today-in-history.svg)](https://www.npmjs.com/package/@nehanahmed/today-in-history)
[![license](https://img.shields.io/npm/l/@nehanahmed/today-in-history.svg)](LICENSE)
[![node version](https://img.shields.io/node/v/@nehanahmed/today-in-history.svg)](https://nodejs.org/)

A beautiful, zero-config terminal application to fetch and read top news headlines from around the world. Built with **React** and **Ink** for a smooth, interactive CLI experience.

![Today in History CLI Demo](https://github.com/NehanAhmed/today-in-history/raw/main/assets/demo.gif)

---

## Features

- **Beautiful Terminal UI** — Rich, colored output with borders and formatted headlines
- **Country-Specific News** — Fetch top stories from any supported country (2-letter code)
- **Multi-Language Support** — Read headlines in your preferred language
- **Configurable Output** — Limit the number of stories per cluster
- **Multiple API Key Methods** — Pass via flag, environment variable, or shell config
- **Zero Config** — Run instantly with `npx`, no installation required
- **Graceful Error Handling** — Clear messages for missing/invalid API keys and network errors

---

## Quick Start

```bash
# Run instantly with npx (no installation needed)
npx @nehanahmed/today-in-history --country us

# Or with a specific API key
npx @nehanahmed/today-in-history --country pk --api-key YOUR_API_KEY
```

---

## Installation

### Global Install (recommended for frequent use)

```bash
npm install -g @nehanahmed/today-in-history
# or
pnpm add -g @nehanahmed/today-in-history
# or
yarn global add @nehanahmed/today-in-history
```

Then run anywhere:
```bash
today-in-history --country gb --limit 3
```

### Run with npx (no install)

```bash
npx @nehanahmed/today-in-history --country jp --language ja
```

---

## Usage

```bash
today-in-history [options]
```

### Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--country <code>` | `-c` | 2-letter country code (ISO 3166-1 alpha-2) | `pk` |
| `--language <code>` | `-l` | Language code (ISO 639-1) | `en` |
| `--max-news-per-cluster <num>` | `-m`, `--limit` | Maximum news items per cluster | `5` |
| `--api-key <key>` | `-k` | World News API key | `WORLD_NEWS_API` env |
| `--help` | `-h` | Show help information | - |
| `--version` | `-v` | Show CLI version | - |

### Examples

```bash
# US top news in English (5 stories per cluster)
today-in-history --country us

# UK top news, only 3 stories per cluster
today-in-history --country gb --limit 3

# Japan top news in Japanese
today-in-history --country jp --language ja

# Using environment variable for API key
export WORLD_NEWS_API="your_api_key_here"
today-in-history --country ca

# Pass API key directly via flag
today-in-history --api-key "your_api_key_here" --country au
```

---

## API Key

This CLI uses the [World News API](https://worldnewsapi.com/) to fetch live news data.

### Getting an API Key

1. Visit [worldnewsapi.com](https://worldnewsapi.com/)
2. Sign up for a **free account** (includes 1,000 requests/month)
3. Copy your API key from the dashboard

### Providing the API Key

**Option 1: Environment Variable (recommended)**
```bash
# Linux/macOS (add to ~/.bashrc, ~/.zshrc, or ~/.profile)
export WORLD_NEWS_API="your_api_key_here"

# Windows PowerShell (persistent)
[Environment]::SetEnvironmentVariable("WORLD_NEWS_API", "your_api_key_here", "User")

# Windows CMD (current session only)
set WORLD_NEWS_API=your_api_key_here
```

**Option 2: CLI Flag**
```bash
today-in-history-cli --api-key "your_api_key_here" --country us
```

**Option 3: Alternative Environment Variables**
The CLI also checks for `WORLDNEWS_API_KEY` if `WORLD_NEWS_API` is not set.

> ⚠️ **Security Note:** Never commit API keys to version control. Use environment variables or a `.env` file (add it to `.gitignore`).

---

## Supported Countries & Languages

The CLI accepts any valid 2-letter country code supported by the World News API. Common examples:

| Country | Code |
|---------|------|
| Pakistan | `pk` |
| United States | `us` |
| United Kingdom | `gb` |
| India | `in` |
| Germany | `de` |
| France | `fr` |
| Japan | `jp` |
| Australia | `au` |
| Canada | `ca` |

Language codes follow ISO 639-1 (e.g., `en`, `es`, `fr`, `de`, `ja`, `zh`, `ar`, `hi`).

---

## Development

```bash
# Clone the repository
git clone https://github.com/NehanAhmed/today-in-history.git
cd today-in-history

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run locally
npm start

# Run with custom options
npm start -- --country us --limit 3
```

### Project Structure

```
today-in-history/
├── src/
│   ├── app.tsx              # Main CLI entry point (React + Ink)
│   └── types/
│       └── news.types.ts    # TypeScript interfaces
├── dist/                    # Compiled JavaScript output
├── LICENSE                  # MIT License
├── package.json
├── tsconfig.json
└── README.md
```

---

## Tech Stack

- **TypeScript** — Type-safe development
- **React** — Component-based UI
- **Ink** — React renderer for CLI applications
- **Node.js** — Runtime (>= 18.0.0)

---

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting PRs.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Links

- **Repository:** [github.com/NehanAhmed/today-in-history](https://github.com/NehanAhmed/today-in-history)
- **Issues:** [github.com/NehanAhmed/today-in-history/issues](https://github.com/NehanAhmed/today-in-history/issues)
- **NPM Package:** [npmjs.com/package/@nehanahmed/today-in-history](https://www.npmjs.com/package/@nehanahmed/today-in-history)
- **World News API:** [worldnewsapi.com](https://worldnewsapi.com/)

---

Built with ❤️ by [Nehan Ahmed](https://github.com/NehanAhmed)