import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, Button, Image, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { getReviews } from '../services/SQLiteService';
import { firebase_auth } from '../firebaseConfig';

const MyReviewsScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = SQLite.useSQLiteContext();

  // Fetch reviews from database, logs the desired data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const userId = firebase_auth.currentUser.uid;
        const data = await getReviews(db, userId);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Render each review as a row with album cover, name, and review
  const renderReviewItem = ({ item }) => (
    <View style={styles.card}>
      {item.cover && item.cover.length > 0 ? (
        <Image source={{ uri: item.cover }} style={styles.albumImage} />
      ) : (
        <View style={[styles.albumImage]} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.albumName}>{item.album}</Text>
        <Text style={styles.reviewText}>{item.review}</Text>
      </View>
    </View>
  );;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Reviews</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReviewItem}
        />
      )}
      <Button title="Back" onPress={() => navigation.goBack()} color="#3D5A80" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginLeft: 5 },
  loadingText: { color: 'white' },
  card: { flexDirection: 'row', backgroundColor: '#1E1E1E', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1 },
  albumImage: { width: 60, height: 60, borderRadius: 4, marginRight: 10 },
  cardContent: { flex: 1 },
  albumName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  reviewText: { color: 'grey', fontSize: 14, marginTop: 5 },
});

export default MyReviewsScreen;
