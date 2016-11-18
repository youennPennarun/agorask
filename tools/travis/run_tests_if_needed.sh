if [ ! -f "${SHOULD_BUILD_IF_EXISTS}" ];then
  echo "Skipping ${TEST_DIR}";
else
  cd $TEST_DIR && npm install && ENV=test npm run codecov;
fi;