# FirebaseTest

React native, firebase and OCR.

Used packages:

- [@firebase](https://rnfirebase.io/)
- [@firebase/auth-types](https://www.npmjs.com/package/@firebase/auth-types)
- [@react-native-cameraroll](https://github.com/react-native-cameraroll/react-native-cameraroll)
- [@react-native-ml-kit/text-recognition](https://www.npmjs.com/package/@react-native-ml-kit/text-recognition?activeTab=readme)
- [@react-native-clipboard/clipboard](https://github.com/react-native-clipboard/clipboard)
- [@react-navigation](https://reactnative.dev/docs/navigation)
- [@react-native-paper](https://callstack.github.io/react-native-paper/docs/guides/getting-started/)
- [@pictogrammers-icons](https://pictogrammers.com/library/mdi/)
- [@react-native-image-crop-picker](https://github.com/ivpusic/react-native-image-crop-picker#readme)

Removed:

- [@react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera)

## Run Dev

- root: `npx react-native run-android`
- \android: `npx react-native start`

## Run Build

- `npx react-native run-android --mode=release`

## Build

On Windows - first check [Android Users on New Architecture building on Windows](https://reactnative.dev/architecture/bundled-hermes#android-users-on-new-architecture-building-on-windows).

## Steps:

Steps 1. and 2. needs to be done once for project.

1.  Make sure you have an assets folder under `android/app/src/main/assets`. If it's not there, create one.
2.  Then in `root`:
    - `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
3.  In `/android`:
    - `./gradlew assembleRelease` - to build APK. It is located in `android/app/build/outputs/apk/app-release.apk`.

### Error:

If your build fails with the following errors:

- `Execution failed for task ':app:processReleaseResources'` or for `Execution failed for task ':app:mergeReleaseResources'` then in `android/app/src/main/res/` delete `drawable-mdpi` and run build again.
