import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import { loadUser } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const systemColorScheme = useColorScheme();
  const { theme } = useAppSelector((state) => state.settings);
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#111827' : '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="service-details"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
