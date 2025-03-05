import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { getAccessToken } from '../services/SpotifyTokenService';
import AlbumActionMenu from '../components/ActionMenu';
import RatingModal from '../components/RatingModal';
import ReviewModal from '../components/ReviewModal';
import { addReview, addRating } from '../services/SQLiteService';

export default function HomeScreen() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal visibility and selected album state
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const db = SQLite.useSQLiteContext();

  // Function to retrieve new album releases from the Spotify API
  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch('https://api.spotify.com/v1/browse/new-releases', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await response.json();
        if (json?.albums?.items) { // If albums are found we update the state
          setAlbums(json.albums.items);
        } else {
          throw new Error('No albums found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNewReleases();
  }, []);

  // When an album is clicked, open the action menu by default
  const openActionMenu = (album) => {
    setSelectedAlbum(album);
    setActionMenuVisible(true);
  };

  // Handler functions to show the desired modal and hide the other
  const handleAddReview = () => {
    setActionMenuVisible(false);
    setReviewModalVisible(true);
  };

  const handleAddRating = () => {
    setActionMenuVisible(false);
    setRatingModalVisible(true);
  };


  // Functions to submit review or rating, show confirmation and close modal
  const submitReview = async (reviewText) => {
    try {
      await addReview(db, selectedAlbum.name, reviewText, 0);
      Alert.alert('Review saved!');
      setReviewModalVisible(false);
    } catch (err) {
      Alert.alert('Error saving review:', err.message);
    }
  };

  const submitRating = async (rating) => {
    try {
      await addRating(db, selectedAlbum.name, rating);
      Alert.alert('Rating saved!');
      setRatingModalVisible(false);
    } catch (err) {
      Alert.alert('Error saving rating:', err.message);
    }
  };

  const renderAlbumItem = ({ item }) => (
    <TouchableOpacity style={styles.albumContainer} onPress={() => openActionMenu(item)}>
      {item.images?.[0] && (
        <Image source={{ uri: item.images[0].url }} style={styles.albumImage} resizeMode="cover" />
      )}
      <Text style={styles.albumTitle} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.albumArtist} numberOfLines={1}>{item.artists.map((artist) => artist.name).join(', ')}</Text>
    </TouchableOpacity>
  );


  // Animation to display loading icon while fetching Spotify data
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </SafeAreaView>
    );
  }

  // Render that displays the new releases list in a 2 column fashion
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>New Releases</Text>
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id}
          renderItem={renderAlbumItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
        />
      </View>
      <AlbumActionMenu
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
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 10 },
  header: { color: 'white', fontSize: 24, fontWeight: 'bold', marginVertical: 10, marginLeft: 5 },
  listContent: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between' },
  albumContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    margin: 5,
    borderRadius: 8,
    padding: 10,
  },
  albumImage: { width: '100%', aspectRatio: 1, borderRadius: 8, marginBottom: 8 },
  albumTitle: { color: 'white', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  albumArtist: { color: '#AAAAAA', fontSize: 12 },
  loadingContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'white', fontSize: 16 },
});

