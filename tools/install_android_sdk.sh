cd ~/;
# install openjdk
add-apt-repository ppa:webupd8team/java -y;
apt-get update;
apt-get install oracle-java8-installer;

# download android sdk
wget http://dl.google.com/android/android-sdk_r24.2-linux.tgz

tar -xvf android-sdk_r24.2-linux.tgz

# set path
vi ~/.zshrc << EOT

export PATH=${PATH}:$HOME/sdk/android-sdk-linux/platform-tools:$HOME/sdk/android-sdk-linux/tools:$HOME/sdk/android-sdk-linux/build-tools/22.0.1/

EOT

source ~/.zshrc

# adb
apt-get install libc6:i386 libstdc++6:i386
# aapt
apt-get install zlib1g:i386

cd -;