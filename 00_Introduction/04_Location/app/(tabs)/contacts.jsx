// import React, { useState } from 'react';
// import { Button, StyleSheet, Text, View, Alert, FlatList } from 'react-native';
// import * as Contacts from 'expo-contacts';

// const ContactsApp = () => {
//   const [contactsList, setContactsList] = useState([]);

//   const getContacts = async () => {
//     const { status } = await Contacts.requestPermissionsAsync();
    
//     if (status !== 'granted') {
//       Alert.alert('Access Denied', 'Permission to access contacts was denied.');
//       return;
//     }

//     const { data } = await Contacts.getContactsAsync({
//       fields: [Contacts.Fields.PhoneNumbers],
//     });

//     if (data.length > 0) {
//       setContactsList(data);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.innerContainer}>
//         <Text style={styles.title}>Contacts</Text>
//         <Button title="Get Contacts Access" onPress={getContacts} />
//         <FlatList 
//           data={contactsList} 
//           keyExtractor={(item) => item.id} 
//           renderItem={({ item }) => (
//             <View style={styles.contactItem}>
//               <Text style={styles.contactName}>{item.name}</Text>
//               <Text style={styles.contactPhone}>
//                 {item.phoneNumbers?.[0]?.number || "No Phone Number"}
//               </Text>
//             </View>
//           )} 
//           style={styles.list}
//         />
//       </View>
//     </View>
//   );
// };

// export default ContactsApp;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   innerContainer: {
//     backgroundColor: '#8b8b8b',
//     width: '85%',             
//     height: 400,              
//     borderRadius: 10,
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#fff',
//   },
//   list: {
//     width: '100%',
//     marginTop: 10,
//   },
//   contactItem: {
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#aaa',
//     width: '100%',
//   },
//   contactName: {
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   contactPhone: {
//     color: '#ddd',
//     fontSize: 12,
//   },
// });

import React, { useState } from 'react';
import {StyleSheet, Text, View, Alert, FlatList, TextInput, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';

const ContactsApp = () => {
  const [contactsList, setContactsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Access Denied', 'Permission to access contacts was denied.');
      return;
    }
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });
    if (data.length > 0) {
      setContactsList(data);
    }
  };

  const filteredContacts = contactsList.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        {contactsList.length === 0 && (
          <TouchableOpacity style={styles.primaryButton} onPress={getContacts}>
            <Text style={styles.buttonText}>Sync Contacts</Text>
          </TouchableOpacity>
        )}
      </View>

      {contactsList.length > 0 && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactCard} activeOpacity={0.7}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name ? item.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>
                {item.phoneNumbers?.[0]?.number || "No Phone Number"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ContactsApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 60,           
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',          
    letterSpacing: -0.5,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,              
    shadowColor: '#000',       
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#EEF0F2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    // Soft card shadow styling
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E3EFFD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#9C9EB9',
  },
});
