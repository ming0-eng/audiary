import React from 'react';
import { Modal, View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';

const AlbumActionMenu = ({ visible, album, onClose, onAddReview, onAddRating, onAddToList }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuHeader}>{album?.name}</Text>
          <TouchableOpacity style={styles.menuButton} onPress={onAddReview}>
            <Text style={styles.menuButtonText}>Add Review</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={onAddRating}>
            <Text style={styles.menuButtonText}>Add Rating</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={onAddToList}>
            <Text style={styles.menuButtonText}>Add to List</Text>
          </TouchableOpacity>
          <Button title="Cancel" onPress={onClose} color="grey" />
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
  menuContainer: {
    width: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  menuHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuButton: {
    backgroundColor: '#3D5A80',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlbumActionMenu;
