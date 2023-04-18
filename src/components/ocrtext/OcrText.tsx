import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
  useColorScheme,
} from 'react-native';
import {Button, Divider, Text, useTheme} from 'react-native-paper';
import {RootStackParamList} from '../../App';
import Clipboard from '@react-native-clipboard/clipboard';

type OcrProps = NativeStackScreenProps<RootStackParamList, 'Ocr', 'Home'>;

const OcrScreen = ({route, navigation}: OcrProps) => {
  const theme = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  const copyToClipboard = () => {
    Clipboard.setString(route.params.ocrText);
  };

  const table = () => {
    const text = route.params.ocrText.split(/\r?\n/);
    const nameReg = /^[A-ZČĆŽĐŠ][A-ZČĆŽĐŠ.]*\s[A-ZČĆŽĐŠ].*/;
    const priceReg = /^[0-9]+\.[0-9][0-9]$/;
    const wrongPriceFormat = /^[A-Z]*\.[0-9][0-9]$/;
    const nameArr: string[] = [];
    const priceArr: string[] = [];
    let lastName = 0;
    let totalCost = 0;
    let totalCostOCR = 0;

    text.forEach((item, index) => {
      if (nameReg.test(item)) {
        nameArr.push(item);
        lastName = index;
      }
    });
    text.forEach((item, index) => {
      if (lastName < index) {
        let tmp = item;
        if (wrongPriceFormat.test(tmp)) {
          const a = tmp.split('.');
          tmp = a[0].replace(/[A-Z]/, '0.') + a[1];
        }
        if (priceArr.length <= nameArr.length) {
          if (priceReg.test(tmp)) {
            priceArr.push(tmp);
            totalCost = totalCost + Number(tmp);
          }
        }
        if (totalCost < Number(item)) {
          totalCostOCR = Number(item);
        }
      }
    });

    return (
      <View style={styles.sectionDescription}>
        <View style={styles.tableRow}>
          <Text style={styles.talbeHeader}>Article</Text>
          <Text style={styles.talbeHeader}>Price</Text>
        </View>
        {nameArr.map((item, index) => {
          return (
            <View key={index} style={styles.tableRow}>
              <Text>{item}</Text>
              <Text>{priceArr[index]}</Text>
            </View>
          );
        })}
        <View style={styles.tableRow}>
          <Text style={styles.talbeHeader}>SUM/TOTAL:</Text>
          <Text style={styles.talbeHeader}>{totalCost}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.talbeHeader}>TOTAL OCR:</Text>
          <Text style={styles.talbeHeader}>{totalCostOCR}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: theme.colors.background}]}>
      <ScrollView>
        <View style={[styles.textView]}>
          <Text selectable={true} style={styles.sectionDescription}>
            {route.params.ocrText}
          </Text>
          <Divider />
          {table()}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            buttonColor={isDarkMode ? '' : 'rgb(250, 79, 151)'}
            onPress={() => {
              copyToClipboard();
              ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
            }}>
            Copy
          </Button>
          <Button
            mode="contained"
            buttonColor={isDarkMode ? '' : 'rgb(250, 79, 151)'}
            onPress={() => {
              navigation.navigate('Home', {display: 'default'});
            }}>
            Home
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OcrScreen;

const styles = StyleSheet.create({
  safeArea: {flex: 1, justifyContent: 'space-between'},
  sectionDescription: {
    marginTop: 8,
  },
  buttonContainer: {padding: 10, gap: 20, paddingBottom: 20},
  textView: {
    padding: 20,
  },
  talbeHeader: {
    fontWeight: '800',
    fontSize: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
