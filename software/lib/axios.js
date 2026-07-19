import axios from 'axios';

/**
 * Axios Instance Configuration
 * Optimized for Bearer Token stateless authentication.
 */
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request Interceptor: Attaches token to outgoing requests
axiosInstance.interceptors.request.use(
    (config) => {
        // Enforce leading slash for relative endpoint mappings
        if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/')) {
            config.url = `/${config.url}`;
        }

        // Safely extract and inject token if it exists in localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && token !== 'null' && token !== 'undefined') {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        console.error('[Axios Request Error]:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor: Handles global error catch blocks cleanly
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle physical network/server drops
        if (!error.response) {
            console.error('[Network Error]: Server unreachable or CORS preflight blocked.');
            return Promise.reject(new Error('Network connection issue.'));
        }

        const { status } = error.response;

        // Automatically clean up stale browser states on auth expiry
        if (status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;