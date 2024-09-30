import {View, Text} from 'react-native';
import React from 'react';

const NetworkDrive = () => {
  return (
    <View>
      <Text>NetworkDrive</Text>
    </View>
  );
};

export default NetworkDrive;

// import React from 'react';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import {Button} from 'react-native';
// const NetworkDrive = () => {
//   const getAccessToken = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       await GoogleSignin.signIn();
//       const {accessToken} = await GoogleSignin.getTokens();
//       console.log('accessToken:', accessToken);
//       return accessToken;
//     } catch (error) {
//       console.error('Error signing in or fetching tokens:', error);
//     }
//   };

//   return <Button title="Sign in with Google" onPress={getAccessToken} />;
// };

// export default NetworkDrive;
