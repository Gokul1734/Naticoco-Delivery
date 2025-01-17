import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BackButton({ color = '#333', style }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={[styles.backButton, style]}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={24} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    marginLeft: 8,
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
    backgroundColor: '#F8931F',
    borderRadius: 100,
  },
}); 