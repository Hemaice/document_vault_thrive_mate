import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Share,
} from 'react-native';
import { ArrowLeft, Eye, Share as ShareIcon, Trash2, Download, MoveVertical as MoreVertical } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function PDFViewerScreen() {
  const { documentId, title, type, size } = useLocalSearchParams<{
    documentId: string;
    title: string;
    type: string;
    size: string;
  }>();

  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    setShowOptionsModal(false);
    try {
      await Share.share({
        message: `Sharing document: ${title}`,
        title: title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share document');
    }
  };

  const handleDownload = () => {
    setShowOptionsModal(false);
    Alert.alert('Download', 'Download functionality would be implemented here');
  };

  const handleDelete = () => {
    setShowOptionsModal(false);
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Document deleted successfully!');
            router.back();
          },
        },
      ]
    );
  };

  // Dummy PDF content based on document type
  const getPDFContent = () => {
    if (title.toLowerCase().includes('transcript')) {
      return `ACADEMIC TRANSCRIPT

Student Name: John Doe
Student ID: 12345678
Program: Bachelor of Computer Science

SEMESTER 1 (Fall 2020)
- Computer Programming I: A
- Mathematics I: B+
- Physics I: A-
- English Composition: B+
GPA: 3.7

SEMESTER 2 (Spring 2021)
- Computer Programming II: A
- Mathematics II: A-
- Physics II: B+
- Data Structures: A
GPA: 3.8

SEMESTER 3 (Fall 2021)
- Algorithms: A
- Database Systems: A-
- Software Engineering: B+
- Statistics: A-
GPA: 3.75

SEMESTER 4 (Spring 2022)
- Web Development: A
- Computer Networks: A-
- Operating Systems: B+
- Project Management: A
GPA: 3.8

Overall GPA: 3.76
Graduation Date: May 2024
Honors: Magna Cum Laude`;
    } else if (title.toLowerCase().includes('certificate')) {
      return `CERTIFICATE OF COMPLETION

This is to certify that

JOHN DOE

has successfully completed the course

"Advanced Web Development with React"

Duration: 40 hours
Date of Completion: January 15, 2024

Skills Covered:
• React Fundamentals
• State Management with Redux
• API Integration
• Testing with Jest
• Deployment Strategies

Instructor: Jane Smith
Institution: Tech Academy
Certificate ID: WD-2024-001

This certificate is valid and verifiable.`;
    } else if (title.toLowerCase().includes('passport')) {
      return `PASSPORT COPY

UNITED STATES OF AMERICA
PASSPORT

Type: P
Country Code: USA
Passport No: 123456789

Surname: DOE
Given Names: JOHN MICHAEL

Nationality: USA
Date of Birth: 15 JAN 1995
Place of Birth: NEW YORK, NY, USA
Sex: M

Date of Issue: 01 JAN 2020
Date of Expiry: 01 JAN 2030
Authority: U.S. DEPARTMENT OF STATE

This is a certified copy of the original passport.
For official use only.`;
    } else if (title.toLowerCase().includes('license')) {
      return `DRIVER LICENSE

STATE OF CALIFORNIA
DEPARTMENT OF MOTOR VEHICLES

License No: D1234567
Class: C
Expires: 01/15/2028

DOE, JOHN MICHAEL
123 MAIN STREET
ANYTOWN, CA 90210

DOB: 01/15/1995
Sex: M
Hair: BRN
Eyes: BRN
Height: 5'10"
Weight: 170

Restrictions: NONE
Endorsements: NONE

This license is valid for driving passenger vehicles.`;
    } else {
      return `DOCUMENT PREVIEW

Document: ${title}
Type: ${type}
Size: ${size}

This is a sample document preview. In a real application, 
this would display the actual PDF content using a PDF 
viewer library.

Document Contents:
• Page 1: Introduction and Overview
• Page 2: Main Content and Details
• Page 3: Conclusion and Summary
• Page 4: Appendices and References

For full functionality, integrate with a PDF viewing 
library such as react-native-pdf or similar.

Document ID: ${documentId}
Last Modified: ${new Date().toLocaleDateString()}`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity 
          style={styles.optionsButton}
          onPress={() => setShowOptionsModal(true)}
        >
          <MoreVertical size={24} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <View style={styles.documentInfo}>
        <Text style={styles.documentType}>{type}</Text>
        <Text style={styles.documentSize}>{size}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pdfContainer}>
          <View style={styles.pdfHeader}>
            <Eye size={20} color="#8B5CF6" />
            <Text style={styles.pdfHeaderText}>Document Preview</Text>
          </View>
          
          <View style={styles.pdfContent}>
            <Text style={styles.pdfText}>{getPDFContent()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionsModal}>
            <Text style={styles.modalTitle}>Document Options</Text>
            <Text style={styles.modalSubtitle}>{title}</Text>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleShare}>
              <ShareIcon size={20} color="#10B981" />
              <Text style={styles.optionText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleDownload}>
              <Download size={20} color="#3B82F6" />
              <Text style={styles.optionText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleDelete}>
              <Trash2 size={20} color="#EF4444" />
              <Text style={[styles.optionText, { color: '#EF4444' }]}>Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  optionsButton: {
    padding: 8,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  documentType: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginRight: 16,
  },
  documentSize: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  pdfContainer: {
    margin: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  pdfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pdfHeaderText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  pdfContent: {
    padding: 24,
    minHeight: 400,
  },
  pdfText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 22,
    textAlign: 'left',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  optionsModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginLeft: 12,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});