module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    '@babel/preset-env', // For transforming ES6+ syntax
    '@babel/preset-react', // For transforming JSX
    '@babel/preset-typescript', // For transforming TypeScript,
  ],
  plugins: [
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-private-property-in-object',
  ],
};
