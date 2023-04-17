import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {useTheme, TextInput, Text, Button} from 'react-native-paper';
import {Image} from 'react-native';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login', 'Login'>;

const Login = ({navigation}: LoginProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordSecure, setIsPasswordSecure] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();

  const login = () => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setError('');
        navigation.navigate('Home', {});
      })
      .catch(err => {
        setError(String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderIcon = useCallback(() => {
    if (isPasswordSecure) {
      return (
        <Image
          source={require('../../assets/icons/eye-off.png')}
          style={[styles.showPasswordIcon, {tintColor: theme.colors.secondary}]}
        />
      );
    } else {
      return (
        <Image
          source={require('../../assets/icons/eye.png')}
          style={[styles.showPasswordIcon, {tintColor: theme.colors.secondary}]}
        />
      );
    }
  }, [isPasswordSecure, theme.colors.secondary]);

  return (
    <SafeAreaView
      style={[
        styles.mainContainer,
        {backgroundColor: theme.colors.background},
      ]}>
      <TextInput
        style={[styles.input, {color: theme.colors.onSurface}]}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, {color: theme.colors.onSurface}]}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        inputMode="text"
        secureTextEntry={isPasswordSecure}
        autoComplete="password"
        autoCapitalize="none"
        right={
          <TextInput.Icon
            icon={() => {
              return renderIcon();
            }}
            size={28}
            onPress={() => {
              isPasswordSecure
                ? setIsPasswordSecure(false)
                : setIsPasswordSecure(true);
            }}
          />
        }
      />
      <View style={styles.register}>
        <Text
          style={{color: theme.colors.onSurface}}
          onPress={() => {
            setError('');
            navigation.navigate('Register', {});
          }}>
          Register
        </Text>
        <Text style={{color: theme.colors.onSurface}}>Forgot password?</Text>
      </View>
      <View style={styles.login}>
        <Button
          disabled={email === '' || password === ''}
          loading={loading}
          style={[styles.button]}
          mode="contained"
          labelStyle={styles.buttonText}
          onPress={login}>
          Sing In
        </Button>
      </View>
      {error && (
        <View
          style={[
            styles.login,
            styles.error,
            {backgroundColor: theme.colors.errorContainer},
          ]}>
          <Text style={{color: theme.colors.error}}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    marginStart: 30,
    marginEnd: 30,
    borderWidth: 1,
    padding: 10,
  },
  register: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingStart: 30,
    paddingEnd: 30,
  },
  login: {
    paddingStart: 30,
    paddingEnd: 30,
    paddingTop: 10,
  },
  error: {
    marginTop: 10,
    marginStart: 30,
    marginEnd: 30,
    paddingBottom: 10,
  },
  button: {
    padding: 10,
    fontSize: 18,
  },
  buttonText: {fontSize: 16},
  showPasswordIcon: {
    width: 25,
    height: 25,
    top: 10,
  },
});
