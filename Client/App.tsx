import 'react-native-gesture-handler';
import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import RecordPlayView from './src/containers/RecordPlayView/RecordPlayView';
import * as Font from 'expo-font';
import { View } from 'react-native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {

  const [loaded, setLoaded] = useState<boolean>(false)

  const loadfont = async () => {
      await Font.loadAsync({
          fontello: require('./fontello/font/fontello.ttf'),
    });
    setLoaded(true)
  }

  loadfont()

  return (
    loaded?
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" headerMode='none'>
        <Stack.Screen name="Home" component={RecordPlayView} />
      </Stack.Navigator>
    </NavigationContainer>:
    <View />
  )
}
export default App