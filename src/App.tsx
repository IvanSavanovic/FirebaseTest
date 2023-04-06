import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeView from './components/home/Home';
import Profile from './components/profile/Profile';
import OcrScreen from './components/ocrtext/OcrText';

export type RootStackParamList = {
  /** Home screen, id is just example of passing params */
  Home: {id: string};
  /** Ocr text screen */
  Ocr: {ocrText: string};
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
          initialParams={{id: ''}}
          component={HomeView}
          options={{
            title: 'Home',
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Ocr"
          initialParams={{ocrText: ''}}
          component={OcrScreen}
          options={{
            title: 'OCR',
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Profile"
          initialParams={{id: ''}}
          component={Profile}
          options={{
            title: 'Profile',
            headerStyle: {
              backgroundColor: '#2196F3',
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
