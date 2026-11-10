#!/usr/bin/env node
import React, { useEffect, useState } from 'react';
import { Box, render, Text } from 'ink';
const formatPublishDate = (date) => {
    if (!date) {
        return 'Date unavailable';
    }
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }
    return new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(parsedDate);
};
const getCliOptions = () => {
    const options = {
        sourceCountry: process.env.NEWS_COUNTRY || 'pk',
        language: process.env.NEWS_LANGUAGE || 'en',
        maxNewsPerCluster: 5,
        apiKey: process.env.WORLD_NEWS_API || process.env.WORLDNEWS_API_KEY || '',
        showHelp: false,
        showVersion: false,
    };
    const args = process.argv.slice(2);
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (arg === '--help' || arg === '-h') {
            options.showHelp = true;
        }
        else if (arg === '--version' || arg === '-v') {
            options.showVersion = true;
        }
        else if (arg.startsWith('--country=')) {
            options.sourceCountry = arg.split('=')[1] || options.sourceCountry;
        }
        else if (arg === '--country' || arg === '-c') {
            const nextVal = args[index + 1];
            if (nextVal && !nextVal.startsWith('-')) {
                options.sourceCountry = nextVal;
                index += 1;
            }
        }
        else if (arg.startsWith('--language=')) {
            options.language = arg.split('=')[1] || options.language;
        }
        else if (arg === '--language' || arg === '-l') {
            const nextVal = args[index + 1];
            if (nextVal && !nextVal.startsWith('-')) {
                options.language = nextVal;
                index += 1;
            }
        }
        else if (arg.startsWith('--max-news-per-cluster=')) {
            const maxNews = Number(arg.split('=')[1]);
            if (Number.isInteger(maxNews) && maxNews > 0) {
                options.maxNewsPerCluster = maxNews;
            }
        }
        else if (arg === '--max-news-per-cluster' || arg === '-m' || arg === '--limit') {
            const nextVal = args[index + 1];
            if (nextVal && !nextVal.startsWith('-')) {
                const maxNews = Number(nextVal);
                if (Number.isInteger(maxNews) && maxNews > 0) {
                    options.maxNewsPerCluster = maxNews;
                }
                index += 1;
            }
        }
        else if (arg.startsWith('--api-key=')) {
            options.apiKey = arg.split('=')[1] || options.apiKey;
        }
        else if (arg === '--api-key' || arg === '-k') {
            const nextVal = args[index + 1];
            if (nextVal && !nextVal.startsWith('-')) {
                options.apiKey = nextVal;
                index += 1;
            }
        }
    }
    return options;
};
const HelpView = () => (React.createElement(Box, { flexDirection: "column", paddingX: 1, paddingY: 1 },
    React.createElement(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, backgroundColor: "#14243a", borderStyle: "round", borderColor: "#38bdf8" },
        React.createElement(Text, { color: "#7dd3fc", bold: true }, "THE DAILY BRIEF CLI"),
        React.createElement(Text, { color: "white" }, "Fetch and read top news stories directly in your terminal.")),
    React.createElement(Box, { flexDirection: "column", marginTop: 1, paddingX: 2, paddingY: 1, borderStyle: "round", borderColor: "#334155" },
        React.createElement(Text, { color: "#38bdf8", bold: true }, "OPTIONS:"),
        React.createElement(Text, { color: "white" }, "  -c, --country <code>              2-letter country code (default: \"pk\")"),
        React.createElement(Text, { color: "white" }, "  -l, --language <code>             Language code (default: \"en\")"),
        React.createElement(Text, { color: "white" }, "  -m, --max-news-per-cluster <num>  Max news items per cluster (default: 5)"),
        React.createElement(Text, { color: "white" }, "  -k, --api-key <key>                World News API key"),
        React.createElement(Text, { color: "white" }, "  -h, --help                         Show help information"),
        React.createElement(Text, { color: "white" }, "  -v, --version                      Show CLI version"),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { color: "#38bdf8", bold: true }, "EXAMPLES:")),
        React.createElement(Text, { color: "#a7f3d0" }, "  $ npx @nehanahmed/today-in-history --country us"),
        React.createElement(Text, { color: "#a7f3d0" }, "  $ npx @nehanahmed/today-in-history --country gb --language en --limit 3"),
        React.createElement(Text, { color: "#a7f3d0" }, "  $ WORLD_NEWS_API=\"your_key\" npx @nehanahmed/today-in-history --country pk"))));
