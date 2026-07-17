import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Axios Instance Configuration
 * 
 * Optimized for Laravel Sanctum and SPA communication.
 */
const axiosInstance = axios.create({
   
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000/',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,

    timeout: 30000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Enforce safe absolute url mapping for base backend connection endpoints
        if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/')) {
            config.url = `/${config.url}`;
        }

        // Sanctum bearer token auth (SPA)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
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

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) {
        // error.response is missing => request never reached the server (DNS/host/port/CORS preflight/etc)
        const requestUrl = error?.config?.url;
        const baseURL = error?.config?.baseURL;
        const fullUrl = (() => {
            if (!requestUrl) return null;
            if (String(requestUrl).startsWith('http')) return requestUrl;
            if (baseURL && (String(baseURL).endsWith('/') || String(requestUrl).startsWith('/'))) {
                return String(baseURL).replace(/\/+$/,'') + '/' + String(requestUrl).replace(/^\//,'');
            }
            return requestUrl;
        })();

        console.error('[Network Error]:', {
            message: error.message,
            baseURL,
            requestUrl,
            fullUrl,
            hint: 'No error.response received. Verify NEXT_PUBLIC_BACKEND_URL, backend port, and that the API is reachable from the browser.'
        });

        return Promise.reject(new Error('Network connection issue. Please check your internet connection.'));

        }

        const { status, data } = error.response;

        switch (status) {
            case 401: // Unauthorized
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    
                    /**
                     * NOTE: Do NOT auto-redirect to /login here on 401 errors.
                     * Your useAuth hook handles the actual route guarding. 
                     * Hard-redirecting here crashes layout requests for standard guest pages.
                     */
                }
                break;

            case 419: // Session expired (not expected in token auth)
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
                break;

            case 402: // Verification deposit required
                {
                    const msg = data?.message || 'Verification deposit required.';
                    const requiredAmount = data?.required_amount;

                    // Only redirect for the ₦5,000 membership verification deposit requirement
                    // Do not hard-redirect here; it can cause reload loops on pages
                    // that themselves trigger /api/deposit.
                    // Let the caller/page decide navigation if needed.
                    if (requiredAmount === 5000) {
                        // no-op
                    }

                    const suffix = requiredAmount ? ` (₦${requiredAmount})` : '';

                    // Only popup this ₦5,000 verification notification once per hour per-browser.
                    if (typeof window !== 'undefined') {
                        const storageKey = 'deposits_verification_notice_5000_last_shown_at';
                        const lastShown = Number(localStorage.getItem(storageKey) || '0');
                        const now = Date.now();
                        const oneHourMs = 60 * 60 * 1000;

                        if (!lastShown || now - lastShown >= oneHourMs) {
                            toast.error(`${msg}${suffix}`, {
                                position: 'top-right',
                                autoClose: 8000,
                            });
                            localStorage.setItem(storageKey, String(now));
                        }
                    } else {
                        toast.error(`${msg}${suffix}`, {
                            position: 'top-right',
                            autoClose: 8000,
                        });
                    }

                }
                break;

            case 403: // Forbidden
                console.error('[Forbidden Access]:', data?.message || 'You do not have permission to perform this action.');
                break;

            case 422: // Validation Errors
                // Gracefully pass back to the hook or calling module to attach to input components
                break;

            case 429: // Rate Limited
                console.error('[Rate Limit]: Too many consecutive operations. Please slow down.');
                break;

            case 500:
            case 502:
            case 503:
            case 504:
                console.error(`[Server Error ${status}]: An unexpected host crash occurred.`);
                break;

            default:
                console.error(`[API Error ${status}]:`, data?.message || 'An unknown state mismatch occurred.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;