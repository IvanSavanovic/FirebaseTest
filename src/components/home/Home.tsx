import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices,
} from 'react-native-vision-camera';

import Section from '../shared/Section/Section';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import Loading from '../shared/LoadingScreen/Loading';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home', 'Login'>;

const Home = ({navigation, route}: HomeProps): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [savedPhoto, setSavedPhoto] = useState<{photos: PhotoIdentifier[]}>();

  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');
  const [display, setDisplay] = useState<string>('default');
  const [runOCR, setRunOcr] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [loadingCamera, setLoadingCamera] = useState<boolean>(false);
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  const camera = useRef<Camera>(null);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      if (runOCR) {
        if (savedPhoto && savedPhoto.photos) {
          const result = await TextRecognition.recognize(
            savedPhoto.photos[0].node.image.uri,
          );
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

  const requestCameraPermission = useCallback(async () => {
    setLoadingCamera(true);
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setCameraPermissionStatus(permission);

    if (permission === 'authorized') {
      setDisplay('camera');
      setLoadingCamera(false);
    } else {
      setLoadingCamera(false);
    }
  }, []);

  const loadImages = async () => {
    setLoadingImage(true);
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    } else {
      setDisplay('image');
      CameraRoll.getPhotos({
        first: 1,
        assetType: 'Photos',
      })
        .then(r => {
          setSavedPhoto({photos: r.edges});
        })
        .catch(err => {
          console.error(err);
        });
    }
    setLoadingImage(false);
  };

  const takePhoto = async () => {
    if (camera && camera.current) {
      const photo = await camera.current.takePhoto({});
      CameraRoll.save(photo.path);
      ToastAndroid.show('Photo Taken', ToastAndroid.SHORT);
    }
  };

  const focusePhoto = async () => {
    if (camera && camera.current) {
      await camera.current.focus({x: 300, y: 300});
    }
  };

  const renderImageAndOcr = () => {
    if (savedPhoto === undefined) {
      return <Loading />;
    }
    if (runOCR === false) {
      return (
        <ScrollView>
          <View style={styles.imageContainer}>
            {savedPhoto &&
              savedPhoto.photos.map((p, i) => {
                return (
                  <View key={i} style={styles.imageDiv}>
                    <Image
                      style={styles.imageSize}
                      source={{uri: p.node.image.uri}}
                      resizeMode="contain"
                    />
                  </View>
                );
              })}
            {savedPhoto && (
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
            )}
          </View>
        </ScrollView>
      );
    } else {
      return <Loading />;
    }
  };

  const cameraView = () => {
    if (device == null) {
      return (
        <View
          style={{
            backgroundColor: theme.colors.background,
          }}>
          <Section title="No device">
            <Text style={{color: theme.colors.error}}>
              There is <Text style={styles.highlight}>No Device!</Text>
            </Text>
          </Section>
        </View>
      );
    }
    if (cameraPermissionStatus === 'authorized') {
      return (
        <SafeAreaView key={display} style={styles.cameraView}>
          <Camera
            style={styles.cameraSection}
            device={device}
            isActive={true}
            ref={camera}
            photo={true}
          />
          <View style={styles.takePhotoContainer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                takePhoto();
              }}
              onPressIn={() => {
                focusePhoto();
              }}>
              <Text style={{color: theme.colors.onPrimary}}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.closeContainer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                setDisplay('');
              }}>
              <Text style={{color: theme.colors.onPrimary}}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: theme.colors.background,
          }}>
          <Section title="No device or no camera authorization">
            <Text style={[styles.highlight, {color: theme.colors.error}]}>
              Something went wrong!
            </Text>
          </Section>
        </View>
      );
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
              onPress={() => {
                requestCameraPermission();
              }}>
              Open camera
            </Button>
          </View>
          <View style={styles.buttonStyle}>
            <Button
              loading={loadingImage}
              mode="contained"
              onPress={loadImages}>
              Load Image
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  switch (display) {
    case 'camera':
      return cameraView();
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
