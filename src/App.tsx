import React, {useCallback, useEffect, useState} from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import HomeView from './components/home/Home';
import OcrScreen from './components/ocrtext/OcrText';
import Loading from './components/shared/LoadingScreen/Loading';
import Login from './components/login/Login';
import Register from './components/register/Register';
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider,
  adaptNavigationTheme,
  useTheme,
} from 'react-native-paper';
import {useColorScheme} from 'react-native';

export type RootStackParamList = {
  /** Login screen */
  Login: {};
  /** Register screen */
  Register: {};
  /** Home screen, id is just example of passing params */
  Home: {id?: string};
  /** Ocr text screen */
  Ocr: {ocrText: string};
};

const App = (): JSX.Element => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const {LightTheme} = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
  });
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  const theme = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  const onAuthStateChanged = useCallback(() => {
    setUser(user);
    if (initializing === true) {
      setInitializing(false);
    }
  }, [initializing, user]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  if (initializing === true) {
    return <Loading />;
  }
  return (
    <Provider theme={isDarkMode ? MD3DarkTheme : MD3LightTheme}>
      <NavigationContainer theme={isDarkMode ? DarkTheme : LightTheme}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            initialParams={{}}
            component={Login}
            options={{
              title: 'Login',
              headerStyle: {
                backgroundColor: theme.colors.primaryContainer,
              },
              headerTintColor: theme.colors.onPrimaryContainer,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="Register"
            initialParams={{}}
            component={Register}
            options={{
              title: 'Register',
              headerStyle: {
                backgroundColor: theme.colors.primaryContainer,
              },
              headerTintColor: theme.colors.onPrimaryContainer,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="Home"
            initialParams={{}}
            component={HomeView}
            options={{
              title: 'Home',
              headerStyle: {
                backgroundColor: theme.colors.primaryContainer,
              },
              headerTintColor: theme.colors.onPrimaryContainer,
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
                backgroundColor: theme.colors.primaryContainer,
              },
              headerTintColor: theme.colors.onPrimaryContainer,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
