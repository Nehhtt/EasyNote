import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import NoteView from './src/containers/NoteView/NoteView';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" headerMode='none'>
        <Stack.Screen name="Home" component={NoteView} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App