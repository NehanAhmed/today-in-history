import React, { useEffect, useState } from 'react';
import { Box, render, Text } from 'ink';

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
        } else if (args[index] === '--language') {
            options.language = value;
            index += 1;
        } else if (args[index] === '--max-news-per-cluster') {
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
    const [news, setNews] = useState<NewsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
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
    }, [sourceCountry, language, maxNewsPerCluster]);

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
                <Text color="white" bold>Top news from {sourceCountry.toUpperCase()}</Text>
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
