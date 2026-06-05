export const API_BASE = import.meta.env.VITE_API_BASE || "http://16.113.16.42:6002";

export const apiUrl = (path) => `${API_BASE}${path}`;
