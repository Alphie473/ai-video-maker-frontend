/**
 * Helper utility to build full media URLs for static backend assets (videos, images, audio),
 * resolving relative paths (/media/...) against VITE_API_URL when deployed on Render or local dev.
 */
export const getMediaUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  const rawBase = import.meta.env.VITE_API_URL || '';
  if (rawBase && rawBase.trim() !== '') {
    // Strip trailing /api or trailing slash to get origin root (e.g. https://backend.onrender.com)
    const origin = rawBase.trim().replace(/\/api\/?$/, '').replace(/\/+$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${origin}${cleanPath}`;
  }

  return url;
};
