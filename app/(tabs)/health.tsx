import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { User, Brain, Apple, Phone } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HealthScreen() {
  const handleProfile = () => {
    router.push('/profile');
  };

  const handleFeaturePress = (feature: string) => {
    router.push(`/feature/${feature}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }}
            style={styles.logo}
          />
          <Text style={styles.logoText}>ThriveMate</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={handleProfile}
        >
          <User size={24} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Health & Wellness</Text>
          <Text style={styles.sectionSubtitle}>
            Take control of your wellbeing with personalized health tracking and guidance
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleFeaturePress('mental-health')}
          >
            <View style={styles.featureCardContent}>
              <View style={[styles.featureIcon, { backgroundColor: '#EEF2FF' }]}>
                <Brain size={32} color="#8B5CF6" />
              </View>
              <Text style={styles.featureTitle}>Mental Health</Text>
              <Text style={styles.featureSubtitle}>
                Mindfulness exercises, mood tracking, and mental wellness resources
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleFeaturePress('nutrition-tips')}
          >
            <View style={styles.featureCardContent}>
              <View style={[styles.featureIcon, { backgroundColor: '#ECFDF5' }]}>
                <Apple size={32} color="#10B981" />
              </View>
              <Text style={styles.featureTitle}>Nutrition Tips</Text>
              <Text style={styles.featureSubtitle}>
                Personalized meal plans, healthy recipes, and nutrition guidance
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleFeaturePress('emergency-help')}
          >
            <View style={styles.featureCardContent}>
              <View style={[styles.featureIcon, { backgroundColor: '#FEF2F2' }]}>
                <Phone size={32} color="#EF4444" />
              </View>
              <Text style={styles.featureTitle}>Emergency Help Numbers</Text>
              <Text style={styles.featureSubtitle}>
                Quick access to emergency contacts and crisis helplines
              </Text>
            </View>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  profileButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    fontSize: 32,
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
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    marginBottom: 16,
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
  featureCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    flex: 1,
  },
  featureSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    flex: 1,
  },
});