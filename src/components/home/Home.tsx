import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices,
} from 'react-native-vision-camera';

import {
  Colors,
  //DebugInstructions,
  Header,
  //ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Section from '../shared/Section/Section';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home', 'Home'>;

const Home = ({navigation}: HomeProps): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [savedPhoto, setSavedPhoto] = useState<{photos: PhotoIdentifier[]}>();
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');
  const [display, setDisplay] = useState('');
  const [runOCR, setRunOcr] = useState(false);
  const [ocrText, setOcrText] = useState<string>('');
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  const camera = useRef<Camera>(null);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    (async () => {
      if (runOCR) {
        if (savedPhoto && savedPhoto.photos) {
          const result = await TextRecognition.recognize(
            savedPhoto.photos[0].node.image.uri,
          );
          setOcrText(result.text);
          setRunOcr(false);
          navigation.navigate('Ocr', {ocrText: result.text});
        }
      }
    })();
  }, [navigation, runOCR, savedPhoto]);

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
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setCameraPermissionStatus(permission);

    if (permission === 'authorized') {
      setDisplay('camera');
    }
  }, []);

  const loadImages = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    } else {
      CameraRoll.getPhotos({
        first: 1,
        assetType: 'Photos',
      })
        .then(r => {
          setSavedPhoto({photos: r.edges});
          console.log(savedPhoto?.photos[0].node.image.uri);
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const takePhoto = async () => {
    if (camera && camera.current) {
      const photo = await camera.current.takePhoto({});
      CameraRoll.save(photo.path);
      Alert.alert('', 'Photo Taken');
    }
  };

  const renderLoading = () => {
    return (
      <View key={ocrText} style={styles.loadingButtonContainer}>
        <ActivityIndicator size="large" color={'#2196F3'} />
      </View>
    );
  };

  const renderImageAndOcr = () => {
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
                    />
                  </View>
                );
              })}
          </View>
          {savedPhoto && runOCR === false && (
            <View style={styles.mainScreenButtonContainer}>
              <Button
                title="Run OCR"
                onPress={() => {
                  setRunOcr(true);
                }}
              />
            </View>
          )}
        </ScrollView>
      );
    } else {
      return renderLoading();
    }
  };

  const cameraView = () => {
    if (device == null) {
      return (
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="No device">
            There is <Text style={styles.highlight}>No Device</Text>
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
              }}>
              <Text style={styles.cameraButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.closeContainer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                setDisplay('');
              }}>
              <Text style={styles.cameraButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="No device or no camera authorization">
            <Text style={styles.highlight}>Something went wrong!</Text>
          </Section>
        </View>
      );
    }
  };

  const defaultView = () => {
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Header />
          <View>
            <View style={styles.mainScreenButtonContainer}>
              <Button
                title="Open camera"
                onPress={() => {
                  requestCameraPermission();
                }}
              />
            </View>
            <View style={styles.mainScreenButtonContainer}>
              <Button title="Load Image" onPress={loadImages} />
            </View>
            {renderImageAndOcr()}
            <Section title="Test screen">
              <Text>"Profile" screen for testing navigation.</Text>
            </Section>
            <View style={styles.mainScreenButtonContainer}>
              <Button
                title="Profile"
                onPress={() => navigation.navigate('Profile', {id: '23'})}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  switch (display) {
    case 'camera':
      return cameraView();
    default:
      return defaultView();
  }
};

const styles = StyleSheet.create({
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  mainScreenButtonContainer: {padding: 10},
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageDiv: {padding: 5},
  imageSize: {
    width: 300,
    height: 400,
  },
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
  cameraButtonText: {
    color: '#000000',
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
  loadingButtonContainer: {
    height: 465,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;