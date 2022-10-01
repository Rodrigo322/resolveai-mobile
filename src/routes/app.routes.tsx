import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Details } from "../screens/Details";
import { Home } from "../screens/Home";
import { ProfileUser } from "../screens/ProfileUser";
import { RegisterProblem } from "../screens/RegisterProblem";
import { SelectMapPosition } from "../screens/SelectMapPosition";

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="details" component={Details} />
      <Screen name="register" component={RegisterProblem} />
      <Screen name="profile_user" component={ProfileUser} />
      <Screen name="select_map_position" component={SelectMapPosition} />
    </Navigator>
  );
}
