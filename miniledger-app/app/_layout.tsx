import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../src/auth";
import { colors } from "../src/theme";

function RootNavigator() {
  const { phone, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      {/* Logged-in screens */}
      <Stack.Protected guard={!!phone}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="add"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Add loan",
            headerTintColor: colors.primary,
            headerStyle: { backgroundColor: colors.bg },
            headerShadowVisible: false,
          }}
        />
      </Stack.Protected>

      {/* Logged-out screens */}
      <Stack.Protected guard={!phone}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
