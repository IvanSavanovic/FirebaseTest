import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, StyleSheet, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import {TextInput, Text, Button, useTheme} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type RegisterProps = NativeStackScreenProps<
  RootStackParamList,
  'Register',
  'Login'
>;

const Register = ({navigation}: RegisterProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordSecure, setIsPasswordSecure] = useState<boolean>(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] =
    useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();

  const register = () => {
    if (password !== confirmPassword) {
      setError('Passwords must match!');
    } else {
      setLoading(true);
      auth()
        .createUserWithEmailAndPassword(email.toLowerCase(), password)
        .then(() => {
          navigation.navigate('Home', {});
          setError('');
          console.log('User account created & signed in!');
        })
        .catch(err => {
          setError(String(err));
        })
        .finally(() => {
          setLoading(false);
        });
    }
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

  const renderConfirmIcon = useCallback(() => {
    if (isConfirmPasswordSecure) {
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
  }, [isConfirmPasswordSecure, theme.colors.secondary]);

  return (
    <SafeAreaView
      style={[
        styles.mainContainer,
        {backgroundColor: theme.colors.background},
      ]}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
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
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Confirm password"
        inputMode="text"
        secureTextEntry={isConfirmPasswordSecure}
        autoComplete="password"
        autoCapitalize="none"
        right={
          <TextInput.Icon
            icon={() => {
              return renderConfirmIcon();
            }}
            size={28}
            onPress={() => {
              isConfirmPasswordSecure
                ? setIsConfirmPasswordSecure(false)
                : setIsConfirmPasswordSecure(true);
            }}
          />
        }
      />
      <View style={styles.login}>
        <Button
          style={styles.button}
          disabled={email === '' || password === '' || confirmPassword === ''}
          loading={loading}
          mode="contained"
          buttonColor={'rgb(250, 79, 151)'}
          labelStyle={styles.buttonText}
          onPress={register}>
          Register
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

export default Register;

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
