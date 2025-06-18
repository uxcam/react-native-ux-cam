const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    path.resolve(__dirname, '../uxcam-react-wrapper'),
  ],
  resolver: {
    alias: {
      'react-native-ux-cam': path.resolve(__dirname, '../uxcam-react-wrapper'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
