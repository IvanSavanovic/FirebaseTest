# FirebaseTest
React Native firebase and OCR

# Build
On Windows - First check [Android Users on New Architecture building on Windows](https://reactnative.dev/architecture/bundled-hermes#android-users-on-new-architecture-building-on-windows).

## Commands:
If in `android/app/src/main/` doesn't exist folder `assets` make it.
Then in root:
`npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
In `/android`: 
- `./gradlew assembleRelease` - to build apk. Apk location `android/app/build/outputs/apk/app-release.apk`.

If error: Execution failed for task ':app:mergeReleaseResources' building APK
        - In `android/app/src/main/res/` delete `drawable-mdpi`