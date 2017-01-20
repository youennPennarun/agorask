#!/bin/bash

# Fix the CircleCI path
function getAndroidSDK(){
  export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH"

  DEPS="$ANDROID_HOME/installed-dependencies"

  if [ ! -e $DEPS ]; then
    cp -r /usr/local/android-sdk-linux $ANDROID_HOME &&
    echo y | android update sdk -u -a -t tools &&
    echo y | android update sdk -u -a -t build-tools-23.0.3 &&
    echo y | android update sdk -u -a -t android-23 &&
    echo y | android update sdk -u -a -t extra-google-google_play_services &&
    echo y | android update sdk -u -a -t extra-google-m2repository &&
    echo y | android update sdk -u -a -t extra-android-m2repository &&
    echo y | android update sdk -u -a -t extra-android-support &&
    echo no | android create avd -n testAVD -f -t android-23 --abi default/x86
    touch $DEPS
  fi
}