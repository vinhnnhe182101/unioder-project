export const resolveImageUrl = (url) => {
    if (!url) return null;

    const BASE_IMG_URL = import.meta.env.VITE_API_URL || 'http://localhost:80/api';

    return url.startsWith('http')
        ? url
        : `${BASE_IMG_URL}/catalog${url}`;
};