import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import SafeScreen from "../../components/SafeScreen";
export default function Authlayout() {
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeScreen>
    </SafeAreaProvider>
  );
}
