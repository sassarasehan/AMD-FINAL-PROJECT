import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router/tabs'
import { Label } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

const tabs: { Label: string; name: string; icon: MaterialIconName }[] = [
    {Label: "Home", name: "home", icon: "transfer-within-a-station"}
    , {Label: "Stats", name: "stats", icon: "show-chart"}
    , {Label: "Accounts", name: "accounts", icon: "account-circle"}
    , {Label: "Settings", name: "setting", icon: "settings"}
]

const DashboardLayout = () => {
  return <Tabs>
    {tabs.map(({name, icon, Label}) => (
      <Tabs.Screen
        key={name}
        name={name}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text>{Label}</Text>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons name={icon} size={size} color={color} />
          ),
        }}
      />
    ))}
  </Tabs>
}

export default DashboardLayout