import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD9YLhonLv3JjCCVjBv06W1el67IXr19bY';
const { width, height } = Dimensions.get('window');

export default function LocationScreen({ route, navigation }) {
  const { orderId, storeLocation, customerLocation, initialRegion } = route.params;
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isRideStarted, setIsRideStarted] = useState(false);
  const [isStoreVerified, setIsStoreVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startLocationTracking();
  }, []);

  const startLocationTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required');
      return;
    }

    // Start watching position
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) => {
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );
  };

  const fitToCoordinates = (coordinates) => {
    if (mapRef.current && coordinates.length >= 2) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const handleStartRide = () => {
    setIsRideStarted(true);
    Alert.alert('Ride Started', 'Head to the store location to pick up the order');
  };

  const verifyStoreOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.29.242:3500/DeliveryPerson/verify-store-otp', {
        orderId,
        otp
      });
      
      if (response.data.success) {
        setIsStoreVerified(true);
        setShowOtpModal(false);
        Alert.alert('Success', 'Store verification successful! Proceed to customer location.');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
      setOtp('');
    }
  };

  const destination = isStoreVerified ? customerLocation : storeLocation;

  const checkProximityToStore = () => {
    if (!currentLocation) return;
    
    const storeLatLng = {
      latitude: storeLocation.latitude,
      longitude: storeLocation.longitude,
    };
    
    const distance = getDistance(currentLocation, storeLatLng);
    if (distance < 0.1) { // Within 100 meters
      setShowOtpModal(true);
    } else {
      Alert.alert('Not at store', 'Please reach the store location to verify OTP');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
          >
            <View style={styles.currentLocationMarker}>
              <FontAwesome5 name="motorcycle" size={24} color="#F8931F" />
            </View>
          </Marker>
        )}

        <Marker
          coordinate={{
            latitude: storeLocation.latitude,
            longitude: storeLocation.longitude,
          }}
          title={storeLocation.name}
          description="Store Location"
        >
          <View style={styles.storeMarker}>
            <FontAwesome5 name="store" size={24} color="#FF4444" />
          </View>
        </Marker>

        {isStoreVerified && customerLocation && (
          <Marker
            coordinate={{
              latitude: customerLocation.latitude,
              longitude: customerLocation.longitude,
            }}
            title={customerLocation.name}
            description="Customer Location"
          >
            <View style={styles.customerMarker}>
              <FontAwesome5 name="user" size={24} color="#00C851" />
            </View>
          </Marker>
        )}

        {currentLocation && destination && isRideStarted && (
          <MapViewDirections
            origin={currentLocation}
            destination={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#F8931F"
            onReady={(result) => {
              setDistance(result.distance);
              setDuration(result.duration);
              fitToCoordinates([
                currentLocation,
                {
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                },
              ]);
            }}
          />
        )}
      </MapView>

      {/* Status Panel */}
      <View style={styles.statusPanel}>
        <Text style={styles.statusText}>
          Status: {!isRideStarted ? 'Ready to Start' : 
                  !isStoreVerified ? 'Heading to Store' : 
                  'Heading to Customer'}
        </Text>
        {distance && duration && (
          <View style={styles.tripInfo}>
            <Text style={styles.infoText}>{distance.toFixed(1)} km</Text>
            <Text style={styles.infoText}>{Math.ceil(duration)} mins</Text>
          </View>
        )}
      </View>

      {/* Bottom Action Panel */}
      <View style={styles.bottomPanel}>
        {!isRideStarted ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleStartRide}
          >
            <FontAwesome5 name="play-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Start Ride</Text>
          </TouchableOpacity>
        ) : !isStoreVerified ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={checkProximityToStore}
          >
            <FontAwesome5 name="check-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Verify Store OTP</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.destinationInfo}>
            <FontAwesome5 name="user" size={24} color="#F8931F" />
            <Text style={styles.destinationText}>
              Delivering to: {customerLocation.name}
            </Text>
          </View>
        )}
      </View>

      {/* OTP Modal */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Store OTP</Text>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter 4-digit OTP"
              keyboardType="numeric"
              maxLength={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowOtpModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.verifyButton]}
                onPress={verifyStoreOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalButtonText}>Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  statusPanel: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tripInfo: {
    flexDirection: 'row',
    gap: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8931F',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentLocationMarker: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
  },
  storeMarker: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
  },
  customerMarker: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: width * 0.8,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  verifyButton: {
    backgroundColor: '#F8931F',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
  },
  destinationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

// Helper function to calculate distance between two coordinates in kilometers
const getDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};