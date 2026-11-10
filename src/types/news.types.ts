export interface NewsArticle {
    title: string;
    text: string;
    summary: string;
    url: string;
    image: string;
    publish_date: string;
    authors: string;
}

export interface NewsCategory {
    news: NewsArticle[];
}

export interface NewsResponse {
    top_news: NewsCategory[];
    language: string;
    country: string;
}
