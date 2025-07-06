import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  Share,
} from 'react-native';
import {
  ArrowLeft,
  GraduationCap,
  Award,
  Shield,
  Archive,
  File,
  FileText,
  StickyNote,
  MoveVertical as MoreVertical,
  Eye,
  Share as ShareIcon,
  Trash2,
  Edit3,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: 'academic' | 'certificates' | 'govt-proof' | 'others' | 'notes';
  content?: string; // For notes
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
  count: number;
}

export default function DocumentCategoriesScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Sample documents data with dummy PDFs and notes
  const documents: Document[] = [
    {
      id: '1',
      name: 'Academic Transcript.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      category: 'academic',
    },
    {
      id: '2',
      name: 'Degree Certificate.pdf',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      category: 'academic',
    },
    {
      id: '3',
      name: 'Research Paper.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-01-13',
      category: 'academic',
    },
    {
      id: '4',
      name: 'Course Completion Certificate.pdf',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '2024-01-13',
      category: 'certificates',
    },
    {
      id: '5',
      name: 'Professional Certification.pdf',
      type: 'PDF',
      size: '2.1 MB',
      uploadDate: '2024-01-12',
      category: 'certificates',
    },
    {
      id: '6',
      name: 'AWS Certificate.pdf',
      type: 'PDF',
      size: '1.7 MB',
      uploadDate: '2024-01-11',
      category: 'certificates',
    },
    {
      id: '7',
      name: 'Passport Copy.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-01-11',
      category: 'govt-proof',
    },
    {
      id: '8',
      name: 'Driver License.pdf',
      type: 'PDF',
      size: '1.5 MB',
      uploadDate: '2024-01-10',
      category: 'govt-proof',
    },
    {
      id: '9',
      name: 'Birth Certificate.pdf',
      type: 'PDF',
      size: '2.0 MB',
      uploadDate: '2024-01-09',
      category: 'govt-proof',
    },
    {
      id: '10',
      name: 'Insurance Document.pdf',
      type: 'PDF',
      size: '2.8 MB',
      uploadDate: '2024-01-09',
      category: 'others',
    },
    {
      id: '11',
      name: 'Bank Statement.pdf',
      type: 'PDF',
      size: '1.9 MB',
      uploadDate: '2024-01-08',
      category: 'others',
    },
    // Notes
    {
      id: 'note-1',
      name: 'Study Notes for Exam',
      type: 'NOTE',
      size: '245 chars',
      uploadDate: '2024-01-15',
      category: 'notes',
      content: 'Important points for upcoming exam:\n\n1. Review chapter 5-8\n2. Practice problems from page 120-150\n3. Focus on algorithms and data structures\n4. Prepare for coding questions\n\nRemember to get enough sleep before the exam!',
    },
    {
      id: 'note-2',
      name: 'Meeting Notes - Project Alpha',
      type: 'NOTE',
      size: '312 chars',
      uploadDate: '2024-01-14',
      category: 'notes',
      content: 'Project Alpha Meeting Notes:\n\nAttendees: John, Sarah, Mike\nDate: Jan 14, 2024\n\nKey Points:\n- Deadline moved to Feb 15\n- Need to implement user authentication\n- Database migration scheduled for next week\n- UI/UX review on Friday\n\nAction Items:\n- John: Complete API documentation\n- Sarah: Finalize design mockups\n- Mike: Set up testing environment',
    },
    {
      id: 'note-3',
      name: 'Book Summary - Clean Code',
      type: 'NOTE',
      size: '428 chars',
      uploadDate: '2024-01-13',
      category: 'notes',
      content: 'Clean Code by Robert C. Martin - Key Takeaways:\n\n1. Meaningful Names:\n   - Use intention-revealing names\n   - Avoid disinformation\n   - Make meaningful distinctions\n\n2. Functions:\n   - Small functions\n   - Do one thing\n   - Use descriptive names\n\n3. Comments:\n   - Good code is self-documenting\n   - Explain why, not what\n   - Keep comments up to date\n\n4. Formatting:\n   - Consistent indentation\n   - Logical organization\n   - Team coding standards',
    },
    {
      id: 'note-4',
      name: 'Recipe Ideas',
      type: 'NOTE',
      size: '189 chars',
      uploadDate: '2024-01-12',
      category: 'notes',
      content: 'Healthy Recipe Ideas:\n\n🥗 Quinoa Buddha Bowl\n- Quinoa, roasted vegetables, avocado\n- Tahini dressing\n\n🍲 Lentil Curry\n- Red lentils, coconut milk, spices\n- Serve with brown rice\n\n🥙 Mediterranean Wrap\n- Hummus, cucumber, tomato, feta\n- Whole wheat tortilla',
    },
  ];

  const categories: Category[] = [
    {
      id: 'academic',
      name: 'Academic',
      icon: <GraduationCap size={32} color="#8B5CF6" />,
      color: '#8B5CF6',
      backgroundColor: '#EEF2FF',
      count: documents.filter(doc => doc.category === 'academic').length,
    },
    {
      id: 'certificates',
      name: 'Certificates',
      icon: <Award size={32} color="#F59E0B" />,
      color: '#F59E0B',
      backgroundColor: '#FFFBEB',
      count: documents.filter(doc => doc.category === 'certificates').length,
    },
    {
      id: 'govt-proof',
      name: 'Government Proof',
      icon: <Shield size={32} color="#EF4444" />,
      color: '#EF4444',
      backgroundColor: '#FEF2F2',
      count: documents.filter(doc => doc.category === 'govt-proof').length,
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: <StickyNote size={32} color="#10B981" />,
      color: '#10B981',
      backgroundColor: '#ECFDF5',
      count: documents.filter(doc => doc.category === 'notes').length,
    },
    {
      id: 'others',
      name: 'Others',
      icon: <Archive size={32} color="#6B7280" />,
      color: '#6B7280',
      backgroundColor: '#F3F4F6',
      count: documents.filter(doc => doc.category === 'others').length,
    },
  ];

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      router.back();
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleDocumentPress = (document: Document) => {
    if (document.category === 'notes') {
      // Navigate to note viewer/editor
      router.push({
        pathname: '/feature/note-viewer',
        params: { 
          noteId: document.id,
          title: document.name,
          content: document.content || '',
          date: document.uploadDate
        }
      });
    } else {
      // Navigate to PDF viewer
      router.push({
        pathname: '/feature/pdf-viewer',
        params: { 
          documentId: document.id,
          title: document.name,
          type: document.type,
          size: document.size
        }
      });
    }
  };

  const handleDocumentOptions = (document: Document) => {
    setSelectedDocument(document);
    setShowOptionsModal(true);
  };

  const handleViewDocument = () => {
    setShowOptionsModal(false);
    if (selectedDocument) {
      handleDocumentPress(selectedDocument);
    }
  };

  const handleShareDocument = async () => {
    setShowOptionsModal(false);
    if (selectedDocument) {
      try {
        if (selectedDocument.category === 'notes') {
          await Share.share({
            message: `${selectedDocument.name}\n\n${selectedDocument.content}`,
            title: selectedDocument.name,
          });
        } else {
          await Share.share({
            message: `Sharing document: ${selectedDocument.name}`,
            title: selectedDocument.name,
          });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to share document');
      }
    }
  };

  const handleDeleteDocument = () => {
    if (selectedDocument) {
      Alert.alert(
        'Delete Item',
        `Are you sure you want to delete "${selectedDocument.name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setShowOptionsModal(false);
              setSelectedDocument(null);
              Alert.alert('Success', 'Item deleted successfully!');
            },
          },
        ]
      );
    }
  };

  const handleEditNote = () => {
    setShowOptionsModal(false);
    if (selectedDocument && selectedDocument.category === 'notes') {
      router.push({
        pathname: '/feature/note-viewer',
        params: { 
          noteId: selectedDocument.id,
          title: selectedDocument.name,
          content: selectedDocument.content || '',
          date: selectedDocument.uploadDate
        }
      });
    }
  };

  const filteredDocuments = selectedCategory
    ? documents.filter(doc => doc.category === selectedCategory)
    : [];

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  const renderCategoryCard = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item.id)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.backgroundColor }]}>
        {item.icon}
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>
        {item.count} {item.count === 1 ? 'item' : 'items'}
      </Text>
    </TouchableOpacity>
  );

  const renderDocumentItem = ({ item }: { item: Document }) => (
    <TouchableOpacity 
      style={styles.documentItem}
      onPress={() => handleDocumentPress(item)}
    >
      <View style={styles.documentIcon}>
        {item.category === 'notes' ? (
          <FileText size={24} color="#10B981" />
        ) : (
          <File size={24} color="#8B5CF6" />
        )}
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentName}>{item.name}</Text>
        <Text style={styles.documentDetails}>
          {item.type} • {item.size} • {new Date(item.uploadDate).toLocaleDateString()}
        </Text>
        {item.category === 'notes' && item.content && (
          <Text style={styles.documentPreview} numberOfLines={2}>
            {item.content}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => handleDocumentOptions(item)}
      >
        <MoreVertical size={20} color="#6B7280" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (selectedCategory) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#4F46E5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedCategoryData?.name}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.categoryHeader}>
            <View style={[styles.categoryHeaderIcon, { backgroundColor: selectedCategoryData?.backgroundColor }]}>
              {selectedCategoryData?.icon}
            </View>
            <Text style={styles.categoryHeaderTitle}>{selectedCategoryData?.name}</Text>
            <Text style={styles.categoryHeaderCount}>
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'item' : 'items'}
            </Text>
          </View>

          {filteredDocuments.length > 0 ? (
            <FlatList
              data={filteredDocuments}
              renderItem={renderDocumentItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Archive size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No items found</Text>
              <Text style={styles.emptyStateText}>
                You haven't added any items in this category yet.
              </Text>
            </View>
          )}
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
              <Text style={styles.modalTitle}>Options</Text>
              <Text style={styles.modalSubtitle}>{selectedDocument?.name}</Text>
              
              <TouchableOpacity style={styles.optionItem} onPress={handleViewDocument}>
                <Eye size={20} color="#3B82F6" />
                <Text style={styles.optionText}>
                  {selectedDocument?.category === 'notes' ? 'View Note' : 'View Document'}
                </Text>
              </TouchableOpacity>

              {selectedDocument?.category === 'notes' && (
                <TouchableOpacity style={styles.optionItem} onPress={handleEditNote}>
                  <Edit3 size={20} color="#8B5CF6" />
                  <Text style={styles.optionText}>Edit Note</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.optionItem} onPress={handleShareDocument}>
                <ShareIcon size={20} color="#10B981" />
                <Text style={styles.optionText}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem} onPress={handleDeleteDocument}>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Categories</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <Text style={styles.sectionSubtitle}>
            Organize your documents and notes by type for easy access
          </Text>
        </View>

        <FlatList
          data={categories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.categoryRow}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Storage Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{documents.length}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {documents.filter(doc => doc.category !== 'notes').length}
              </Text>
              <Text style={styles.statLabel}>Documents</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {documents.filter(doc => doc.category === 'notes').length}
              </Text>
              <Text style={styles.statLabel}>Notes</Text>
            </View>
          </View>
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
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
  },
  titleSection: {
    marginBottom: 32,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
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
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryHeader: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryHeaderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryHeaderTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  categoryHeaderCount: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  documentItem: {
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
  documentIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  documentDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  documentPreview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 4,
  },
  optionsButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 32,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
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