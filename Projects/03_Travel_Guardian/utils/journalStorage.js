import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';

const STORAGE_KEY = '@travel_guardian_journal_entries';

export const getJournalEntries = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch journal entries', e);
    return [];
  }
};

export const saveJournalEntry = async (entry) => {
  try {
    const existingEntries = await getJournalEntries();
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      ...entry,
    };
    const updatedEntries = [newEntry, ...existingEntries];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    return updatedEntries;
  } catch (e) {
    console.error('Failed to save journal entry', e);
    throw e;
  }
};

export const deleteJournalEntry = async (id) => {
  try {
    const existingEntries = await getJournalEntries();
    const updatedEntries = existingEntries.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    return updatedEntries;
  } catch (e) {
    console.error('Failed to delete journal entry', e);
    throw e;
  }
};

export const exportJournalAsJSON = async () => {
  try {
    const entries = await getJournalEntries();
    const jsonString = JSON.stringify(entries, null, 2);
    // Sharing functionality
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      // In web/expo context, return formatted string
      return jsonString;
    }
    return jsonString;
  } catch (e) {
    console.error('Failed to export journal', e);
    throw e;
  }
};
