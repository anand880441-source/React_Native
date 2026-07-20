import { StyleSheet, Text, View, FlatList, TouchableOpacity, Platform, useColorScheme, TextInput, Modal, ScrollView, Alert, Linking } from 'react-native'
import React, { useState, useMemo } from 'react'
import * as Contacts from 'expo-contacts'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

// Beautiful avatar colors
const AVATAR_COLORS = [
  '#FF9500', '#FF2D55', '#5856D6', '#34C759', '#007AFF', 
  '#AF52DE', '#FF3B30', '#5AC8FA', '#1ABC9C', '#2ECC71', 
  '#3498DB', '#9B59B6', '#E67E22', '#E74C3C'
];

// Helper to get color based on contact name
const getAvatarColor = (name) => {
  if (!name) return '#8E8E93';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

// Initial Mock Contacts
const INITIAL_CONTACTS = [
  {
    id: 'mock-1',
    name: 'Anand Sharma',
    firstName: 'Anand',
    lastName: 'Sharma',
    phoneNumbers: [{ number: '+91 98765 43210' }],
    emails: [{ address: 'anand.sharma@example.com' }],
    company: 'React Developers Ltd',
    note: 'Lead developer on the mobile application project.'
  },
  {
    id: 'mock-2',
    name: 'Jane Doe',
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumbers: [{ number: '+1 (555) 019-2834' }],
    emails: [{ address: 'jane.doe@example.com' }],
    company: 'Design Studio',
    note: 'UID/UX Consultant'
  },
  {
    id: 'mock-3',
    name: 'John Smith',
    firstName: 'John',
    lastName: 'Smith',
    phoneNumbers: [{ number: '+1 (555) 438-9012' }],
    emails: [{ address: 'john.smith@example.com' }],
    company: 'Acme Corp',
    note: 'Supplier coordinator.'
  },
  {
    id: 'mock-4',
    name: 'Kishan Suthar',
    firstName: 'Kishan',
    lastName: 'Suthar',
    phoneNumbers: [{ number: '+91 99999 88888' }],
    emails: [{ address: 'kishan@example.com' }],
    company: 'University Student',
    note: 'Mobile Systems Engineering course coordinator.'
  }
];

export default function ContactsScreen() {
  const [contactList, setContactList] = useState(INITIAL_CONTACTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  // Modal visibility states
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [formModalVisible, setFormModalVisible] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  
  // Form input states
  const [formMode, setFormMode] = useState('add') // 'add' or 'edit'
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [note, setNote] = useState('')

  // Sync / Fetch contacts from device
  const getContacts = async () => {
    setLoading(true)
    setError(null)
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.Emails,
            Contacts.Fields.Company,
            Contacts.Fields.Note,
            Contacts.Fields.FirstName,
            Contacts.Fields.LastName,
          ],
        });

        if (data.length > 0) {
          // Format & merge with current contacts, avoiding duplicate IDs
          const formatted = data.map(item => ({
            id: item.id || Math.random().toString(),
            name: item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Unknown',
            firstName: item.firstName || '',
            lastName: item.lastName || '',
            phoneNumbers: item.phoneNumbers || [],
            emails: item.emails || [],
            company: item.company || '',
            note: item.note || ''
          }));

          setContactList(prev => {
            const combined = [...prev];
            formatted.forEach(c => {
              if (!combined.some(existing => existing.id === c.id || 
                  (c.phoneNumbers?.[0]?.number && existing.phoneNumbers?.[0]?.number === c.phoneNumbers?.[0]?.number))) {
                combined.push(c);
              }
            });
            return combined;
          });
          
          Alert.alert('Sync Successful', `Imported ${formatted.length} contacts from device.`);
        } else {
          setError('No contacts found on device.');
        }
      } else {
        setError('Permission to access contacts was denied');
      }
    } catch (err) {
      setError('An error occurred while fetching contacts');
    } finally {
      setLoading(false)
    }
  }

  // Filtered contacts based on search query
  const filteredContacts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return [...contactList].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return contactList.filter(c => {
      const nameMatch = (c.name || '').toLowerCase().includes(q);
      const phoneMatch = c.phoneNumbers?.some(p => p.number.replace(/\s+/g, '').includes(q));
      const emailMatch = c.emails?.some(e => e.address.toLowerCase().includes(q));
      const companyMatch = (c.company || '').toLowerCase().includes(q);
      return nameMatch || phoneMatch || emailMatch || companyMatch;
    }).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [contactList, searchQuery]);

  // Handle Quick Call / Message Actions
  const makeCall = (phoneNumber) => {
    if (!phoneNumber) return;
    const url = `tel:${phoneNumber.replace(/\s+/g, '')}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to initiate call. URL scheme not supported.');
        }
      })
      .catch(() => Alert.alert('Error', 'An unexpected error occurred.'));
  };

  const sendSMS = (phoneNumber) => {
    if (!phoneNumber) return;
    const url = `sms:${phoneNumber.replace(/\s+/g, '')}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to send SMS.');
        }
      })
      .catch(() => Alert.alert('Error', 'An unexpected error occurred.'));
  };

  const sendEmail = (emailAddress) => {
    if (!emailAddress) return;
    const url = `mailto:${emailAddress}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to draft email.');
        }
      })
      .catch(() => Alert.alert('Error', 'An unexpected error occurred.'));
  };

  // Open Form for Adding New Contact
  const handleOpenAddForm = () => {
    setFormMode('add');
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setCompany('');
    setNote('');
    setFormModalVisible(true);
  };

  // Open Form for Editing Existing Contact
  const handleOpenEditForm = (contact) => {
    setFormMode('edit');
    setFirstName(contact.firstName || contact.name.split(' ')[0] || '');
    setLastName(contact.lastName || contact.name.split(' ').slice(1).join(' ') || '');
    setPhone(contact.phoneNumbers?.[0]?.number || '');
    setEmail(contact.emails?.[0]?.address || '');
    setCompany(contact.company || '');
    setNote(contact.note || '');
    setFormModalVisible(true);
  };

  // Save Contact (Create or Edit)
  const handleSaveContact = () => {
    if (!firstName.trim() && !lastName.trim()) {
      Alert.alert('Validation Error', 'First Name or Last Name is required.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (formMode === 'add') {
      const newContact = {
        id: `local-${Date.now()}`,
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumbers: [{ number: phone.trim() }],
        emails: email.trim() ? [{ address: email.trim() }] : [],
        company: company.trim(),
        note: note.trim(),
      };

      setContactList(prev => [...prev, newContact]);
      setFormModalVisible(false);
      Alert.alert('Success', 'Contact created successfully.');
    } else {
      // Editing
      setContactList(prev => 
        prev.map(c => 
          c.id === selectedContact.id 
            ? {
                ...c,
                name: fullName,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumbers: [{ number: phone.trim() }],
                emails: email.trim() ? [{ address: email.trim() }] : [],
                company: company.trim(),
                note: note.trim()
              }
            : c
        )
      );
      
      // Update the active detail view state
      setSelectedContact(prev => ({
        ...prev,
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumbers: [{ number: phone.trim() }],
        emails: email.trim() ? [{ address: email.trim() }] : [],
        company: company.trim(),
        note: note.trim()
      }));

      setFormModalVisible(false);
      Alert.alert('Success', 'Contact updated successfully.');
    }
  };

  // Delete Contact
  const handleDeleteContact = (contactId) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setContactList(prev => prev.filter(c => c.id !== contactId));
            setDetailModalVisible(false);
            setSelectedContact(null);
          }
        }
      ]
    );
  };

  // Render a Single Contact Card
  const renderContact = ({ item }) => {
    const initials = item.name 
      ? item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : '?';
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0
      ? item.phoneNumbers[0].number
      : 'No Phone';
    const avatarBg = getAvatarColor(item.name);

    return (
      <TouchableOpacity 
        style={[styles.contactCard, isDark && styles.contactCardDark]}
        onPress={() => {
          setSelectedContact(item);
          setDetailModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.contactInfo}>
          <ThemedText style={styles.contactName} numberOfLines={1}>{item.name}</ThemedText>
          {item.company ? <Text style={styles.contactCompany} numberOfLines={1}>{item.company}</Text> : null}
          <Text style={styles.contactPhone}>{phoneNumber}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.actionButton, isDark && styles.actionButtonDark]}
          onPress={() => makeCall(phoneNumber)}
        >
          <Ionicons name="call" size={20} color="#0A7EA4" />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <ThemedText type="title" style={styles.title}>Contacts</ThemedText>
              <Text style={styles.subtitle}>{contactList.length} Connections</Text>
            </View>
            <TouchableOpacity style={styles.syncIconButton} onPress={getContacts}>
              <Ionicons name="sync" size={22} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>

          {/* Premium Search Bar */}
          <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
            <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, isDark && styles.searchInputDark]}
              placeholder="Search contacts, numbers..."
              placeholderTextColor="#8e8e93"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                <Ionicons name="close-circle" size={18} color="#8e8e93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.centerContainer}>
            <Text style={styles.syncText}>Syncing contacts...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={renderContact}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={60} color={isDark ? "#555" : "#ccc"} />
                <ThemedText style={styles.emptyText}>
                  {searchQuery ? "No matching contacts found" : "No contacts yet"}
                </ThemedText>
              </View>
            )}
          />
        )}

        {/* Floating Action Button for Adding Contact */}
        <TouchableOpacity 
          style={styles.fab} 
          onPress={handleOpenAddForm}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>

        {/* --- DETAIL MODAL --- */}
        {selectedContact && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={detailModalVisible}
            onRequestClose={() => setDetailModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.detailModalContainer, isDark && styles.modalContainerDark]}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                    <Ionicons name="chevron-down" size={28} color={isDark ? "#fff" : "#000"} />
                  </TouchableOpacity>
                  <View style={styles.modalHeaderRight}>
                    <TouchableOpacity 
                      style={styles.modalHeaderBtn} 
                      onPress={() => handleOpenEditForm(selectedContact)}
                    >
                      <Ionicons name="pencil" size={22} color="#0A7EA4" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalHeaderBtn, { marginLeft: 16 }]} 
                      onPress={() => handleDeleteContact(selectedContact.id)}
                    >
                      <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                  <View style={styles.detailProfile}>
                    <View style={[styles.largeAvatar, { backgroundColor: getAvatarColor(selectedContact.name) }]}>
                      <Text style={styles.largeAvatarText}>
                        {selectedContact.name 
                          ? selectedContact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                          : '?'}
                      </Text>
                    </View>
                    <ThemedText style={styles.detailName}>{selectedContact.name}</ThemedText>
                    {selectedContact.company ? (
                      <Text style={styles.detailCompany}>{selectedContact.company}</Text>
                    ) : null}
                  </View>

                  {/* Horizontal Action Bar */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity 
                      style={styles.actionRowItem}
                      onPress={() => makeCall(selectedContact.phoneNumbers?.[0]?.number)}
                    >
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="call" size={22} color="#0A7EA4" />
                      </View>
                      <Text style={styles.actionIconLabel}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionRowItem}
                      onPress={() => sendSMS(selectedContact.phoneNumbers?.[0]?.number)}
                    >
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="chatbubble-ellipses" size={22} color="#34C759" />
                      </View>
                      <Text style={styles.actionIconLabel}>Message</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionRowItem}
                      onPress={() => sendEmail(selectedContact.emails?.[0]?.address)}
                      disabled={!selectedContact.emails?.[0]?.address}
                    >
                      <View style={[styles.actionIconContainer, !selectedContact.emails?.[0]?.address && styles.actionIconDisabled]}>
                        <Ionicons name="mail" size={22} color={selectedContact.emails?.[0]?.address ? "#FF9500" : "#A2A2A7"} />
                      </View>
                      <Text style={[styles.actionIconLabel, !selectedContact.emails?.[0]?.address && styles.actionLabelDisabled]}>Email</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Detail Info Cards */}
                  <View style={[styles.infoSection, isDark && styles.infoSectionDark]}>
                    <Text style={styles.infoSectionTitle}>Contact Info</Text>
                    
                    <View style={styles.infoRow}>
                      <Ionicons name="call-outline" size={20} color="#8e8e93" style={styles.infoRowIcon} />
                      <View style={styles.infoRowTextContainer}>
                        <Text style={styles.infoLabel}>phone</Text>
                        <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                          {selectedContact.phoneNumbers?.[0]?.number || 'No phone number'}
                        </Text>
                      </View>
                    </View>

                    {selectedContact.emails?.[0]?.address ? (
                      <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={20} color="#8e8e93" style={styles.infoRowIcon} />
                        <View style={styles.infoRowTextContainer}>
                          <Text style={styles.infoLabel}>email</Text>
                          <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                            {selectedContact.emails[0].address}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    {selectedContact.note ? (
                      <View style={styles.infoRow}>
                        <Ionicons name="document-text-outline" size={20} color="#8e8e93" style={styles.infoRowIcon} />
                        <View style={styles.infoRowTextContainer}>
                          <Text style={styles.infoLabel}>notes</Text>
                          <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>
                            {selectedContact.note}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}

        {/* --- ADD / EDIT FORM MODAL --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={formModalVisible}
          onRequestClose={() => setFormModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.formModalContainer, isDark && styles.modalContainerDark]}>
              <View style={styles.formHeader}>
                <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.formTitle, isDark && styles.formTitleDark]}>
                  {formMode === 'add' ? 'New Contact' : 'Edit Contact'}
                </Text>
                <TouchableOpacity onPress={handleSaveContact}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={[styles.formInput, isDark && styles.formInputDark]}
                    placeholder="First Name"
                    placeholderTextColor="#8e8e93"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={[styles.formInput, isDark && styles.formInputDark]}
                    placeholder="Last Name"
                    placeholderTextColor="#8e8e93"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={[styles.formInput, isDark && styles.formInputDark]}
                    placeholder="Phone"
                    placeholderTextColor="#8e8e93"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={[styles.formInput, isDark && styles.formInputDark]}
                    placeholder="Email"
                    placeholderTextColor="#8e8e93"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Company</Text>
                  <TextInput
                    style={[styles.formInput, isDark && styles.formInputDark]}
                    placeholder="Company"
                    placeholderTextColor="#8e8e93"
                    value={company}
                    onChangeText={setCompany}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Notes</Text>
                  <TextInput
                    style={[styles.formInput, styles.noteInput, isDark && styles.formInputDark]}
                    placeholder="Notes"
                    placeholderTextColor="#8e8e93"
                    multiline
                    numberOfLines={4}
                    value={note}
                    onChangeText={setNote}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 16,
    marginTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
    fontWeight: '500',
  },
  syncIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 44,
  },
  searchContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  searchInputDark: {
    color: '#fff',
  },
  clearSearchButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffe5e5',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  errorText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncText: {
    fontSize: 16,
    color: '#8e8e93',
  },
  listContent: {
    paddingBottom: 80,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  contactCardDark: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
    marginRight: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  contactCompany: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 13,
    color: '#8e8e93',
    fontWeight: '500',
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f2f2f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#0A7EA4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0A7EA4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  // Modal Overlays
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  detailModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    paddingHorizontal: 20,
  },
  formModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    paddingHorizontal: 20,
  },
  modalContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalHeaderRight: {
    flexDirection: 'row',
  },
  modalHeaderBtn: {
    padding: 6,
  },
  modalScroll: {
    paddingBottom: 40,
  },
  detailProfile: {
    alignItems: 'center',
    marginVertical: 10,
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  largeAvatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
  },
  detailName: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  detailCompany: {
    fontSize: 16,
    color: '#8e8e93',
    marginTop: 4,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c7c7cc',
    paddingBottom: 20,
  },
  actionRowItem: {
    alignItems: 'center',
    width: 80,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f2f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconDisabled: {
    backgroundColor: '#E5E5EA',
  },
  actionIconLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  actionLabelDisabled: {
    color: '#AEAEB2',
  },
  infoSection: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoSectionDark: {
    backgroundColor: '#2C2C2E',
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c7c7cc',
  },
  infoRowIcon: {
    marginRight: 16,
  },
  infoRowTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#8e8e93',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  infoValueDark: {
    color: '#fff',
  },
  // Form Screen Styles
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c7c7cc',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  formTitleDark: {
    color: '#fff',
  },
  cancelBtnText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  doneBtnText: {
    color: '#0A7EA4',
    fontSize: 16,
    fontWeight: '700',
  },
  formScroll: {
    paddingVertical: 20,
    paddingBottom: 60,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 16,
  },
  formInputDark: {
    backgroundColor: '#2C2C2E',
    color: '#fff',
  },
  noteInput: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
})