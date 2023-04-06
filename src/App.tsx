import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeView from './components/home/HomeView';
import Profile from './components/profile/Profile';

export type RootStackParamList = {
  /** HomeView screen, id is just example of passing params */
  Home: {id: string};
  /** Profile screen, id is just example of passing params */
  Profile: {id: string};
};

const App = (): JSX.Element => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          initialParams={{id: '123'}}
          component={HomeView}
          options={{
            title: 'Home',
            headerStyle: {
              backgroundColor: '#7a3cdc',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Profile"
          initialParams={{id: '123'}}
          component={Profile}
          options={{
            title: 'Profile',
            headerStyle: {
              backgroundColor: '#7a3cdc',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
