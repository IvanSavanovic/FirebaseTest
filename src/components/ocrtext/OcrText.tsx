import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaView, StyleSheet, ToastAndroid, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {RootStackParamList} from '../../App';
import Clipboard from '@react-native-clipboard/clipboard';

type OcrProps = NativeStackScreenProps<RootStackParamList, 'Ocr', 'Home'>;

const OcrScreen = ({route, navigation}: OcrProps) => {
  const theme = useTheme();

  const copyToClipboard = () => {
    Clipboard.setString(route.params.ocrText);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.textView]}>
        <Text selectable={true} style={styles.sectionDescription}>
          {route.params.ocrText}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => {
            copyToClipboard();
            ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
          }}>
          Copy
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate('Home', {display: 'default'});
          }}>
          Home
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default OcrScreen;

const styles = StyleSheet.create({
  safeArea: {flex: 1, justifyContent: 'space-between'},
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  buttonContainer: {padding: 10, gap: 20, paddingBottom: 20},
  textView: {
    padding: 20,
  },
});
