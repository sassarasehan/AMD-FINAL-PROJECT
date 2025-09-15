import { withLayoutContext } from "expo-router";
import {
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";

const { Navigator } = createMaterialTopTabNavigator();

export const TopTabs = withLayoutContext(Navigator);

export default function HomeLayout() {
  return (
    <TopTabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarIndicatorStyle: { backgroundColor: "#000" },
      }}
    >
      <TopTabs.Screen name="daily" options={{ title: "Daily" }} />
      <TopTabs.Screen name="monthly" options={{ title: "Monthly" }} />
      <TopTabs.Screen name="calendar" options={{ title: "Calendar" }} />
      <TopTabs.Screen name="calculator" options={{ title: "Calculator" }} />
    </TopTabs>
  );
}
