import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Platform,
  PermissionsAndroid,
  Alert
} from 'react-native';
import MapView, { 
  Marker, 
  PROVIDER_GOOGLE, 
} from 'react-native-maps';
import { Text, Button, Card } from 'react-native-paper';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MotiView } from 'moti';
import MapViewDirections from 'react-native-maps-directions';

// Replace with your actual API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyD9YLhonLv3JjCCVjBv06W1el67IXr19bY';

const DeliveryMap = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const mapRef = useRef(null);

  const { 
    orderId, 
    StoreLocation, 
    CustomerLocation, 
    initialRegion 
  } = route.params;

  // const CustomerLocation = [13.054396166290767, 80.256687144931];

  const [currentLocation, setCurrentLocation] = useState([13.054396166290767, 80.256687144931]);
  const [navigationStage, setNavigationStage] = useState('store');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert(
            'Location Permission',
            'Location permission is required for navigation',
            [{ text: 'OK' }]
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // For iOS, you'd use a different permission request method
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => {
        console.log('Location error:', error);
        Alert.alert(
          'Location Error',
          'Unable to retrieve current location',
          [{ text: 'OK' }]
        );
      },
      { 
        enableHighAccuracy: true, 
        timeout: 20000, 
        maximumAge: 1000 
      }
    );
  };

  const handleNavigationStage = async () => {
    try {
      if (navigationStage === 'store') {
        await axios.patch(
          `http://192.168.29.165:3500/Adminstore/delivery/updateStatus/${orderId}`,
          { status: 'PICKED_UP' }
        );
        setNavigationStage('customer');
      } else if (navigationStage === 'customer') {
        await axios.patch(
          `http://192.168.29.165:3500/Adminstore/delivery/updateStatus/${orderId}`,
          { status: 'COMPLETED' }
        );
        navigation.navigate('DeliveryHome');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert(
        'Error',
        'Failed to update order status',
        [{ text: 'OK' }]
      );
    }
  };

  const checkProximityToStore = () => {
   if (!currentLocation || !orderDetails) return;
   
   const storeLatLng = {
     latitude: orderDetails.storeLocation.latitude,
     longitude: orderDetails.storeLocation.longitude,
   };
   
   const distance = getDistance(currentLocation, storeLatLng);
   if (distance < 0.1) { // Within 100 meters
     setShowOtpModal(true);
   } else {
     Alert.alert('Not at store', 'Please reach the store location to verify OTP');
   }
 };

  const renderNavigationInfo = () => {
    const stageDetails = {
      store: {
        title: 'Navigate to Store',
        description: 'Pick up the order from the store location',
        buttonText: 'Pick Up Order'
      },
      customer: {
        title: 'Navigate to Customer',
        description: 'Deliver the order to the customer location',
        buttonText: 'Complete Delivery'
      }
    };

    const currentStage = stageDetails[navigationStage];

    return (
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={styles.navigationInfoContainer}
      >
        <Card style={styles.navigationCard}>
          <View style={styles.navigationCardContent}>
            <MaterialIcons 
              name={navigationStage === 'store' ? 'store' : 'home'} 
              size={40} 
              color="#F8931F" 
            />
            <View style={styles.navigationTextContainer}>
              <Text style={styles.navigationTitle}>{currentStage.title}</Text>
              <Text style={styles.navigationDescription}>
                {currentStage.description}
              </Text>
            </View>
            <Button 
              mode="contained" 
              style={styles.navigationButton}
              onPress={handleNavigationStage}
            >
              {currentStage.buttonText}
            </Button>
          </View>
        </Card>
      </MotiView>
    );
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          ref={mapRef}
          style={[styles.map,StyleSheet.absoluteFill]}
          initialRegion={initialRegion}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
        >
          {/* Store Marker */}
          <Marker
            coordinate={{latitude : 13.049479760561033,longitude :  80.25313145517626}}
            title="Store Location"
            pinColor="green"
          />

          {/* Customer Marker */}
          <Marker
            coordinate={{latitude : 13.054396166290767,longitude : 80.256687144931}}
            title="Delivery Location"
            pinColor="red"
          />

          <MapViewDirections             // Delivery person going to Store
             origin={initialRegion}
             destination={{latitude : 13.049479760561033,longitude :  80.25313145517626}}
             apikey={GOOGLE_MAPS_API_KEY}
             strokeWidth={6}
             strokeColor="#000"
             optimizeWaypoints={true}
           />
           <MapViewDirections           // Delivery person going to Delivery Location from store
              origin={{latitude : 13.049479760561033,longitude :  80.25313145517626}}
              destination={{latitude : 13.054396166290767,longitude : 80.256687144931}}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={6}
              strokeColor="green"
              optimizeWaypoints={true}
           />
        </MapView>
      )}

      {/* Navigation Info Overlay */}
      {renderNavigationInfo()}

      {/* Top Navigation */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
 backButton: {
   position: 'absolute',
   top: Platform.OS === 'ios' ? 50 : 20,
   left: 20,
   backgroundColor: 'white',
   borderRadius: 30,
   padding: 10,
   elevation: 5,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 3,
 },
 navigationInfoContainer: {
   position: 'absolute',
   bottom: 20,
   left: 20,
   right: 20,
 },
 navigationCard: {
   borderRadius: 15,
   backgroundColor: 'white',
   padding: 15,
   elevation: 5,
 },
 navigationCardContent: {
   flexDirection: 'row',
   alignItems: 'center',
   gap: 15,
 },
 navigationTextContainer: {
   flex: 1,
 },
 navigationTitle: {
   fontSize: 18,
   fontWeight: 'bold',
   color: '#333',
 },
 navigationDescription: {
   fontSize: 14,
   color: '#666',
   marginTop: 5,
 },
 navigationStats: {
   fontSize: 12,
   color: '#F8931F',
   marginTop: 5,
 },
 navigationButton: {
   backgroundColor: '#F8931F',
 },
});

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

export default DeliveryMap;

