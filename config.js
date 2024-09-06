const PAGE_URL = process.env.NODE_ENV === 'production'
    ? 'placeholder'
    : 'http://localhost:5173';

    const MONGO_URL = process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI_PRODUC
    : process.env.MONGO_URI_TEST

module.exports = {
    PAGE_URL,
    MONGO_URL,
}