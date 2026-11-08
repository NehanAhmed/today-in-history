interface NewsArticle {
    title: string
    text: string
    summary: string
    url: string
    image: string
    publish_date: string
    authors: string
}

interface NewsCategory {
    news: NewsArticle[]
}

interface NewsResponse {
    top_news: NewsCategory[]
    language: string
    country: string
}