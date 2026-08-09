import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, Modal, TextInput, Alert, SafeAreaView } from 'react-native';

export default function GalleryTab() {
  const [galleryItems, setGalleryItems] = useState([
    {
      id: '1',
      name: 'Mountain Trek.jpg',
      uri: 'https://picsum.photos/400/300?random=1',
      isFavorite: true,
      timestamp: '2026-08-09 10:30 AM',
    },
    {
      id: '2',
      name: 'Beach Sunset.jpg',
      uri: 'https://picsum.photos/400/300?random=2',
      isFavorite: false,
      timestamp: '2026-08-08 06:15 PM',
    },
    {
      id: '3',
      name: 'Historic Temple.jpg',
      uri: 'https://picsum.photos/400/300?random=3',
      isFavorite: true,
      timestamp: '2026-08-07 02:45 PM',
    },
  ]);

  const [filterFavorite, setFilterFavorite] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [renameInput, setRenameInput] = useState('');

  const toggleFavorite = (id) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const handleDelete = (id) => {
    Alert.alert('Confirm Delete', 'Delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setGalleryItems((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  const openRenameModal = (item) => {
    setEditingItem(item);
    setRenameInput(item.name);
  };

  const handleSaveRename = () => {
    if (!renameInput.trim()) return;
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === editingItem.id ? { ...item, name: renameInput } : item))
    );
    setEditingItem(null);
  };

  const displayedItems = filterFavorite
    ? galleryItems.filter((item) => item.isFavorite)
    : galleryItems;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Part 9: Image Gallery</Text>

        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterBtn, !filterFavorite && styles.activeFilterBtn]}
            onPress={() => setFilterFavorite(false)}
          >
            <Text style={[styles.filterText, !filterFavorite && styles.activeFilterText]}>
              All Photos ({galleryItems.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.filterBtn, filterFavorite && styles.activeFilterBtn]}
            onPress={() => setFilterFavorite(true)}
          >
            <Text style={[styles.filterText, filterFavorite && styles.activeFilterText]}>
              ❤️ Favorites ({galleryItems.filter((i) => i.isFavorite).length})
            </Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {displayedItems.length === 0 ? (
            <Text style={styles.emptyText}>No photos found in gallery.</Text>
          ) : (
            displayedItems.map((item) => (
              <View key={item.id} style={styles.gridCard}>
                <Image source={{ uri: item.uri }} style={styles.gridImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemTime}>{item.timestamp}</Text>

                  <View style={styles.cardActions}>
                    <Pressable onPress={() => toggleFavorite(item.id)}>
                      <Text style={styles.actionIcon}>{item.isFavorite ? '❤️' : '🤍'}</Text>
                    </Pressable>

                    <Pressable onPress={() => openRenameModal(item)}>
                      <Text style={styles.actionIcon}>✏️</Text>
                    </Pressable>

                    <Pressable onPress={() => handleDelete(item.id)}>
                      <Text style={styles.actionIcon}>🗑</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <Modal visible={!!editingItem} transparent animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Rename Photo</Text>
              <TextInput style={styles.input} value={renameInput} onChangeText={setRenameInput} />
              <View style={styles.modalBtnRow}>
                <Pressable style={styles.saveBtn} onPress={handleSaveRename}>
                  <Text style={styles.btnText}>Save</Text>
                </Pressable>
                <Pressable style={styles.cancelBtn} onPress={() => setEditingItem(null)}>
                  <Text style={styles.btnText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { padding: 16, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  filterRow: { flexDirection: 'row', width: '100%', marginBottom: 14, gap: 8 },
  filterBtn: { flex: 1, backgroundColor: '#e0e0e0', padding: 10, borderRadius: 8, alignItems: 'center' },
  activeFilterBtn: { backgroundColor: '#2196F3' },
  filterText: { fontSize: 13, fontWeight: 'bold', color: '#555' },
  activeFilterText: { color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  gridCard: { width: '48%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 14, overflow: 'hidden' },
  gridImage: { width: '100%', height: 120 },
  cardInfo: { padding: 8 },
  itemName: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  itemTime: { fontSize: 10, color: '#888', marginTop: 2 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderColor: '#eee' },
  actionIcon: { fontSize: 16 },
  emptyText: { color: '#777', fontStyle: 'italic', marginVertical: 20 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', backgroundColor: '#fff', padding: 16, borderRadius: 10 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 6, marginBottom: 12 },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  saveBtn: { backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  cancelBtn: { backgroundColor: '#9E9E9E', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
