import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  ArrowLeft,
  GraduationCap,
  Award,
  Shield,
  Archive,
  File,
  Search,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: 'academic' | 'certificates' | 'govt-proof' | 'others';
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

  // Sample documents data
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
      name: 'Course Completion Certificate.pdf',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '2024-01-13',
      category: 'certificates',
    },
    {
      id: '4',
      name: 'Professional Certification.pdf',
      type: 'PDF',
      size: '2.1 MB',
      uploadDate: '2024-01-12',
      category: 'certificates',
    },
    {
      id: '5',
      name: 'Passport Copy.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-01-11',
      category: 'govt-proof',
    },
    {
      id: '6',
      name: 'Driver License.pdf',
      type: 'PDF',
      size: '1.5 MB',
      uploadDate: '2024-01-10',
      category: 'govt-proof',
    },
    {
      id: '7',
      name: 'Insurance Document.pdf',
      type: 'PDF',
      size: '2.8 MB',
      uploadDate: '2024-01-09',
      category: 'others',
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
      id: 'others',
      name: 'Others',
      icon: <Archive size={32} color="#10B981" />,
      color: '#10B981',
      backgroundColor: '#ECFDF5',
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
        {item.count} {item.count === 1 ? 'document' : 'documents'}
      </Text>
    </TouchableOpacity>
  );

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
    </View>
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
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
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
              <Text style={styles.emptyStateTitle}>No documents found</Text>
              <Text style={styles.emptyStateText}>
                You haven't uploaded any documents in this category yet.
              </Text>
            </View>
          )}
        </ScrollView>
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
            Organize your documents by type for easy access
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
              <Text style={styles.statLabel}>Total Documents</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {(documents.reduce((acc, doc) => acc + parseFloat(doc.size), 0)).toFixed(1)} MB
              </Text>
              <Text style={styles.statLabel}>Storage Used</Text>
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
});