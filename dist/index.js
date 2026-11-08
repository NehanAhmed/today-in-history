"use strict";
async function main() {
    const sourceCountry = 'pk';
    const language = 'en';
    const maxNewsPerCluster = 5;
    const data = await fetch(`https://api.worldnewsapi.com/top-news?source-country=${sourceCountry}&api-key=${process.env.WORLD_NEWS_API}&language=${language}&max-news-per-cluster=${maxNewsPerCluster}`);
    const news = await data.json();
    for (let i = 0; i < news.top_news.length; i++) {
        const newsCluster = news.top_news[i];
        const newses = newsCluster.news.at(1);
        console.log([
            `TOP NEWS - ITEM ${i + 1}`,
            '='.repeat(60),
            `Title: ${newses?.title ?? 'Untitled'}`,
            '',
            'Summary:',
            newses?.summary ?? 'No summary available.',
            '',
            `Published: ${newses?.publish_date ?? 'Unknown'}`,
            `Author(s): ${newses?.authors ?? 'Unknown'}`,
            `URL: ${newses?.url ?? 'Unavailable'}`,
            '-'.repeat(60),
        ].join('\n'));
    }
}
main();
