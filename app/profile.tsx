import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Camera, LogOut, CreditCard as Edit3 } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState('https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop');
  const [editingField, setEditingField] = useState<string | null>(null);
  
  // These would come from registration/authentication context
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe', // From registration
    email: 'john.doe@example.com', // From registration - non-editable
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: 'January 2024',
    bio: 'Passionate learner focused on personal growth and wellness. Always striving to achieve new goals and maintain a balanced lifestyle.',
  });

  const handleFieldEdit = (field: string) => {
    if (field === 'email' || field === 'name' || field === 'joinDate') {
      return; // These fields are not editable
    }
    setEditingField(field);
  };

  const handleFieldSave = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
    Alert.alert('Success', 'Field updated successfully!');
  };

  const handleBack = () => {
    router.back();
  };

  const handleImagePicker = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        Alert.alert('Success', 'Profile photo updated!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => router.replace('/'),
        },
      ]
    );
  };

  const renderEditableField = (
    field: string,
    label: string,
    value: string,
    icon: React.ReactNode,
    editable: boolean = true,
    keyboardType: any = 'default',
    multiline: boolean = false
  ) => {
    const isEditing = editingField === field;
    const isClickable = editable && !isEditing;

    return (
      <TouchableOpacity
        style={[
          styles.infoItem,
          isEditing && styles.editingItem,
          isClickable && styles.clickableItem
        ]}
        onPress={() => editable && handleFieldEdit(field)}
        disabled={isEditing || !editable}
        activeOpacity={editable ? 0.7 : 1}
      >
        <View style={styles.infoIcon}>
          {icon}
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}</Text>
          {isEditing ? (
            <TextInput
              style={[styles.infoInput, multiline && styles.multilineInput]}
              value={value}
              onChangeText={(text) => setUserInfo(prev => ({ ...prev, [field]: text }))}
              onBlur={() => handleFieldSave(field, value)}
              placeholder={`Enter your ${label.toLowerCase()}`}
              placeholderTextColor="#9CA3AF"
              keyboardType={keyboardType}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
              textAlignVertical={multiline ? 'top' : 'center'}
              autoFocus={true}
              returnKeyType={multiline ? 'default' : 'done'}
              blurOnSubmit={!multiline}
            />
          ) : (
            <View style={styles.valueContainer}>
              <Text style={[styles.infoValue, multiline && styles.multilineValue]}>
                {value}
              </Text>
              {editable && (
                <View style={styles.editHint}>
                  <Edit3 size={14} color="#9CA3AF" />
                  <Text style={styles.editHintText}>Tap to edit</Text>
                </View>
              )}
              {!editable && (
                <Text style={styles.infoNote}>
                  {field === 'email' ? 'Cannot be changed' : 'From registration'}
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <ArrowLeft size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity 
            style={styles.profileImageWrapper}
            onPress={handleImagePicker}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.cameraButton}>
              <Camera size={20} color="#FFFFFF" />
            </View>
            <View style={styles.imageEditHint}>
              <Text style={styles.imageEditHintText}>Tap to change photo</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userTitle}>ThriveMate Member</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Text style={styles.sectionSubtitle}>Tap any field to edit it directly</Text>
          
          {renderEditableField(
            'name',
            'Full Name',
            userInfo.name,
            <User size={20} color="#4F46E5" />,
            false
          )}

          {renderEditableField(
            'email',
            'Email',
            userInfo.email,
            <Mail size={20} color="#4F46E5" />,
            false,
            'email-address'
          )}

          {renderEditableField(
            'phone',
            'Phone',
            userInfo.phone,
            <Phone size={20} color="#4F46E5" />,
            true,
            'phone-pad'
          )}

          {renderEditableField(
            'location',
            'Location',
            userInfo.location,
            <MapPin size={20} color="#4F46E5" />,
            true
          )}

          {renderEditableField(
            'joinDate',
            'Member Since',
            userInfo.joinDate,
            <Calendar size={20} color="#4F46E5" />,
            false
          )}
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.sectionSubtitle}>Tap to edit your bio</Text>
          
          <TouchableOpacity
            style={[
              styles.bioItem,
              editingField === 'bio' && styles.editingBioItem,
              editingField !== 'bio' && styles.clickableBioItem
            ]}
            onPress={() => handleFieldEdit('bio')}
            disabled={editingField === 'bio'}
            activeOpacity={0.7}
          >
            {editingField === 'bio' ? (
              <TextInput
                style={styles.bioInput}
                value={userInfo.bio}
                onChangeText={(text) => setUserInfo(prev => ({ ...prev, bio: text }))}
                onBlur={() => handleFieldSave('bio', userInfo.bio)}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9CA3AF"
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                autoFocus={true}
                returnKeyType="default"
                blurOnSubmit={true}
              />
            ) : (
              <View>
                <Text style={styles.bioText}>{userInfo.bio}</Text>
                <View style={styles.bioEditHint}>
                  <Edit3 size={14} color="#9CA3AF" />
                  <Text style={styles.editHintText}>Tap to edit bio</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40, // Same width as back button for centering
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 16,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#4F46E5',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  imageEditHint: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  imageEditHintText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  infoContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  clickableItem: {
    borderColor: '#D1D5DB',
    backgroundColor: '#FAFBFC',
  },
  editingItem: {
    borderColor: '#4F46E5',
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.1,
  },
  infoIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 6,
  },
  valueContainer: {
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 4,
  },
  multilineValue: {
    lineHeight: 24,
  },
  editHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  editHintText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  infoNote: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 2,
  },
  infoInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#4F46E5',
    minHeight: 40,
    lineHeight: 20,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
    lineHeight: 24,
  },
  bioContainer: {
    marginBottom: 32,
  },
  bioItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  clickableBioItem: {
    borderColor: '#D1D5DB',
    backgroundColor: '#FAFBFC',
  },
  editingBioItem: {
    borderColor: '#4F46E5',
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.1,
  },
  bioText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 24,
    marginBottom: 8,
  },
  bioEditHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignSelf: 'center',
  },
  bioInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 120,
    lineHeight: 24,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  logoutContainer: {
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});