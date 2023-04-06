import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RootStackParamList} from '../../App';
import Clipboard from '@react-native-clipboard/clipboard';

type OcrProps = NativeStackScreenProps<RootStackParamList, 'Ocr', 'Home'>;

const OcrScreen = ({route}: OcrProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const copyToClipboard = () => {
    Clipboard.setString(route.params.ocrText);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.textView}>
        <Text selectable={true} style={styles.sectionDescription}>
          {route.params.ocrText}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Copy"
          onPress={() => {
            copyToClipboard();
            ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default OcrScreen;

const styles = StyleSheet.create({
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  buttonContainer: {padding: 10},
  textView: {
    padding: 20,
  },
});
