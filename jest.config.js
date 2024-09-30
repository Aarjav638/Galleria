module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Use babel-jest to transform TypeScript and JSX
  },
  testEnvironment: 'jest-environment-jsdom', // Use jsdom for browser-like environment
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-community|react-native-svg|react-native-reanimated)/)', // Ensure these packages are transformed
  ],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock static file imports like images
  },
};