const KeyHelpView = () => (React.createElement(Box, { flexDirection: "column", paddingX: 1, paddingY: 1 },
    React.createElement(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, borderStyle: "round", borderColor: "#f59e0b", backgroundColor: "#1e1b4b" },
        React.createElement(Text, { color: "#fbbf24", bold: true }, "API KEY REQUIRED"),
        React.createElement(Text, { color: "white" }, "A World News API key is needed to fetch live news headlines.")),
    React.createElement(Box, { flexDirection: "column", marginTop: 1, paddingX: 2, paddingY: 1, borderStyle: "round", borderColor: "#334155" },
        React.createElement(Text, { color: "#38bdf8", bold: true }, "How to provide your API key:"),
        React.createElement(Text, { color: "white" },
            "1. CLI flag:            ",
            React.createElement(Text, { color: "#a7f3d0" }, "--api-key YOUR_API_KEY")),
        React.createElement(Text, { color: "white" },
            "2. Environment variable: ",
            React.createElement(Text, { color: "#a7f3d0" }, "export WORLD_NEWS_API=\"YOUR_API_KEY\"")),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { color: "#cbd5e1" },
                "Get a free API key at: ",
                React.createElement(Text, { color: "#7dd3fc", underline: true }, "https://worldnewsapi.com/"))))));
const PrintNews = () => {
    const cliOptions = getCliOptions();
    if (cliOptions.showHelp) {
        return React.createElement(HelpView, null);
    }
    if (cliOptions.showVersion) {
        return (React.createElement(Box, { paddingX: 1, paddingY: 1 },
            React.createElement(Text, { color: "#38bdf8" }, "@nehanahmed/today-in-history v1.0.0")));
    }
    if (!cliOptions.apiKey) {
        return React.createElement(KeyHelpView, null);
    }
    const [news, setNews] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const controller = new AbortController();
        const fetchNews = async () => {
            try {
                const params = new URLSearchParams({
                    'source-country': cliOptions.sourceCountry,
                    'api-key': cliOptions.apiKey,
                    language: cliOptions.language,
                    'max-news-per-cluster': String(cliOptions.maxNewsPerCluster),
                });
                const response = await fetch(`https://api.worldnewsapi.com/top-news?${params}`, {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        throw new Error(`Invalid API key or unauthorized access (${response.status})`);
                    }
                    throw new Error(`Request failed (${response.status})`);
                }
                const data = await response.json();
                setNews(data);
            }
            catch (fetchError) {
                if (!controller.signal.aborted) {
                    setError(fetchError instanceof Error ? fetchError.message : 'Unable to load news.');
                }
            }
        };
        fetchNews();
        return () => controller.abort();
    }, [cliOptions.sourceCountry, cliOptions.language, cliOptions.maxNewsPerCluster, cliOptions.apiKey]);
    return (React.createElement(Box, { flexDirection: "column", paddingX: 1, paddingY: 1 },
        React.createElement(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, backgroundColor: "#14243a", borderStyle: "round", borderColor: "#38bdf8" },
            React.createElement(Text, { color: "#7dd3fc", bold: true }, "THE DAILY BRIEF"),
            React.createElement(Text, { color: "white", bold: true },
                "Top news from ",
                cliOptions.sourceCountry.toUpperCase()),
            React.createElement(Text, { color: "#cbd5e1", italic: true }, "Clear, concise headlines for today")),
        error ? (React.createElement(Box, { marginTop: 1, paddingX: 2, paddingY: 1, borderStyle: "round", borderColor: "red" },
            React.createElement(Text, { color: "red", bold: true }, "News could not be loaded: "),
            React.createElement(Text, { color: "white" }, error))) : news ? (news.top_news?.length > 0 ? (news.top_news.map((newsCluster, index) => {
            const article = newsCluster.news?.[0];
            if (!article) {
                return null;
            }
            return (React.createElement(Box, { key: `${article.url}-${index}`, flexDirection: "column", marginTop: 1, paddingX: 2, paddingY: 1, borderStyle: "round", borderColor: "#334155", backgroundColor: "#111c2d" },
                React.createElement(Text, { color: "#38bdf8", bold: true },
                    "STORY ",
                    String(index + 1).padStart(2, '0')),
                React.createElement(Text, { color: "white", bold: true }, article.title || 'Untitled story'),
                React.createElement(Text, { color: "#cbd5e1" }, article.summary || 'No summary is available for this story.'),
                React.createElement(Box, { marginTop: 1 },
                    React.createElement(Text, { color: "#94a3b8" }, "PUBLISHED  "),
                    React.createElement(Text, { color: "#e2e8f0" }, formatPublishDate(article.publish_date))),
                React.createElement(Box, null,
                    React.createElement(Text, { color: "#94a3b8" }, "BY  "),
                    React.createElement(Text, { color: "#e2e8f0" }, article.authors || 'Unknown author')),
                article.url ? (React.createElement(Box, { marginTop: 1 },
                    React.createElement(Text, { color: "#7dd3fc", underline: true }, article.url))) : null));
        })) : (React.createElement(Box, { marginTop: 1, paddingX: 2 },
            React.createElement(Text, { color: "#cbd5e1" }, "No top news stories are available right now.")))) : (React.createElement(Box, { marginTop: 1, paddingX: 2 },
            React.createElement(Text, { color: "#fbbf24", italic: true }, "Gathering the latest headlines...")))));
};
render(React.createElement(PrintNews, null));
