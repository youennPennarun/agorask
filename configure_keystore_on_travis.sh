if [ $# -eq 3 ]
then
	travis encrypt-file mobile_app/android/release.keystore --add
	travis encrypt MYAPP_RELEASE_KEY_ALIAS=$1 --add env.global
	travis encrypt MYAPP_RELEASE_STORE_PASSWORD=$2 --add env.global
	travis encrypt MYAPP_RELEASE_KEY_PASSWORD=$3 --add env.global
	echo "stored";
else
	echo "Should take 3 parameters: key_alias store_password key_password";
fi

