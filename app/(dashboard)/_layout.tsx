import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router/tabs'
import { Label } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

const tabs: { Label: string; name: string; icon: MaterialIconName; options: { title: string } }[] = [
    {Label: "Home", name: "home", icon: "transfer-within-a-station", options: { title: 'Dashboard' }},
    {Label: "Stats", name: "stats", icon: "insights", options: { title: 'Statistics' }},
    {Label: "Notes", name: "notes", icon: "notes", options: { title: 'Notes' }},
  ]

const DashboardLayout = () => {
  return <Tabs>
    {tabs.map(({name, icon, Label, options}) => (
      <Tabs.Screen
        key={name}
        name={name}
        options={{
          title: options.title, 
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

export default DashboardLayout;