import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function LiveLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen
        name='livetv'
        options={{
          headerShown: !Platform.isTV,
          headerTitle: "Live TV",
          headerBlurEffect: "none",
          headerTransparent: Platform.OS === "ios",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
