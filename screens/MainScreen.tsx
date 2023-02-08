import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import AddFundsScreen from './AddFundsScreen';
import DomainScreen from './DomainScreen';
import HomeScreen from './HomeScreen';

const Stack = createNativeStackNavigator();

export default function MainScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Mint NFT' }}
        />
        <Stack.Screen
          name="AddFunds"
          component={AddFundsScreen}
          options={{ title: 'Add Funds' }}
        />
        {/* <Stack.Screen
          name="Domain"
          component={AddFundsScreen}
          options={{ title: 'Domains' }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
