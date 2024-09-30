import React, {useEffect} from 'react';
import BottomTabNavigation from './navigation/BottomTabNavigation';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],

      webClientId:
        '1032553354867-f7p71kum2pqrhl7kpm7pkc6grl10lbfd.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);
  return <BottomTabNavigation />;
};

export default App;
