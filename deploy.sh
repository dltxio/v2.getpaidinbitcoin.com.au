#!/bin/bash

# Variables
BUILD_PATH=
BRANCH=

# Test
TEST_BUILD_PATH="./testbuild"
TEST_BRANCH="development"

# Prod
PROD_BUILD_PATH="./prodbuild"
PROD_BRANCH="master"


# Parse options
while getopts ":htp" opt; do
  case ${opt} in
    t) 
      echo "Deploying test"
      BUILD_PATH=$TEST_BUILD_PATH
      BRANCH=$TEST_BRANCH
      ;;
    p) 
      echo "Deploying produciton"
      BUILD_PATH=$PROD_BUILD_PATH
      BRANCH=$PROD_BRANCH
      ;;
    \?) 
      echo "Must pass a deployment option"
      echo "Usage:"
      echo "  -t  deploy test"
      echo "  -p  deploy production"
      exit 1
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
