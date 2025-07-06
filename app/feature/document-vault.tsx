import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { ArrowLeft, Search, Upload, MoveVertical as MoreVertical, Eye, Trash2, Share, FolderOpen, FileText, Plus, File, GraduationCap, Award, Shield, Archive } from 'lucide-react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: 'academic' | 'certificates' | 'govt-proof' | 'others';
  uri?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdDate: string;
}

export default function DocumentVaultScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  // Sample data - in real app, this would come from storage
  const [documents, setDocuments] = useState<Document[]>([
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
      name: 'Certificate of Achievement.pdf',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      category: 'certificates',
    },
    {
      id: '3',
      name: 'Passport Copy.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-01-13',
      category: 'govt-proof',
    },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Study Notes',
      content: 'Important points for upcoming exam...',
      createdDate: '2024-01-15',
    },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          size: `${(file.size! / 1024 / 1024).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          category: 'others',
          uri: file.uri,
        };

        setDocuments(prev => [newDocument, ...prev]);
        Alert.alert('Success', 'Document uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const handleDocumentOptions = (document: Document) => {
    setSelectedDocument(document);
    setShowOptionsModal(true);
  };

  const handleViewDocument = () => {
    setShowOptionsModal(false);
    setShowPDFViewer(true);
  };

  const handleDeleteDocument = () => {
    if (selectedDocument) {
      Alert.alert(
        'Delete Document',
        `Are you sure you want to delete "${selectedDocument.name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setDocuments(prev => prev.filter(doc => doc.id !== selectedDocument.id));
              setShowOptionsModal(false);
              setSelectedDocument(null);
              Alert.alert('Success', 'Document deleted successfully!');
            },
          },
        ]
      );
    }
  };

  const handleShareDocument = () => {
    setShowOptionsModal(false);
    Alert.alert('Share', 'Share functionality would be implemented here');
  };

  const handleStoredFiles = () => {
    router.push('/feature/document-categories');
  };

  const handleCreateNote = () => {
    setShowCreateNote(true);
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      Alert.alert('Error', 'Please enter both title and content');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setNotes(prev => [newNote, ...prev]);
    setNoteTitle('');
    setNoteContent('');
    setShowCreateNote(false);
    Alert.alert('Success', 'Note created successfully!');
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentActivity = [...documents, ...notes.map(note => ({
    ...note,
    id: `note-${note.id}`, // Prefix note IDs to ensure uniqueness
    name: note.title,
    type: 'NOTE',
    size: `${note.content.length} chars`,
    uploadDate: note.createdDate,
    category: 'others' as const,
  }))].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()).slice(0, 5);

  const renderDocumentItem = ({ item }: { item: Document }) => (
    <View style={styles.documentItem}>
      <View style={styles.documentIcon}>
        <File size={24} color="#8B5CF6" />
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentName}>{item.name}</Text>
        <Text style={styles.documentDetails}>
          {item.type} • {item.size} • {new Date(item.uploadDate).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => handleDocumentOptions(item)}
      >
        <MoreVertical size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Vault</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search documents..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Upload Document Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadDocument}>
          <Upload size={24} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>Upload Document</Text>
        </TouchableOpacity>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.sectionSubtitle}>Your recently added documents and notes</Text>
          
          <FlatList
            data={recentActivity}
            renderItem={renderDocumentItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleStoredFiles}>
            <View style={styles.actionButtonContent}>
              <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}>
                <FolderOpen size={32} color="#8B5CF6" />
              </View>
              <Text style={styles.actionButtonTitle}>Stored Files</Text>
              <Text style={styles.actionButtonSubtitle}>Browse by categories</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCreateNote}>
            <View style={styles.actionButtonContent}>
              <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
                <FileText size={32} color="#10B981" />
              </View>
              <Text style={styles.actionButtonTitle}>Create New Note</Text>
              <Text style={styles.actionButtonSubtitle}>Write and save notes</Text>
            </View>
          </TouchableOpacity>
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
            <Text style={styles.modalSubtitle}>{selectedDocument?.name}</Text>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleViewDocument}>
              <Eye size={20} color="#3B82F6" />
              <Text style={styles.optionText}>View</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem} onPress={handleShareDocument}>
              <Share size={20} color="#10B981" />
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

      {/* PDF Viewer Modal */}
      <Modal
        visible={showPDFViewer}
        animationType="slide"
        onRequestClose={() => setShowPDFViewer(false)}
      >
        <View style={styles.pdfViewerContainer}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPDFViewer(false)}
            >
              <ArrowLeft size={24} color="#4F46E5" />
            </TouchableOpacity>
            <Text style={styles.pdfTitle}>{selectedDocument?.name}</Text>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.pdfContent}>
            <Text style={styles.pdfPlaceholder}>
              PDF Viewer would be implemented here{'\n'}
              Document: {selectedDocument?.name}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Create Note Modal */}
      <Modal
        visible={showCreateNote}
        animationType="slide"
        onRequestClose={() => setShowCreateNote(false)}
      >
        <View style={styles.createNoteContainer}>
          <View style={styles.createNoteHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCreateNote(false)}
            >
              <ArrowLeft size={24} color="#4F46E5" />
            </TouchableOpacity>
            <Text style={styles.createNoteTitle}>Create New Note</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.createNoteContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Enter note title..."
                placeholderTextColor="#9CA3AF"
                value={noteTitle}
                onChangeText={setNoteTitle}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Content</Text>
              <TextInput
                style={styles.contentInput}
                placeholder="Write your note here..."
                placeholderTextColor="#9CA3AF"
                value={noteContent}
                onChangeText={setNoteContent}
                multiline={true}
                numberOfLines={15}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
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
  searchContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  section: {
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
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  optionsButton: {
    padding: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    width: '48%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
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
  actionButtonContent: {
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionButtonSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
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
  pdfViewerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pdfHeader: {
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
  closeButton: {
    padding: 8,
  },
  pdfTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  pdfContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  pdfPlaceholder: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  createNoteContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  createNoteHeader: {
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
  createNoteTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  createNoteContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  contentInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 300,
    textAlignVertical: 'top',
  },
});