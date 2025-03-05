import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';

// Rating modal component to display a modal for rating and submitting 
const RatingModal = ({ visible, album, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);

  // Function to render 5 stars for rating system
  const renderStars = () => {
    let stars = [];
    // Loop for 5 stars, keep track of i to set corresponding star number and fill a star
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Text style={styles.star}>{i <= rating ? '★' : '☆'}</Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };

  // Modal for rating, implemented animation, show album name your rating...
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Rate {album?.name}</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
          <View style={styles.modalButtons}>
            <Button title="Submit" onPress={() => onSubmit(rating)} color="#3D5A80" />
            <Button title="Cancel" onPress={onClose} color="grey" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    fontSize: 30,
    marginHorizontal: 5,
    color: 'gold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default RatingModal;
