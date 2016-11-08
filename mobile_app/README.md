# Agorask

### installation
(All yarn commands can use npm instead)  
```
$- yarn install -g react-native cli
$- yarn
```
Install android-sdk and define ANDROID_HOME environment variable, then install android SDK packages.

```
$- $ANDROID_HOME/tools/android update sdk --no-ui -a --filter platform-tools,android-23,build-tools-23.0.1,extra-android-support,extra-google-m2repository,extra-google-google-play-services
```

For more information, check the official [React Native documentation](https://facebook.github.io/react-native/releases/0.24/docs/android-setup.html#android-setup)

### Run the application
```
$- yarn start
```
```
$- react-native run-android
```
