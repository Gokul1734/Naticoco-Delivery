import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const DocumentUploaderScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState({
    rcBook: null,
    license: null,
    aadhaar: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Request permissions for media library
  const requestMediaPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant media access to upload documents.');
      return false;
    }
    return true;
  };

  // Pick document (PDF)
  const pickDocument = async (documentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          uri: result.assets[0].uri,
          name: "RCBook.pdf",
          type: 'application/pdf'
        }
      }));

      // Clear any previous errors for this field
      setErrors(prev => ({
        ...prev,
        [documentType]: null
      }));
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  // Pick image for license (allows both PDF and images)
  const pickLicenseDocument = async (documentType) => {
   try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    setDocuments(prev => ({
      ...prev,
      [documentType]: {
        uri: result.assets[0].uri,
        name: "License.pdf",
        type: 'application/pdf'
      }
    }));

    // Clear any previous errors for this field
    setErrors(prev => ({
      ...prev,
      [documentType]: null
    }));
  } catch (err) {
    console.error('Error picking document:', err);
    Alert.alert('Error', 'Failed to pick document. Please try again.');
  }
  };

  // Validate inputs
  const validateInputs = () => {
    const newErrors = {};

    if (!documents.rcBook) {
      newErrors.rcBook = 'RC Book is required';
    }
    if (!documents.license) {
      newErrors.license = 'License is required';
    }
    if (!documents.aadhaar || documents.aadhaar.length !== 12) {
      newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('rcBook', documents.rcBook);
      formData.append('license', documents.license);
      formData.append('aadhaar', documents.aadhaar);

      const response = await axios.post('YOUR_API_ENDPOINT/upload-documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert(
          'Documents Submitted',
          'Your documents have been submitted for verification. Please wait for 24 hours for the verification process to complete.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Document Verification</Text>
      
      {/* RC Book Upload */}
      <View style={styles.documentSection}>
        <Text style={styles.sectionTitle}>RC Book (PDF)</Text>
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={() => pickDocument('rcBook')}
        >
          <Text style={styles.uploadButtonText}>
            {documents.rcBook ? 'Change RC Book' : 'Upload RC Book'}
          </Text>
        </TouchableOpacity>
        {documents.rcBook && (
          <Text style={styles.fileName}>{documents.rcBook.name}</Text>
        )}
        {errors.rcBook && (
          <HelperText type="error">{errors.rcBook}</HelperText>
        )}
      </View>

      {/* License Upload */}
      <View style={styles.documentSection}>
        <Text style={styles.sectionTitle}>License (PDF or Image)</Text>
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={pickLicenseDocument}
        >
          <Text style={styles.uploadButtonText}>
            {documents.license ? 'Change License' : 'Upload License'}
          </Text>
        </TouchableOpacity>
        {documents.license && (
          <Text style={styles.fileName}>{documents.license.name}</Text>
        )}
        {errors.license && (
          <HelperText type="error">{errors.license}</HelperText>
        )}
      </View>

      {/* Aadhaar Number Input */}
      <View style={styles.documentSection}>
        <TextInput
          label="Aadhaar Number"
          value={documents.aadhaar}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            setDocuments(prev => ({ ...prev, aadhaar: numericText }));
            if (errors.aadhaar) {
              setErrors(prev => ({ ...prev, aadhaar: null }));
            }
          }}
          keyboardType="numeric"
          maxLength={12}
          mode="outlined"
          error={!!errors.aadhaar}
        />
        {errors.aadhaar && (
          <HelperText type="error">{errors.aadhaar}</HelperText>
        )}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      >
        Submit Documents
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  documentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: '#666',
    fontSize: 16,
  },
  fileName: {
    marginTop: 8,
    color: '#666',
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
    padding: 8,
  },
});

export default DocumentUploaderScreen;