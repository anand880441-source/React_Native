import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function Students() {
  const [selectedStudent, setSelectedStudent] = useState('');

  const students = [
    { id: '1', name: 'Rahul' },
    { id: '2', name: 'Priya' },
    { id: '3', name: 'Amit' },
    { id: '4', name: 'Sneha' },
    { id: '5', name: 'Shayantani' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.selected}>
        Selected Student:{' '}
        <Text style={styles.highlightText}>
          {selectedStudent || 'None'}
        </Text>
      </Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setSelectedStudent(item.name)}
            >
              <Text style={styles.buttonText}>Select</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff', 
  },
  selected: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '600',
    color: '#333333',
  },
  highlightText: {
    color: '#007AFF', 
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    backgroundColor: '#f8f9fa', 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eaeaea', 
  },
  itemText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF', 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonPressed: {
    backgroundColor: '#0056b3', 
    opacity: 0.9,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
