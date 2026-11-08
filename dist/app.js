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
    const options = { sourceCountry: 'pk', language: 'en', maxNewsPerCluster: 5 };
    const args = process.argv.slice(2);
    for (let index = 0; index < args.length; index += 1) {
        const value = args[index + 1];
        if (!value) {
            continue;
        }
        if (args[index] === '--country') {
            options.sourceCountry = value;
            index += 1;
        }
        else if (args[index] === '--language') {
            options.language = value;
            index += 1;
        }
        else if (args[index] === '--max-news-per-cluster') {
            const maxNews = Number(value);
            if (Number.isInteger(maxNews) && maxNews > 0) {
                options.maxNewsPerCluster = maxNews;
            }
            index += 1;
        }
    }
    return options;
};
const PrintNews = () => {
    const cliOptions = getCliOptions();
    const [news, setNews] = useState(null);
    const [error, setError] = useState(null);
    const [sourceCountry] = useState(cliOptions.sourceCountry);
    const [language] = useState(cliOptions.language);
    const [maxNewsPerCluster] = useState(cliOptions.maxNewsPerCluster);
    useEffect(() => {
        const controller = new AbortController();
        const fetchNews = async () => {
            try {
                const params = new URLSearchParams({
                    'source-country': sourceCountry,
                    'api-key': process.env.WORLD_NEWS_API ?? '',
                    language,
                    'max-news-per-cluster': String(maxNewsPerCluster),
                });
                const response = await fetch(`https://api.worldnewsapi.com/top-news?${params}`, {
                    signal: controller.signal,
                });
                if (!response.ok) {
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
    }, [sourceCountry, language, maxNewsPerCluster]);
    return (React.createElement(Box, { flexDirection: "column", paddingX: 1, paddingY: 1 },
        React.createElement(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, backgroundColor: "#14243a", borderStyle: "round", borderColor: "#38bdf8" },
            React.createElement(Text, { color: "#7dd3fc", bold: true }, "THE DAILY BRIEF"),
            React.createElement(Text, { color: "white", bold: true },
                "Top news from ",
                sourceCountry.toUpperCase()),
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
