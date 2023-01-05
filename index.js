import { registerRootComponent } from "expo";
import "expo-asset";
import { enableLatestRenderer } from "react-native-maps";

import App from "./App";

enableLatestRenderer();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
