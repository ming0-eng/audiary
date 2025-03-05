import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Button,
  Alert,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import { getReviews, getRatings } from '../services/SQLiteService';


const ProfileScreen = () => {
  const [profilePic, setProfilePic] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [ratingsVisible, setRatingsVisible] = useState(false);
  const db = SQLite.useSQLiteContext();

  // Handle reviews from database and show review screen
  const handleMyReviewsPress = async () => {
    try {
      const fetchedReviews = await getReviews(db);
      setReviews(fetchedReviews);
      setReviewsVisible(true);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Handle ratings from database and show ratings screen
  const handleMyRatingsPress = async () => {
    try {
      const fetchedRatings = await getRatings(db);
      setRatings(fetchedRatings);
      setRatingsVisible(true);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };



  // Functions to update profile picture
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
      setProfilePic(result.assets[0].uri);
    }
  };
  

  // Function to take photo for profile picture
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
      setProfilePic(result.assets[0].uri);
    }
  };
  
  // Alert to update profile picture
  const handleProfilePicPress = () => {
    Alert.alert(
      'Update Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel'},
      ],
      { cancelable: true }
    );
  };

  // Render a rating item as album name plus a star rating (out of 5 stars)
  const renderRatingItem = ({ item }) => {
    const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
    return (
      <View style={styles.ratingItem}>
        <Text style={styles.ratingAlbum}>{item.album}</Text>
        <Text style={styles.ratingStars}>{stars}</Text>
      </View>
    );
  };

  // Render function for displaying review screen with album name and text
  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewAlbum}>{item.album}</Text>
      <Text style={styles.reviewText}>{item.review}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.profilePicContainer} onPress={handleProfilePicPress}>
      <Image source={{ uri: profilePic }} style={[styles.profilePic, { resizeMode: 'cover' }]} />
      </TouchableOpacity>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleMyReviewsPress}>
          <Text style={styles.buttonText}>My Reviews</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleMyRatingsPress}>
          <Text style={styles.buttonText}>My Ratings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>My Lists</Text>
        </TouchableOpacity>
      </View>

    {/* Reviews modal displays stored reviews when reviewsVisible is true */}
      {reviewsVisible && (
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>My Reviews</Text>
          {reviews.length > 0 ? (
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderReviewItem}
            />
          ) : (
            <Text>No reviews found.</Text>
          )}
          <Button title="Close Reviews" onPress={() => setReviewsVisible(false)} color="#3D5A80" />
        </View>
      )}

      {/* Ratings modal displays stored ratings when ratingsVisible is true */}
      {ratingsVisible && (
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>My Ratings</Text>
          {ratings.length > 0 ? (
            <FlatList
              data={ratings}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderRatingItem}
            />
          ) : (
            <Text>No ratings found.</Text>
          )}
          <Button title="Close Ratings" onPress={() => setRatingsVisible(false)} color="#3D5A80" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  profilePicContainer: {
    marginTop: 100,
    marginBottom: 20,
    alignItems: 'center',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  reviewItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 10,
  },
  reviewAlbum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  reviewText: {
    fontSize: 14,
    color: 'grey',
  },
  ratingItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 10,
  },
  ratingAlbum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  ratingStars: {
    fontSize: 18,
    color: 'gold',
  },

});
