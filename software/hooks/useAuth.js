import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter();


    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});


    const getAuthHeader = () => {
        if (typeof window === 'undefined') return {};
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const register = async ({ setErrors: setLocalErrors, ...props }) => {
        const updateErrors = setLocalErrors || setErrors;
        updateErrors({});

        try {
            const response = await axios.post('/api/register', props);
            return response.data;
        } catch (error) {
            if (error.response?.status !== 422) {
                console.error('Registration error:', error);
                updateErrors({});
                throw error;
            }
            const validationErrors = error.response.data.errors || {
                email: [error.response.data.message || 'Registration failed'],
            };
            updateErrors(validationErrors);
        }
    };

    const mutate = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/user', { headers: getAuthHeader() });
            setUser(res.data);
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(res.data));
            }
            return res.data;
        } catch (error) {
            const status = error?.response?.status;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
            }

            setUser(null);

            if (status === 401 || status === 403) {
                return null;
            }

            console.error('Fetch user error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async ({ setErrors: setLocalErrors, setStatus, ...props }) => {
        const updateErrors = setLocalErrors || setErrors;
        updateErrors({});
        setStatus?.(null);

        const response = await axios
            .post('auth/login', props, { headers: getAuthHeader() })
            .catch((error) => {
                if (error.response?.status !== 422) {
                    console.error('Login error:', error);
                    throw error;
                }
                const validationErrors =
                    error.response.data.errors || {
                        email: [error.response.data.message || 'Invalid credentials'],
                    };
                updateErrors(validationErrors);
                throw error;
            });

        if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
        }

        // Backend may require email verification. In that case, /api/user will fail
        // because it is protected by ensure.email.verified. Avoid clearing auth state.
        const requiresEmailVerification = !!response.data?.requires_email_verification;
        if (requiresEmailVerification) {
            const userPayload = response.data?.user || null;
            localStorage.setItem('user', JSON.stringify({
                ...(userPayload || {}),
                authenticated: true,
                requires_email_verification: true,
            }));
            setUser((prev) => ({
                ...(userPayload || {}),
                authenticated: true,
                requires_email_verification: true,
            }));
            setStatus?.(null);
            return response.data;
        }

        await mutate();
        return response.data;
    };

    const updateProfile = async (formData) => {
        setErrors({});
        const res = await axios.post('/api/profile', formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        const updatedUser = res.data.user || res.data;
        setUser(updatedUser);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return res.data;
    };

    const updatePassword = async (data) => {
        setErrors({});
        const res = await axios.post('/api/profile/password', data);
        return res.data;
    };

    const updateWithdrawalDetails = async (data) => {
        setErrors({});
        const res = await axios.post('/api/profile/withdrawal-details', data);
        const updatedUser = res.data.user || res.data;
        setUser(updatedUser);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return res.data;
    };

    const resendEmailVerification = async ({ setStatus } = {}) => {
        try {
            const res = await axios.post(
                '/api/email/verification-notification',
                {},
                { headers: getAuthHeader() }
            );
            setStatus?.(res.data.status);
            return res.data;
        } catch (error) {
            // If auth token is missing/expired, backend returns 401.
            // For the resend flow we don't want to surface “Unauthorized”.
            if (error.response?.status === 401) {
                setStatus?.(null);
                return null;
            }
            throw error;
        }
    };

    const verifyEmailCode = async ({ setErrors: setLocalErrors, setStatus, email, code }) => {
        const updateErrors = setLocalErrors || setErrors;
        updateErrors({});
        setStatus?.(null);

        try {
            const res = await axios.post('/api/verify-email-code', { email, code });
            return res.data;
        } catch (error) {
            if (error.response?.status !== 422) {
                throw error;
            }

            // Laravel validation exception => { errors: { code: [...] } }
            const validationErrors = error.response.data.errors || {
                message: [error.response.data.message || 'Verification failed'],
            };

            updateErrors(validationErrors);
            throw error;
        }
    };



    const logout = async () => {
        try {
            await axios.post('/api/logout', {}, { headers: getAuthHeader() });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/auth/login';
            }
        }
    };


    // keep old pages from crashing if hook params aren’t passed
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const localUser = localStorage.getItem('user');
        if (localUser) {
            try {
                setUser(JSON.parse(localUser));
            } catch {
                localStorage.removeItem('user');
            }
        }

        if (middleware === 'guest') {
            // Guest pages should NOT call /api/user (it will 401 when no token exists).
            // This prevents noisy console errors on login/register pages.
            setUser(null);
            setLoading(false);
            return;
        }

        // Extra safety: never hit /api/user without a token.
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [middleware]);

    useEffect(() => {
        if (loading) return;

        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated);
            return;
        }

        if (middleware === 'auth' && !user) {
            localStorage.removeItem('user');
            router.push('/auth/login');
        }
    }, [user, loading, middleware, redirectIfAuthenticated, router]);

    return {
        user,
        register,
        login,
        logout,
        updateProfile,
        updatePassword,
        updateWithdrawalDetails,
        resendEmailVerification,
        verifyEmailCode,
        loading,
        errors,
        setErrors,
        mutate,
    };
};



