# FirebaseTest
React Native firebase and OCR

# Build
On Windows - First check [Android Users on New Architecture building on Windows](https://reactnative.dev/architecture/bundled-hermes#android-users-on-new-architecture-building-on-windows).

## Commands:
1. If in `android/app/src/main/` doesn't exist folder `assets` make it.
2. Then in root:
`npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
3. In `/android`: 
`./gradlew assembleRelease` - to build apk. Apk location `android/app/build/outputs/apk/app-release.apk`.

If error: Execution failed for task ':app:mergeReleaseResources' building APK
        - In `android/app/src/main/res/` delete `drawable-mdpi`
