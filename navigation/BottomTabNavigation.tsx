import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import NetworkDrive from '../screen/NetworkDrive';
import AllPhotos from '../screen/AllPhotos';

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="All Photos" component={AllPhotos} />
        <Tab.Screen name="Network Drive" component={NetworkDrive} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigation;
