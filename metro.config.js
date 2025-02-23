const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Add any custom resolver settings here
    blockList: [
      /node_modules\/react-native\/src\/private\/featureflags\/NativeReactNativeFeatureFlags\.js/,
    ],
  },
  transformer: {
    // Add any custom transformer settings here
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders: [
    // Add any custom watch folders here if needed
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
