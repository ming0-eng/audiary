import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { firebase_auth } from '../firebaseConfig';

const ProfileScreen = ({ navigation }) => {
  const [profilePic, setProfilePic] = useState('');

  // Function to load current user profile picture
  useEffect(() => {
    const loadProfilePic = async () => {
      try {
        const userId = firebase_auth.currentUser.uid;
        const storedPic = await AsyncStorage.getItem(`profilePic_${userId}`);
        if (storedPic !== null) {
          setProfilePic(storedPic);
        }
      } catch (error) {
        console.error('Error loading profile picture:', error);
      }
    };
    loadProfilePic();
  }, []);

  // Function to save profile picture to AsyncStorage for current user
  const saveProfilePic = async (uri) => {
    try {
      const userId = firebase_auth.currentUser.uid;
      await AsyncStorage.setItem(`profilePic_${userId}`, uri);
    } catch (error) {
      console.error('Error saving profile picture:', error);
    }
  };

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access gallery is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePic(uri);
      saveProfilePic(uri);
    }
  };

  // Function to take a photo using the camera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access camera is required!");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePic(uri);
      saveProfilePic(uri);
    }
  };

  // Function to prompt the user to update the profile picture
  const handleProfilePicPress = () => {
    Alert.alert(
      'Update Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.profilePicContainer} onPress={handleProfilePicPress}>
        <Image source={{ uri: profilePic }} style={[styles.profilePic, { resizeMode: 'cover' }]} />
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyReviewsScreen')}>
          <Text style={styles.buttonText}>My Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyRatingsScreen')}>
          <Text style={styles.buttonText}>My Ratings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center' },
  profilePicContainer: { marginTop: 100, marginBottom: 20, alignItems: 'center' },
  profilePic: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: 'white' },
  buttonsContainer: { width: '100%', alignItems: 'center' },
  button: { backgroundColor: '#1E1E1E', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 8, marginVertical: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});


