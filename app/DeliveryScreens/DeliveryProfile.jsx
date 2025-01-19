import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import DScreenBackground from './Components/DScreenBackground';
import DateTimePicker from '@react-native-community/datetimepicker';
import DeliveryLoadingScreen from './Components/DeliveryLoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VehicleOption = ({ icon, label, selected, onSelect }) => (
  <TouchableOpacity 
    style={[styles.vehicleOption, selected && styles.selectedVehicle]}
    onPress={onSelect}
  >
    <Ionicons 
      name={icon} 
      size={24} 
      color={selected ? '#F8931F' : '#666'} 
    />
    <Text style={[styles.vehicleLabel, selected && styles.selectedVehicleLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const InputField = ({ label, value, onChangeText, placeholder, keyboardType = 'default', editable = true }) => (
  <MotiView
    from={{ opacity: 0, translateX: -20 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ type: 'timing', duration: 800 }}
    style={styles.inputContainer}
  >
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, !editable && styles.disabledInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
      editable={editable}
    />
  </MotiView>
);

export default function DeliveryProfile() {
  const [profileData, setProfileData] = useState({
    name: '',
    dateOfBirth: new Date(),
    vehicleType: 'bike',
    vehicleNumber: '',
    aadhaarNumber: '',
    panCardNumber: '', // New state for PAN card number
    drivingLicenseNumber: '', // New state for driving license
    rcDocument: '', // State for RC document file path
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name,setname] = useState('');
  

 useEffect(() => {
  const fetchRiderDetails = async () => {
    try {
      const riderdetails = await AsyncStorage.getItem('riderdetail');
      if (riderdetails) {
        const parsedDetails = JSON.parse(riderdetails);
        setProfileData((prev) => ({
          ...prev,
          name: parsedDetails.name || '', // Fallback to an empty string if name is missing
        }));
      }
    } catch (error) {
      console.error('Error fetching rider details:', error);
    }
  };

  fetchRiderDetails();
}, []);



  useEffect(() => {
    // Simulate loading time or fetch profile data
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <DeliveryLoadingScreen />;
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setProfileData(prev => ({ ...prev, dateOfBirth: selectedDate }));
    }
  };


  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <DScreenBackground>
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000 }}
          style={styles.header}
        >
          <View>
            <Text style={styles.timeText}>18:30 PM</Text>
            <Text style={styles.dayText}>sunday</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Ionicons 
                name={isEditing ? "checkmark-circle" : "create-outline"} 
                size={24} 
                color="#F8931F" 
              />
            </TouchableOpacity>
          </View>
        </MotiView>

        <InputField
          label="Name"
          value={profileData.name}
          onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
          placeholder="Enter your name"
          editable={isEditing}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Date of Birth</Text>
          <TouchableOpacity 
            onPress={() => isEditing && setShowDatePicker(true)}
            style={[styles.input, !isEditing && styles.disabledInput]}
          >
            <Text style={styles.dateText}>
              {formatDate(profileData.dateOfBirth)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Choose Your Vehicle</Text>
          <View style={styles.vehicleOptions}>
            <VehicleOption
              icon="bicycle"
              label="Bike"
              selected={profileData.vehicleType === 'bike'}
              onSelect={() => isEditing && setProfileData(prev => ({ ...prev, vehicleType: 'bike' }))}
            />
            <VehicleOption
              icon="car"
              label="Auto"
              selected={profileData.vehicleType === 'auto'}
              onSelect={() => isEditing && setProfileData(prev => ({ ...prev, vehicleType: 'auto' }))}
            />
            <VehicleOption
              icon="bus"
              label="Other"
              selected={profileData.vehicleType === 'other'}
              onSelect={() => isEditing && setProfileData(prev => ({ ...prev, vehicleType: 'other' }))}
            />
          </View>
        </View>

        <InputField
          label="Vehicle Number"
          value={profileData.vehicleNumber}
          onChangeText={(text) => setProfileData(prev => ({ ...prev, vehicleNumber: text }))}
          placeholder="Enter vehicle number"
          editable={isEditing}
        />

        <InputField
          label="Aadhaar Number"
          value={profileData.aadhaarNumber}
          onChangeText={(text) => setProfileData(prev => ({ ...prev, aadhaarNumber: text }))}
          placeholder="Enter Aadhaar number"
          keyboardType="numeric"
          editable={isEditing}
        />

        {showDatePicker && (
          <DateTimePicker
            value={profileData.dateOfBirth}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
    </DScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dayText: {
    fontSize: 16,
    color: '#F8931F',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  vehicleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  vehicleOption: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedVehicle: {
    backgroundColor: '#FFF5E6',
    borderColor: '#F8931F',
    borderWidth: 1,
  },
  vehicleLabel: {
    marginTop: 5,
    color: '#666',
    fontSize: 14,
  },
  selectedVehicleLabel: {
    color: '#F8931F',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
}); 