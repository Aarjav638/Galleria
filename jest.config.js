module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Using ts-jest for transforming TypeScript files
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation))',
  ],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock static file imports like images
  },
  setupFiles: ['<rootDir>/jest.setup.js'], // Optional: For any additional setup
};
