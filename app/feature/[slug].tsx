import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

const featureMessages: Record<string, { title: string; message: string; color: string }> = {
  'schedule-works': {
    title: 'Schedule Your Works',
    message: 'Schedule Your Works feature coming soon! Plan and organize your study sessions efficiently.',
    color: '#8B5CF6'
  },
  'notes-summary': {
    title: 'Notes Summary',
    message: 'Notes Summary feature coming soon! AI-powered note summarization to help you study better.',
    color: '#3B82F6'
  },
  'doubt-solver': {
    title: 'Doubt Solver',
    message: 'Doubt Solver feature coming soon! Get instant help with your academic questions.',
    color: '#10B981'
  },
  'course-recommendation': {
    title: 'Course Recommendation',
    message: 'Course Recommendation feature coming soon! Discover courses tailored to your interests.',
    color: '#F59E0B'
  },
  'document-vault': {
    title: 'Document Vault',
    message: 'Document Vault feature coming soon! Securely store and organize all your important documents.',
    color: '#8B5CF6'
  },
  'expense-tracker': {
    title: 'Expense Tracker',
    message: 'Expense Tracker feature coming soon! Track your spending and achieve your financial goals.',
    color: '#10B981'
  },
  'mental-health': {
    title: 'Mental Health',
    message: 'Mental Health feature coming soon! Access mindfulness exercises and mental wellness resources.',
    color: '#8B5CF6'
  },
  'nutrition-tips': {
    title: 'Nutrition Tips',
    message: 'Nutrition Tips feature coming soon! Get personalized meal plans and healthy recipes.',
    color: '#10B981'
  },
  'emergency-help': {
    title: 'Emergency Help Numbers',
    message: 'Emergency Help Numbers feature coming soon! Quick access to emergency contacts and crisis helplines.',
    color: '#EF4444'
  },
  'study-abroad': {
    title: 'Study Abroad',
    message: 'Study Abroad feature coming soon! Explore international education opportunities and scholarships.',
    color: '#8B5CF6'
  },
  'language-helper': {
    title: 'Language Helper',
    message: 'Language Helper feature coming soon! Learn new languages with interactive lessons and practice.',
    color: '#10B981'
  }
};

export default function FeatureScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const feature = featureMessages[slug as string];

  const handleBack = () => {
    router.back();
  };

  if (!feature) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#4F46E5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Feature Not Found</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.errorMessage}>Feature not found. Please try again.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{feature.title}</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.messageContainer, { borderLeftColor: feature.color }]}>
          <Text style={[styles.featureTitle, { color: feature.color }]}>
            {feature.title}
          </Text>
          <Text style={styles.featureMessage}>
            {feature.message}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What to Expect</Text>
          <Text style={styles.infoText}>
            This feature is currently under development. We're working hard to bring you the best experience possible. 
            Stay tuned for updates and new features coming to ThriveMate!
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.backToHomeButton, { backgroundColor: feature.color }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.backToHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
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
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    backgroundColor: '#F9FAFB',
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderLeftWidth: 4,
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
  featureTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  featureMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
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
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  backToHomeButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backToHomeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 100,
  },
});