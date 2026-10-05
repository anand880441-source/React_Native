import { StyleSheet, Text, View, Button, FlatList, Image, TextInput, Pressable,Alert } from 'react-native'
import React, {useState } from 'react'
import * as Contacts from "expo-contacts"


const ContactsApp = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [permission, setPermission] = useState(null);
  const [searchContact, setSearchContact] = useState("");
  const [isFormOpen, setIsFromOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleReqPermission = async () => {
    const contactsPermission = await Contacts.requestPermissionsAsync();

    if (contactsPermission) {
      setPermission(contactsPermission)
    }

    if (!contactsPermission.granted) {
      alert('Permission to access contacts was denied');
      return;
    }

    const getContacts = await Contacts.getContactsAsync({
      sort: Contacts.SortTypes.FirstName,
    });

    if (getContacts && getContacts.data) {
      console.log(getContacts)
      setAllContacts(getContacts.data);
    }
  }


  const deleteContact = (id) => {
    setAllContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleSearchContacts = allContacts.filter((ele) => {
    const name = ele.name?.toLowerCase().split(' ').join('') || '';
    const phone = ele.phoneNumbers?.[0]?.number.split(' ').join('') || '';

    return (
      name.includes(searchContact.toLowerCase().trim()) ||
      phone.includes(searchContact)
    );
  });

    const handleSaveContact = async () => {
    if (!name || !phone) {
      Alert.alert("Error", "Name and phone number required");
      return;
    }
    try {
      const contact = {
        [Contacts.Fields.FirstName]: name,
        phoneNumbers: [{ label: "mobile", number: phone }],
      };
      
      await Contacts.addContactAsync(contact);
      Alert.alert("Success", "Contact saved successfully!");
      
      setName("");
      setPhone("");
      setOpenForm(false);
      await fetchContacts();
    } catch (error) {
      Alert.alert("Error", "Unable to save contact directly");
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerTop, styles.header]}>
        <Text style={styles.title}>Contacts</Text>
      </View>

      <TextInput 
        placeholder='Search Contact...'
        style={styles.input}
        value={searchContact}
        onChangeText={setSearchContact}
      />

      <FlatList
        data={handleSearchContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <View style={styles.contactDetails}>
              {
                item.image ? <Image style={styles.profile} source={item.image}/> : <Text style={styles.imgBag}>{item?.firstName?.[0]}</Text>
              }
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.subText}>{item?.phoneNumbers?.[0]?.number || 'No number'}</Text>
              </View>
            </View>

            <Pressable style={styles.deleteButton} onPress={() => deleteContact(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    

      {permission && permission.granted === true ?
        <Button title="Refresh Contacts" onPress={handleReqPermission} /> :
        <Button title="Request Permission" onPress={handleReqPermission} />
      }

      {isFormOpen ? (
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Enter name" style={styles.formInput} />
          <Text style={styles.formLabel}>Phone</Text>
          <TextInput value={phone} onChangeText={setPhone} placeholder="Enter phone number" keyboardType="phone-pad" style={styles.formInput} />
          <Button title="Submit New Contact" onPress={handleSaveContact} />
          <Button title="Cancel" color="gray" onPress={() => setOpenForm(false)} />
        </View>
      ) : (
        <Pressable style={[styles.imgBag, styles.floatingAdd]} onPress={() => setIsFromOpen(true)}>
          <Text style={styles.addText}>+</Text>
        </Pressable>
      )}
    </View>
  )
}

export default ContactsApp




// import { StyleSheet, Text, View, Button, FlatList, Image, TextInput, Pressable, Alert } from 'react-native';
// import React, { useState, useMemo, useEffect } from 'react';
// import * as Contacts from 'expo-contacts';

// const ContactsApp = () => {
//   const [allContacts, setAllContacts] = useState([]);
//   const [permission, setPermission] = useState(null);
//   const [searchContact, setSearchContact] = useState('');
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [openForm, setOpenForm] = useState(false);


//   const fetchContacts = async () => {
//     const { data } = await Contacts.getContactsAsync({
//       fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
//       sort: Contacts.SortTypes.FirstName,
//     });
//     if (data) setAllContacts(data);
//   };

//   const handleReqPermission = async () => {
//     const contactsPermission = await Contacts.requestPermissionsAsync();
//     setPermission(contactsPermission);

//     if (!contactsPermission.granted) {
//       Alert.alert('Permission Denied', 'Permission to access contacts was denied');
//       return;
//     }
//     await fetchContacts();
//   };

//   useEffect(() => {
//     (async () => {
//       const { status } = await Contacts.getPermissionsAsync();
//       if (status === 'granted') {
//         setPermission({ granted: true });
//         await fetchContacts();
//       }
//     })();
//   }, []);

//   const filteredContacts = useMemo(() => {
//     const cleanSearch = searchContact.toLowerCase().trim();
//     if (!cleanSearch) return allContacts;

//     return allContacts.filter((ele) => {
//       const contactName = ele.name?.toLowerCase().split(' ').join('') || '';
//       const contactPhone = ele.phoneNumbers?.[0]?.number.split(' ').join('') || '';
//       return contactName.includes(cleanSearch) || contactPhone.includes(cleanSearch);
//     });
//   }, [allContacts, searchContact]);

  // const handleDelete = async (item) => {
  //   Alert.alert(
  //     'Delete Contact',
  //     `Are you sure you want to delete ${item.name}?`,
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'Delete',
  //         style: 'destructive',
  //         onPress: async () => {
  //           try {
  //             await Contacts.removeContactAsync(item.id);
  //             await fetchContacts();
  //           } catch (err) {
  //             Alert.alert("Error", "Could not delete contact");
  //           }
  //         }
  //       }
  //     ]
  //   );
  // };

  // const handleSaveContact = async () => {
  //   if (!name || !phone) {
  //     Alert.alert("Error", "Name and phone number required");
  //     return;
  //   }
  //   try {
  //     const contact = {
  //       [Contacts.Fields.FirstName]: name,
  //       phoneNumbers: [{ label: "mobile", number: phone }],
  //     };
      
  //     await Contacts.addContactAsync(contact);
  //     Alert.alert("Success", "Contact saved successfully!");
      
  //     setName("");
  //     setPhone("");
  //     setOpenForm(false);
  //     await fetchContacts();
  //   } catch (error) {
  //     Alert.alert("Error", "Unable to save contact directly");
  //   }
  // };

//   return (
//     <View style={styles.container}>
//       <View style={[styles.headerTop, styles.header]}>
//         <Text style={styles.title}>Contacts</Text>
//       </View>

//       <TextInput
//         placeholder="Search Contact..."
//         style={styles.input}
//         value={searchContact}
//         onChangeText={setSearchContact}
//       />

//       <FlatList
//         data={filteredContacts}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.itemBox}>
//             <View style={styles.contactDetails}>
//               {item.image?.uri ? (
//                 <Image style={styles.profile} source={{ uri: item.image.uri }} />
//               ) : (
//                 <Text style={styles.imgBag}>{item?.firstName?.[0] || item?.name?.[0] || '?'}</Text>
//               )}
//               <View style={styles.textContainer}>
//                 <Text style={styles.itemText}>{item.name}</Text>
//                 <Text style={styles.subText}>{item?.phoneNumbers?.[0]?.number || 'No number'}</Text>
//               </View>
//             </View>
//             <Pressable style={styles.deleteButton} onPress={() => handleDelete(item)}>
//               <Text style={styles.deleteText}>Delete</Text>
//             </Pressable>
//           </View>
//         )}
//       />

//       {permission?.granted ? (
//         <Button title="Refresh Contacts" onPress={fetchContacts} />
//       ) : (
//         <Button title="Request Permission" onPress={handleReqPermission} />
//       )}

      // {openForm ? (
      //   <View style={styles.formContainer}>
      //     <Text style={styles.formLabel}>Name</Text>
      //     <TextInput value={name} onChangeText={setName} placeholder="Enter name" style={styles.formInput} />
      //     <Text style={styles.formLabel}>Phone</Text>
      //     <TextInput value={phone} onChangeText={setPhone} placeholder="Enter phone number" keyboardType="phone-pad" style={styles.formInput} />
      //     <Button title="Submit New Contact" onPress={handleSaveContact} />
      //     <Button title="Cancel" color="gray" onPress={() => setOpenForm(false)} />
      //   </View>
      // ) : (
      //   <Pressable style={[styles.imgBag, styles.floatingAdd]} onPress={() => setOpenForm(true)}>
      //     <Text style={styles.addText}>+</Text>
      //   </Pressable>
      // )}
//     </View>
//   );
// };

// export default ContactsApp;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff', paddingTop: 50 },
  header: { marginBottom: 16, marginTop: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: 0.5 },
  itemBox: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ececec', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contactDetails: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  textContainer: { marginLeft: 12, flex: 1 },
  itemText: { fontSize: 16, fontWeight: '600' },
  subText: { fontSize: 14, color: '#666' },
  profile: { width: 40, height: 40, borderRadius: 20 },
  imgBag: { backgroundColor: '#007AFF', width: 40, height: 40, borderRadius: 20, color: '#fff', textAlign: 'center', lineHeight: 40, fontWeight: 'bold', fontSize: 16, overflow: 'hidden' },
  floatingAdd: { marginVertical: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' },
  addText: { color: '#fff', fontSize: 24, fontWeight: 'bold', lineHeight: 36 },
  input: { width: '100%', height: 50, backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: '#333333', marginBottom: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  deleteButton: { backgroundColor: '#ff3b30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  deleteText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  formContainer: { padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#ddd' },
  formLabel: { fontWeight: '700', marginBottom: 4 },
  formInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12, backgroundColor: '#fff' }
});
