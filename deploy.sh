#!/bin/bash

# Variables
BUILD_PATH="./prodbuild"
BRANCH="master"

# Test
TEST_BUILD_PATH="./testbuild"
TEST_BRANCH="development"

# Parse options
while getopts ":th" opt; do
  case ${opt} in
    t) 
      echo "Deploying test"
      BUILD_PATH=$TEST_BUILD_PATH
      BRANCH=$TEST_BRANCH
      ;;
    h) 
      echo "Must pass a deployment option"
      echo "Usage:"
      echo "  -t  deploy test"
      echo "  -p  deploy production"
      exit 1
      ;;
    \?)
      echo "Deploying production"
      ;;
  esac
done


git stash
git pull
git checkout $BRANCH
npm install
npm run build
if [[ -d $BUILD_PATH ]]
then
    rm -R $BUILD_PATH
fi
cp -R build/ $BUILD_PATH
chmod u+x $BUILD_PATH/