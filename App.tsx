import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { LogBox } from "react-native";
import { Loading } from "./src/components/Loading";
import { AuthProvider } from "./src/contexts/auth";
import { Routes } from "./src/routes";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

import { THEME } from "./src/styles/theme";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular });

  return (
    <NativeBaseProvider theme={THEME}>
      {fontsLoaded ? (
        <AuthProvider>
          <Routes />
        </AuthProvider>
      ) : (
        <Loading />
      )}
      <StatusBar style="light" backgroundColor="transparent" translucent />
    </NativeBaseProvider>
  );
}
