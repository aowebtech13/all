'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    const isAuthPage = pathname?.startsWith('/auth');

    // auth pages: prevent access when already logged in (guest middleware)
    const { user, loading } = useAuth({
        middleware: isAuthPage ? 'guest' : 'auth',
        redirectIfAuthenticated: isAuthPage ? '/dashboard' : null,
    });

    // When not on /auth pages, we require a user.
    // Allow verification landing routes to render without bouncing to /dashboard/login
    // while auth state is still syncing.
    const isVerificationLanding = pathname?.startsWith('/pay/verify') ||
        pathname?.startsWith('/pay-step/step-2') ||
        pathname?.startsWith('/pay/');

    useEffect(() => {
        if (loading) return;
        if (!isAuthPage) {
            if (!user) {
                // If we are on a pay verification landing route, don't hard redirect immediately.
                // This prevents the flash -> /dashboard issue when user state hasn't hydrated yet.
                if (isVerificationLanding) return;

                // If token exists but user is not hydrated due to email verification,
                // keep the user within email verification flow instead of bouncing to login.
                const localToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const localUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
                if (localToken && localUser) {
                    try {
                        const parsed = JSON.parse(localUser);
                        if (parsed?.requires_email_verification) {
                            router.push('/auth/verify-email');
                            return;
                        }
                    } catch {
                        // ignore
                    }
                }

                router.push('/auth/login');
                return;
            }

            // If user is present but not authenticated in UI/state, force login.
            if (user?.authenticated === false) {
                // Same exception for verification landing.
                if (isVerificationLanding) return;
                router.push('/auth/login');
            }
        }
    }, [loading, isAuthPage, user, router, isVerificationLanding]);


    if (loading) return null;
    return children;
}

