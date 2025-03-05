import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

// Review modal component to display a modal for writing and submitting a review
const ReviewModal = ({ visible, album, onClose, onSubmit }) => {
  const [reviewText, setReviewText] = useState('');

  // Function to handle submit, clear input when done
  const handleSubmit = () => {
    onSubmit(reviewText);
    setReviewText('');
  };

  // Modal component, implements animation, input review, text to see which album your reviewing...
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Write a Review for {album?.name}</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Your review..."
            placeholderTextColor="grey"
            multiline
            value={reviewText}
            onChangeText={setReviewText}
          />
          <View style={styles.modalButtons}>
            <Button title="Submit" onPress={handleSubmit} color="#3D5A80" />
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
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#121212',
    color: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
});

export default ReviewModal;
