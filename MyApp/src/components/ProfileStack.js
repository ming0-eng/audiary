import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import MyReviewsScreen from '../screens/MyReviewsScreen';
import MyRatingsScreen from '../screens/MyRatingsScreen';

// Stack navigator to navigate to Review and Rating Screens from Profile

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="MyReviewsScreen" component={MyReviewsScreen} />
      <Stack.Screen name="MyRatingsScreen" component={MyRatingsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
