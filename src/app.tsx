#!/usr/bin/env node
import React, { useEffect, useState } from 'react';
import { Box, render, Text } from 'ink';
import { NewsResponse } from './types/news.types.js';

interface CliOptions {
    sourceCountry: string;
    language: string;
    maxNewsPerCluster: number;
    apiKey: string;
    showHelp: boolean;
    showVersion: boolean;
}

const formatPublishDate = (date: string | undefined) => {
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

const getCliOptions = (): CliOptions => {
    const options: CliOptions = {
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
        } else if (arg === '--version' || arg === '-v') {
            options.showVersion = true;
        } else if (arg.startsWith('--country=')) {
            options.sourceCountry = arg.split('=')[1] || options.sourceCountry;
        } else if (arg === '--country' || arg === '-c') {
            const nextVal = args[index + 1];
            if (nextVal && !nextVal.startsWith('-')) {
                options.sourceCountry = nextVal;
                index += 1;
            }
        } else if (arg.startsWith('--language=')) {
            options.language = arg.split('=')[1] || options.language;
        } else if (arg === '--language' || arg === '-l') {
            const nextVal = args[index + 1];
            if (nextVal && !nextVal.startsWith('-')) {
                options.language = nextVal;
                index += 1;
            }
        } else if (arg.startsWith('--max-news-per-cluster=')) {
            const maxNews = Number(arg.split('=')[1]);
            if (Number.isInteger(maxNews) && maxNews > 0) {
                options.maxNewsPerCluster = maxNews;
            }
        } else if (arg === '--max-news-per-cluster' || arg === '-m' || arg === '--limit') {
            const nextVal = args[index + 1];
            if (nextVal && !nextVal.startsWith('-')) {
                const maxNews = Number(nextVal);
                if (Number.isInteger(maxNews) && maxNews > 0) {
                    options.maxNewsPerCluster = maxNews;
                }
                index += 1;
            }
        } else if (arg.startsWith('--api-key=')) {
            options.apiKey = arg.split('=')[1] || options.apiKey;
        } else if (arg === '--api-key' || arg === '-k') {
            const nextVal = args[index + 1];
            if (nextVal && !nextVal.startsWith('-')) {
                options.apiKey = nextVal;
                index += 1;
            }
        }
    }

    return options;
};

const HelpView = () => (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
        <Box
            flexDirection="column"
            paddingX={2}
            paddingY={1}
            backgroundColor="#14243a"
            borderStyle="round"
            borderColor="#38bdf8"
        >
            <Text color="#7dd3fc" bold>THE DAILY BRIEF CLI</Text>
            <Text color="white">Fetch and read top news stories directly in your terminal.</Text>
        </Box>
        <Box
            flexDirection="column"
            marginTop={1}
            paddingX={2}
            paddingY={1}
            borderStyle="round"
            borderColor="#334155"
        >
            <Text color="#38bdf8" bold>OPTIONS:</Text>
            <Text color="white">  -c, --country &lt;code&gt;              2-letter country code (default: "pk")</Text>
            <Text color="white">  -l, --language &lt;code&gt;             Language code (default: "en")</Text>
            <Text color="white">  -m, --max-news-per-cluster &lt;num&gt;  Max news items per cluster (default: 5)</Text>
            <Text color="white">  -k, --api-key &lt;key&gt;                World News API key</Text>
            <Text color="white">  -h, --help                         Show help information</Text>
            <Text color="white">  -v, --version                      Show CLI version</Text>
            
            <Box marginTop={1}>
                <Text color="#38bdf8" bold>EXAMPLES:</Text>
            </Box>
            <Text color="#a7f3d0">  $ npx @nehanahmed/today-in-history --country us</Text>
            <Text color="#a7f3d0">  $ npx @nehanahmed/today-in-history --country gb --language en --limit 3</Text>
            <Text color="#a7f3d0">  $ WORLD_NEWS_API="your_key" npx @nehanahmed/today-in-history --country pk</Text>
        </Box>
    </Box>
);

