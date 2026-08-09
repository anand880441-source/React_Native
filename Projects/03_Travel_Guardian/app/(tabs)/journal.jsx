import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, TextInput, Alert, SafeAreaView } from 'react-native';
import { getJournalEntries, saveJournalEntry, deleteJournalEntry, exportJournalAsJSON } from '../../utils/journalStorage';

export default function JournalTab() {
  const [entries, setEntries] = useState([]);
  const [notesInput, setNotesInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await getJournalEntries();
    setEntries(data);
  };

  const handleAddManualEntry = async () => {
    if (!notesInput.trim()) {
      Alert.alert('Validation Error', 'Please enter notes for your journal entry.');
      return;
    }

    await saveJournalEntry({
      notes: notesInput,
      address: locationInput || 'Manual Entry Location',
      latitude: '28.6139',
      longitude: '77.2090',
    });

    setNotesInput('');
    setLocationInput('');
    loadEntries();
    Alert.alert('Success', 'Journal entry saved to AsyncStorage!');
  };

  const handleDelete = async (id) => {
    const updated = await deleteJournalEntry(id);
    setEntries(updated);
  };

  const handleExportJSON = async () => {
    try {
      const jsonStr = await exportJournalAsJSON();
      Alert.alert('Travel Journal JSON Export', jsonStr.slice(0, 300) + (jsonStr.length > 300 ? '...' : ''));
    } catch (e) {
      Alert.alert('Export Error', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Part 8: Travel Journal</Text>

        <Pressable style={styles.exportBtn} onPress={handleExportJSON}>
          <Text style={styles.exportBtnText}>📤 EXPORT JOURNAL AS JSON</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Quick Journal Entry</Text>
          <TextInput
            style={styles.input}
            placeholder="Destination / Location..."
            placeholderTextColor="#888"
            value={locationInput}
            onChangeText={setLocationInput}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Travel notes..."
            placeholderTextColor="#888"
            multiline
            value={notesInput}
            onChangeText={setNotesInput}
          />
          <Pressable style={styles.btn} onPress={handleAddManualEntry}>
            <Text style={styles.btnText}>💾 SAVE TO ASYNCSTORAGE</Text>
          </Pressable>
        </View>

        <Text style={styles.subTitle}>Stored Journal Entries ({entries.length})</Text>

        {entries.length === 0 ? (
          <Text style={styles.emptyText}>No travel journal entries stored yet.</Text>
        ) : (
          entries.map((item) => (
            <View key={item.id} style={styles.journalCard}>
              {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.journalImage} />}
              <View style={styles.journalContent}>
                <Text style={styles.journalTitle}>📍 {item.address || 'Location'}</Text>
                <Text style={styles.journalNotes}>{item.notes}</Text>
                <Text style={styles.journalMeta}>
                  Lat: {item.latitude} | Lon: {item.longitude}
                </Text>
                <Text style={styles.journalTime}>📅 {item.timestamp}</Text>

                <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteBtnText}>🗑 Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { padding: 16, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  exportBtn: { width: '100%', backgroundColor: '#673AB7', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 14 },
  exportBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  card: { width: '100%', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 6, marginBottom: 8, fontSize: 13, color: '#000' },
  btn: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  subTitle: { fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 10, color: '#333' },
  emptyText: { color: '#777', fontStyle: 'italic', marginVertical: 10 },
  journalCard: { width: '100%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 12, overflow: 'hidden', flexDirection: 'row' },
  journalImage: { width: 100, height: 100 },
  journalContent: { flex: 1, padding: 10 },
  journalTitle: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  journalNotes: { fontSize: 12, color: '#444', marginVertical: 4 },
  journalMeta: { fontSize: 10, color: '#777' },
  journalTime: { fontSize: 10, color: '#999', marginTop: 2 },
  deleteBtn: { alignSelf: 'flex-end', backgroundColor: '#ffebee', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 4 },
  deleteBtnText: { color: '#d32f2f', fontSize: 11, fontWeight: 'bold' },
});
