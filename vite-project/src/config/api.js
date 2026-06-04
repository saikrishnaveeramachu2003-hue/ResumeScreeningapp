export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:6002";

export const apiUrl = (path) => `${API_BASE}${path}`;
