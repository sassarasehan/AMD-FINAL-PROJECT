import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Platform, StyleSheet, View, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

// Create the Top Tabs Navigator
const { Navigator } = createMaterialTopTabNavigator();
export const TopTabs = withLayoutContext(Navigator);

export default function HomeLayout() {
  const { colors, dark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={dark ? "light-content" : "dark-content"} 
        backgroundColor={colors.card}
      />
      
      <TopTabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: colors.card,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: "600",
            textTransform: "none",
            margin: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 8,
            paddingHorizontal: 4,
            minHeight: 48,
          },
          tabBarScrollEnabled: false,
          tabBarIndicatorContainerStyle: {
            marginHorizontal: 16,
          },
          animationEnabled: true,
          swipeEnabled: Platform.OS === "ios",
          tabBarPressColor: "transparent",
        }}
      >
        <TopTabs.Screen
          name="daily"
          options={{
            title: "Daily",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="today"
                size={20}
                color={focused ? colors.primary : colors.text}
                style={styles.icon}
              />
            ),
          }}
        />
        <TopTabs.Screen
          name="monthly"
          options={{
            title: "Monthly",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="calendar-month"
                size={20}
                color={focused ? colors.primary : colors.text}
                style={styles.icon}
              />
            ),
          }}
        />
        <TopTabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="event"
                size={20}
                color={focused ? colors.primary : colors.text}
                style={styles.icon}
              />
            ),
          }}
        />
        <TopTabs.Screen
          name="calculator"
          options={{
            title: "Calculator",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="calculate"
                size={20}
                color={focused ? colors.primary : colors.text}
                style={styles.icon}
              />
            ),
          }}
        />
      </TopTabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    marginBottom: -2,
  },
});