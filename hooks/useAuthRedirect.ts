import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAppSelector } from '../store/hooks';

export function useAuthRedirect() {
    const { user, loading } = useAppSelector((state) => state.auth);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        // Check if user is in tabs or details but not logged in
        const inProtectedGroup = segments[0] === '(tabs)' || segments[0] === 'service-details';

        // Check if user is on login/register but already logged in
        const inAuthScreen = (segments[0] as any) === 'login' || (segments[0] as any) === 'register';

        if (!user && inProtectedGroup) {
            router.replace('/login' as any);
        } else if (user && inAuthScreen) {
            router.replace('/(tabs)' as any);
        }
    }, [user, loading, segments]);
}
