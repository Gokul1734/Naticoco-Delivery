import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Linking, Platform } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { decode } from '@mapbox/polyline';
import { MotiView } from 'moti';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your API key

export default function ActiveDeliveries() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [deliveryRoute, setDeliveryRoute] = useState(null);
  const [activeDelivery, setActiveDelivery] = useState({
    id: 'DEL123',
    status: 'PICKING_UP', // PICKING_UP, PICKED_UP, DELIVERING
    store: {
      name: 'Crispy Chicken Store',
      location: {
        latitude: 17.4485835,
        longitude: 78.3908034,
      },
    },
    customer: {
      name: 'Alice Smith',
      address: '123 Main St, City',
      location: {
        latitude: 17.4555835,
        longitude: 78.3928034,
      },
    },
    items: [
      { name: 'Crispy Chicken', quantity: 2 },
      { name: 'Garden Salad', quantity: 1 }
    ],
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchRoute();
    }
  }, [currentLocation, activeDelivery.status]);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchRoute = async () => {
    if (!currentLocation) return;

    const destination = activeDelivery.status === 'PICKING_UP' 
      ? activeDelivery.store.location 
      : activeDelivery.customer.location;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${
          currentLocation.latitude
        },${currentLocation.longitude}&destination=${
          destination.latitude
        },${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();
      if (data.routes.length) {
        const points = decode(data.routes[0].overview_polyline.points);
        const coordinates = points.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setDeliveryRoute(coordinates);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const openGoogleMapsNavigation = () => {
    const destination = activeDelivery.status === 'PICKING_UP'
      ? activeDelivery.store.location
      : activeDelivery.customer.location;

    const url = Platform.select({
      ios: `comgooglemaps://?daddr=${destination.latitude},${destination.longitude}&directionsmode=driving`,
      android: `google.navigation:q=${destination.latitude},${destination.longitude}&mode=d`,
    });

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
        Linking.openURL(browserUrl);
      }
    });
  };

  const handleStatusUpdate = () => {
    setActiveDelivery(prev => ({
      ...prev,
      status: prev.status === 'PICKING_UP' ? 'PICKED_UP' : 'DELIVERED'
    }));
  };

  const getMapRegion = () => {
    if (!currentLocation) return null;

    const destination = activeDelivery.status === 'PICKING_UP'
      ? activeDelivery.store.location
      : activeDelivery.customer.location;

    const latitudeDelta = Math.abs(currentLocation.latitude - destination.latitude) * 2;
    const longitudeDelta = Math.abs(currentLocation.longitude - destination.longitude) * 2;

    return {
      latitude: (currentLocation.latitude + destination.latitude) / 2,
      longitude: (currentLocation.longitude + destination.longitude) / 2,
      latitudeDelta: Math.max(latitudeDelta, 0.02),
      longitudeDelta: Math.max(longitudeDelta, 0.02),
    };
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={getMapRegion()}
          showsUserLocation
          followsUserLocation
        >
          {/* Current Location Marker */}
          <Marker
            coordinate={currentLocation}
            title="You are here"
            pinColor="blue"
          />

          {/* Store Location Marker */}
          <Marker
            coordinate={activeDelivery.store.location}
            title={activeDelivery.store.name}
            pinColor="red"
          />

          {/* Customer Location Marker */}
          <Marker
            coordinate={activeDelivery.customer.location}
            title={activeDelivery.customer.name}
            pinColor="green"
          />

          {/* Route Polyline */}
          {deliveryRoute && (
            <Polyline
              coordinates={deliveryRoute}
              strokeWidth={3}
              strokeColor="#0f1c57"
            />
          )}
        </MapView>
      )}

      <MotiView
        from={{ translateY: 200 }}
        animate={{ translateY: 0 }}
        transition={{ type: 'spring' }}
        style={styles.deliveryCard}
      >
        <Card>
          <Card.Content>
            <Text style={styles.orderId}>Order #{activeDelivery.id}</Text>
            <Text style={styles.status}>
              Status: {activeDelivery.status.replace('_', ' ')}
            </Text>
            
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                {activeDelivery.status === 'PICKING_UP' 
                  ? `Pickup: ${activeDelivery.store.name}`
                  : `Deliver to: ${activeDelivery.customer.name}`}
              </Text>
              <Text style={styles.address}>
                {activeDelivery.status === 'PICKING_UP'
                  ? 'Store Location'
                  : activeDelivery.customer.address}
              </Text>
            </View>

            <View style={styles.itemsContainer}>
              {activeDelivery.items.map((item, index) => (
                <Text key={index} style={styles.itemText}>
                  {item.quantity}x {item.name}
                </Text>
              ))}
            </View>

            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={openGoogleMapsNavigation}
                style={[styles.button, styles.navigationButton]}
              >
                Start Navigation
              </Button>
              <Button
                mode="contained"
                onPress={handleStatusUpdate}
                style={[styles.button, styles.statusButton]}
              >
                {activeDelivery.status === 'PICKING_UP' ? 'Confirm Pickup' : 'Complete Delivery'}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </MotiView>
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
  deliveryCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 20,
    borderRadius: 15,
  },
  orderId: {
    fontSize: 16,
    color: '#666',
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f1c57',
    marginVertical: 10,
  },
  locationInfo: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    color: '#666',
    marginTop: 5,
  },
  itemsContainer: {
    marginVertical: 10,
  },
  itemText: {
    fontSize: 14,
    marginVertical: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  button: {
    flex: 1,
  },
  navigationButton: {
    backgroundColor: '#0f1c57',
  },
  statusButton: {
    backgroundColor: '#F8931F',
  },
}); 