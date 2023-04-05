/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
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
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Section = ({children, title}: SectionProps): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [savedPhoto, setSavedPhoto] = useState<{photos: PhotoIdentifier[]}>();
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');
  const [disply, setDisplay] = useState('');
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
        }
      }
    })();
  }, [runOCR, savedPhoto]);

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

  const renderImageAndOcr = () => {
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
        {savedPhoto && (
          <View style={styles.mainScreenButtonContainer}>
            <Button title="Run OCR" onPress={() => setRunOcr(true)} />
          </View>
        )}
        {savedPhoto && ocrText.length > 0 ? (
          <View style={styles.textView}>
            <Text style={styles.sectionDescription}>{ocrText}</Text>
          </View>
        ) : null}
      </ScrollView>
    );
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
              <Button title="Load Images" onPress={loadImages} />
            </View>
            {renderImageAndOcr()}
          </View>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.tsx</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
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
        <SafeAreaView key={disply} style={styles.cameraView}>
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
              onPress={() => takePhoto()}>
              <Text>Take Photo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.closeContainer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setDisplay('')}>
              <Text>Close</Text>
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

  switch (disply) {
    case 'camera':
      return cameraView();
    default:
      return defaultView();
  }
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
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
    height: 300,
  },
  cameraView: {
    display: 'flex',
    flex: 1,
  },
  cameraSection: {flex: 1, justifyContent: 'space-between'},
  cameraButton: {
    borderWidth: 1,
    borderColor: '#4f83cc',
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

export default App;
