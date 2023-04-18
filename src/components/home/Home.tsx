import TextRecognition from '@react-native-ml-kit/text-recognition';
import React, {useEffect, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import Loading from '../shared/LoadingScreen/Loading';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home', 'Login'>;

const Home = ({navigation, route}: HomeProps): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [savedPhoto, setSavedPhoto] = useState<ImageOrVideo>();
  const [display, setDisplay] = useState<string>('default');
  const [runOCR, setRunOcr] = useState<boolean>(false);
  const [loadingCamera, setLoadingCamera] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);

  const theme = useTheme();

  useEffect(() => {
    (async () => {
      if (runOCR) {
        if (savedPhoto) {
          const result = await TextRecognition.recognize(savedPhoto.path);
          setRunOcr(false);
          navigation.navigate('Ocr', {
            ocrText: result.text,
          });
        }
      }
    })();
  }, [navigation, runOCR, savedPhoto]);

  useEffect(() => {
    if (route.params.display === 'default') {
      setDisplay('default');
    }
  }, [route.params.display]);

  const hasAndroidPermission = async () => {
    const permission =
      Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const hasWriteAndroidPermisson = async () => {
    if (Number(Platform.Version) < 30) {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission === false) {
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
      }
    } else {
      return true;
    }
  };

  const takeImages = async () => {
    setLoadingCamera(true);
    if (
      Platform.OS === 'android' &&
      !(await hasAndroidPermission()) &&
      !(await hasWriteAndroidPermisson())
    ) {
      return;
    } else {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        freeStyleCropEnabled: true,
      })
        .then(image => {
          setSavedPhoto(image);
          CameraRoll.save(image.path).catch(err =>
            console.error('CameraRoll: ', err),
          );
          setDisplay('image');
        })
        .catch(err => {
          const tmp = String(err).split(' ');
          if (!tmp.some(x => x === 'cancelled')) {
            console.error('loadImage: ', String(err));
          }
        });
    }
    setLoadingCamera(false);
  };

  const loadImage = async () => {
    setLoadingImage(true);
    if (
      Platform.OS === 'android' &&
      !(await hasAndroidPermission()) &&
      !(await hasWriteAndroidPermisson())
    ) {
      return;
    } else {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        freeStyleCropEnabled: true,
      })
        .then(image => {
          setSavedPhoto(image);
          setDisplay('image');
        })
        .catch(err => {
          const tmp = String(err).split(' ');
          if (!tmp.some(x => x === 'cancelled')) {
            console.error('loadImage: ', String(err));
          }
        });
    }
    setLoadingImage(false);
  };

  const renderImageAndOcr = () => {
    if (savedPhoto === undefined) {
      return <Loading />;
    }
    if (runOCR === false) {
      return (
        <ScrollView>
          {savedPhoto && (
            <View style={styles.imageContainer}>
              <View style={styles.imageDiv}>
                <Image
                  style={styles.imageSize}
                  source={{uri: savedPhoto.path}}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.imageButtonDiv}>
                <View style={styles.imageButton}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setRunOcr(true);
                    }}>
                    Run OCR
                  </Button>
                </View>
                <View style={styles.imageButton}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setDisplay('');
                    }}>
                    Back
                  </Button>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      );
    } else {
      return <Loading />;
    }
  };

  const defaultView = () => {
    return (
      <SafeAreaView
        style={[
          styles.safeAreaViewStyle,
          {backgroundColor: theme.colors.background},
        ]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.buttonStyle}>
            <Button
              loading={loadingCamera}
              mode="contained"
              onPress={takeImages}
              buttonColor={isDarkMode ? '' : 'rgb(250, 79, 151)'}>
              Take photo
            </Button>
          </View>
          <View style={styles.buttonStyle}>
            <Button
              loading={loadingImage}
              mode="contained"
              onPress={loadImage}
              buttonColor={isDarkMode ? '' : 'rgb(250, 79, 151)'}>
              Load photo
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  switch (display) {
    case 'image':
      return renderImageAndOcr();
    default:
      return defaultView();
  }
};

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    justifyContent: 'center',
  },
  buttonStyle: {padding: 10},
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDiv: {padding: 5},
  imageSize: {
    width: 320,
    height: 400,
  },
  imageButtonDiv: {width: '100%'},
  imageButton: {width: '100%', padding: 10},
  cameraView: {
    display: 'flex',
    flex: 1,
  },
  cameraSection: {flex: 1, justifyContent: 'space-between'},
  cameraButton: {
    borderWidth: 1,
    borderColor: '##2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    width: '180%',
    height: '180%',
    backgroundColor: '#fff',
    borderRadius: 100,
    shadowOpacity: 1,
    shadowRadius: 1,
    shadowColor: '#414685',
    shadowOffset: {
      width: 1,
      height: 5.5,
    },
    elevation: 6,
  },
  textView: {
    padding: 20,
  },
  takePhotoContainer: {
    position: 'absolute',
    bottom: '10%',
    right: '50%',
  },
  closeContainer: {
    position: 'absolute',
    top: '1%',
    right: '8%',
  },
});

export default Home;
