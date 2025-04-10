import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image, Alert } from 'react-native';
import { getAccessToken } from '../services/SpotifyTokenService';
import ActionMenu from '../components/ActionMenu';
import * as SQLite from 'expo-sqlite';
import ReviewModal from '../components/ReviewModal';
import RatingModal from '../components/RatingModal';
import { addReview, addRating } from '../services/SQLiteService';
import { firebase_auth } from '../firebaseConfig';

const SearchScreen = () => {

  const [query, setQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const db = SQLite.useSQLiteContext();

  // Debounced effect to search Spotify for albums, helps to prevent unnecessary API requests
  useEffect(() => {
    const fetchAlbums = async () => {
      if (query.trim().length === 0) {
        setAlbums([]);
        return;
      }
      setLoading(true);
      try {
        const token = await getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?type=album&q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await response.json();
        if (json?.albums?.items) {
          setAlbums(json.albums.items);
        } else {
          setAlbums([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(() => {
      fetchAlbums();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);


  const openActionMenu = (album) => {
    setSelectedAlbum(album);
    setActionMenuVisible(true);
  };

  const handleAddReview = () => {
    setActionMenuVisible(false);
    setReviewModalVisible(true);
  };

  const handleAddRating = () => {
    setActionMenuVisible(false);
    setRatingModalVisible(true);
  };

  // Function to submit review, same as HomeScreen
  const submitReview = async (reviewText) => {
    try {
      const userId = firebase_auth.currentUser.uid;
      await addReview(
        db,
        selectedAlbum.name,
        selectedAlbum.images?.[0]?.url || '',
        reviewText,
        0,
        userId
      );
      Alert.alert('Review saved!');
      setReviewModalVisible(false);
    } catch (err) {
      Alert.alert('Error saving review:', err.message);
    }
  };

  // Function to submit rating, same as HomeScreen
  const submitRating = async (rating) => {
    try {
      const userId = firebase_auth.currentUser.uid;
      await addRating(
        db,
        selectedAlbum.name,
        selectedAlbum.images?.[0]?.url || '',
        rating,
        userId
      );
      Alert.alert('Rating saved!');
      setRatingModalVisible(false);
    } catch (err) {
      Alert.alert('Error saving rating:', err.message);
    }
  };

  // Render each album item in the search result list
  const renderAlbumItem = ({ item }) => (
    <TouchableOpacity style={styles.albumItem} onPress={() => openActionMenu(item)}>
      {item.images?.[0] ? (
        <Image source={{ uri: item.images[0].url }} style={styles.albumImage} resizeMode="cover" />
      ) : (
        <View style={[styles.albumImage]} />
      )}
      <View style={styles.albumInfo}>
        <Text style={styles.albumName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.albumArtist} numberOfLines={1}>
          {item.artists.map((artist) => artist.name).join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Rating and Review modals for search
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for an album..."
        placeholderTextColor="grey"
        value={query}
        onChangeText={setQuery}
      />
      {loading && <ActivityIndicator size="small" color="white" />}
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={renderAlbumItem}
        style={styles.dropdown}
      />
      
      <ActionMenu
        visible={actionMenuVisible}
        album={selectedAlbum}
        onClose={() => setActionMenuVisible(false)}
        onAddReview={handleAddReview}
        onAddRating={handleAddRating}
      />
      
      <ReviewModal
        visible={reviewModalVisible}
        album={selectedAlbum}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={submitReview}
      />
      
      <RatingModal
        visible={ratingModalVisible}
        album={selectedAlbum}
        onClose={() => setRatingModalVisible(false)}
        onSubmit={submitRating}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 10 },
  searchInput: { backgroundColor: '#1E1E1E', color: 'white', paddingHorizontal: 10, paddingVertical: 8, marginBottom: 10, borderWidth: 1, borderColor: '#333333' },
  dropdown: {},
  albumItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 8, marginBottom: 5 },
  albumImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  albumInfo: { flex: 1 },
  albumName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  albumArtist: { color: 'grey', fontSize: 14 },
});

export default SearchScreen;
