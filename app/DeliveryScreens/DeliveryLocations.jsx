import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import DScreenBackground from './Components/DScreenBackground';
import DeliveryLoadingScreen from './Components/DeliveryLoadingScreen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MapControls = ({ onZoomIn, onZoomOut, onMute, onLocate }) => (
  <MotiView
    from={{ opacity: 0, translateX: 50 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ type: 'timing', duration: 1000 }}
    style={styles.mapControls}
  >
    <TouchableOpacity style={styles.controlButton} onPress={onZoomIn}>
      <Ionicons name="add" size={24} color="#333" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.controlButton} onPress={onMute}>
      <Ionicons name="volume-mute" size={24} color="#333" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.controlButton} onPress={onLocate}>
      <Ionicons name="navigate" size={24} color="#333" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.controlButton} onPress={onZoomOut}>
      <Ionicons name="remove" size={24} color="#333" />
    </TouchableOpacity>
  </MotiView>
);

export default function DeliveryLocations() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, []);

  if (isLoading) {
    return <DeliveryLoadingScreen />;
  }

  const handleZoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  const handleZoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };

  const handleLocate = () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <DScreenBackground>
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000 }}
          style={styles.header}
        >
          <View>
            <Text style={styles.timeText}>18:30 PM</Text>
            <Text style={styles.dayText}>sunday</Text>
          </View>
          <Text style={styles.headerTitle}>Delivery Location</Text>
        </MotiView>

        <View style={styles.mapContainer}>
          <MapView
            style={[StyleSheet.absoluteFill, styles.map]}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass={false}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
              />
            )}
          </MapView>

          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onMute={() => {}}
            onLocate={handleLocate}
          />

          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 1000 }}
            style={styles.speedContainer}
          >
            <View style={styles.speedBox}>
              <Text style={styles.speedNumber}>75</Text>
              <Text style={styles.speedUnit}>mph</Text>
            </View>
          </MotiView>
        </View>

        <TouchableOpacity 
          style={styles.fetchButton}
          onPress={() => {}}
        >
          <Text style={styles.fetchButtonText}>Fetch Location</Text>
        </TouchableOpacity>
      </View>
    </DScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
    marginTop: 10,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    borderRadius: 20,
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -100 }],
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  speedContainer: {
    position: 'absolute',
    left: 20,
    bottom: 20,
  },
  speedBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  speedNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  speedUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  fetchButton: {
    backgroundColor: '#F8931F',
    margin: 20,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  fetchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 