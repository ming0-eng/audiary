import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { firebase_auth } from './src/firebaseConfig';
import { createReviewsTable } from './src/services/SQLiteService';
import * as SQLite from 'expo-sqlite';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import BottomTabNavigator from './src/components/BottomTabNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase_auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  return (
    <SQLite.SQLiteProvider
    databaseName="album_reviews.db"
    onInit={createReviewsTable}
  >
    <NavigationContainer>
      {user ? (
        // Use tab navigator when logged in
        <BottomTabNavigator />
      ) : (
        // Use stack screens for log in and sign up
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: 'Sign Up' }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  </SQLite.SQLiteProvider>
  );
}


