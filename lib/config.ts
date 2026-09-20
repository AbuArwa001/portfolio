/**
 * Normalizes and returns the backend API URL.
 * Automatically adds the https:// protocol if omitted, strips trailing slashes,
 * and falls back safely to the production backend in production or localhost in development.
 */
export function getApiUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url || !url.trim()) {
    return process.env.NODE_ENV === "production"
      ? "https://api.khalfanathman.dev"
      : "http://127.0.0.1:8000";
  }
  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Strip trailing slashes and redundant /api path if provided by environment
  url = url.replace(/\/+$/, "").replace(/\/api\/?$/, "");

  // Protect against deprecated or incorrect domain aliases
  if (url.includes("khalfanathman.site")) {
    url = url.replace(/https?:\/\/([^/]*\.)?khalfanathman\.site/, "https://api.khalfanathman.dev");
  }

  return url;
}

export const API_BASE_URL = getApiUrl();
