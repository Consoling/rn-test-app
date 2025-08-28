import { SplashScreen, Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import LoadingScreen from "../components/LoadingScreen"; // Your loading screen

import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const { checkAuth, user, token } = useAuthStore();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Check auth on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsAuthChecked(true);
    };
    
    initAuth();
  }, []);

  // Handle navigation based on auth state - only after navigation is ready
  useEffect(() => {
    if (!navigationState?.key || !fontsLoaded || !isAuthChecked) {
      return;
    }

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments, navigationState?.key, fontsLoaded, isAuthChecked]);

  
  if (!fontsLoaded || !navigationState?.key || !isAuthChecked) {
    return (
      <SafeAreaProvider>
        <LoadingScreen message="Initializing app..." />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}