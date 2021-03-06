#!/bin/bash

# export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH"

DEPS="$ANDROID_HOME/installed-dependencies"
echo $ANDROID_HOME
if [ ! -e $DEPS ]; then
  echo y | android update sdk -u -a -t tools &&
  echo y | android update sdk -u -a -t build-tools-23.0.1 &&
  echo y | android update sdk -u -a -t build-tools-23.0.3 && 
  echo y | android update sdk -u -a -t build-tools-25.0.0 && 
  echo y | android update sdk -u -a -t android-23 &&
  echo y | android update sdk -u -a -t android-25 &&
  echo y | android update sdk -u -a -t extra-google-google_play_services &&
  echo y | android update sdk -u -a -t extra-google-m2repository &&
  echo y | android update sdk -u -t extra-android-m2repository &&
  echo y | android update sdk -u -t extra-android-support &&
  echo y | android update sdk -a -u -t sys-img-armeabi-v7a-google_apis-23
  touch $DEPS
fi