const KeyHelpView = () => (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
        <Box
            flexDirection="column"
            paddingX={2}
            paddingY={1}
            borderStyle="round"
            borderColor="#f59e0b"
            backgroundColor="#1e1b4b"
        >
            <Text color="#fbbf24" bold>API KEY REQUIRED</Text>
            <Text color="white">A World News API key is needed to fetch live news headlines.</Text>
        </Box>
        <Box
            flexDirection="column"
            marginTop={1}
            paddingX={2}
            paddingY={1}
            borderStyle="round"
            borderColor="#334155"
        >
            <Text color="#38bdf8" bold>How to provide your API key:</Text>
            <Text color="white">1. CLI flag:            <Text color="#a7f3d0">--api-key YOUR_API_KEY</Text></Text>
            <Text color="white">2. Environment variable: <Text color="#a7f3d0">export WORLD_NEWS_API="YOUR_API_KEY"</Text></Text>
            
            <Box marginTop={1}>
                <Text color="#cbd5e1">Get a free API key at: <Text color="#7dd3fc" underline>https://worldnewsapi.com/</Text></Text>
            </Box>
        </Box>
    </Box>
);

const PrintNews = () => {
    const cliOptions = getCliOptions();

    if (cliOptions.showHelp) {
        return <HelpView />;
    }

    if (cliOptions.showVersion) {
        return (
            <Box paddingX={1} paddingY={1}>
                <Text color="#38bdf8">@nehanahmed/today-in-history v1.0.0</Text>
            </Box>
        );
    }

    if (!cliOptions.apiKey) {
        return <KeyHelpView />;
    }

    const [news, setNews] = useState<NewsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

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

                const data: NewsResponse = await response.json();
                setNews(data);
            } catch (fetchError) {
                if (!controller.signal.aborted) {
                    setError(fetchError instanceof Error ? fetchError.message : 'Unable to load news.');
                }
            }
        };

        fetchNews();
        return () => controller.abort();
    }, [cliOptions.sourceCountry, cliOptions.language, cliOptions.maxNewsPerCluster, cliOptions.apiKey]);

    return (
        <Box flexDirection="column" paddingX={1} paddingY={1}>
            <Box
                flexDirection="column"
                paddingX={2}
                paddingY={1}
                backgroundColor="#14243a"
                borderStyle="round"
                borderColor="#38bdf8"
            >
                <Text color="#7dd3fc" bold>THE DAILY BRIEF</Text>
                <Text color="white" bold>Top news from {cliOptions.sourceCountry.toUpperCase()}</Text>
                <Text color="#cbd5e1" italic>Clear, concise headlines for today</Text>
            </Box>

            {error ? (
                <Box marginTop={1} paddingX={2} paddingY={1} borderStyle="round" borderColor="red">
                    <Text color="red" bold>News could not be loaded: </Text>
                    <Text color="white">{error}</Text>
                </Box>
            ) : news ? (
                news.top_news?.length > 0 ? (
                    news.top_news.map((newsCluster, index) => {
                        const article = newsCluster.news?.[0];

                        if (!article) {
                            return null;
                        }

                        return (
                            <Box
                                key={`${article.url}-${index}`}
                                flexDirection="column"
                                marginTop={1}
                                paddingX={2}
                                paddingY={1}
                                borderStyle="round"
                                borderColor="#334155"
                                backgroundColor="#111c2d"
                            >
                                <Text color="#38bdf8" bold>STORY {String(index + 1).padStart(2, '0')}</Text>
                                <Text color="white" bold>{article.title || 'Untitled story'}</Text>
                                <Text color="#cbd5e1">{article.summary || 'No summary is available for this story.'}</Text>
                                <Box marginTop={1}>
                                    <Text color="#94a3b8">PUBLISHED  </Text>
                                    <Text color="#e2e8f0">{formatPublishDate(article.publish_date)}</Text>
                                </Box>
                                <Box>
                                    <Text color="#94a3b8">BY  </Text>
                                    <Text color="#e2e8f0">{article.authors || 'Unknown author'}</Text>
                                </Box>
                                {article.url ? (
                                    <Box marginTop={1}>
                                        <Text color="#7dd3fc" underline>{article.url}</Text>
                                    </Box>
                                ) : null}
                            </Box>
                        );
                    })
                ) : (
                    <Box marginTop={1} paddingX={2}>
                        <Text color="#cbd5e1">No top news stories are available right now.</Text>
                    </Box>
                )
            ) : (
                <Box marginTop={1} paddingX={2}>
                    <Text color="#fbbf24" italic>Gathering the latest headlines...</Text>
                </Box>
            )}
        </Box>
    );
};

render(<PrintNews />);
