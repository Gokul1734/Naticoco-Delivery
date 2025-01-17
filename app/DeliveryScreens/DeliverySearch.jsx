import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Searchbar, Card } from 'react-native-paper';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import DScreenBackground from './Components/DScreenBackground';
import DeliveryLoadingScreen from './Components/DeliveryLoadingScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const locations = [
  'Hyderabad',
  'Raidrug',
  'Tankbund',
  'Charminar',
  'Ameerpet'
];

const DeliveryOption = ({ title, price, isSpecial = false }) => (
  <MotiView
    from={{ opacity: 0, translateX: -20 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ type: 'timing', duration: 500 }}
  >
    <Card style={[
      styles.deliveryCard,
      isSpecial && styles.specialDeliveryCard
    ]}>
      <Card.Content style={styles.cardContent}>
        <View>
          <Text style={styles.deliveryTitle}>{title}</Text>
          <Text style={styles.deliveryPrice}>Rs {price}/-</Text>
        </View>
        {isSpecial && (
          <View style={styles.packageIconContainer}>
            <Ionicons name="cube" size={40} color="#F8931F" />
            <Ionicons name="cube" size={30} color="#F8931F" style={styles.overlappingIcon} />
          </View>
        )}
      </Card.Content>
    </Card>
  </MotiView>
);

export default function DeliverySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <DeliveryLoadingScreen />;
  }

  return (
    <DScreenBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search nearby location</Text>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={32} color="#333" />
          </TouchableOpacity>
        </View>

        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          icon="magnify"
        />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.locationsContainer}
        >
          {locations.map((location, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.locationChip,
                selectedLocation === location && styles.selectedLocationChip
              ]}
              onPress={() => setSelectedLocation(location)}
            >
              <Text style={[
                styles.locationText,
                selectedLocation === location && styles.selectedLocationText
              ]}>
                {location}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.deliverySection}>
          <Text style={styles.sectionTitle}>Urgent Delivery</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.urgentDeliveryContainer}
          >
            <DeliveryOption title="Delivery" price="149" />
            <DeliveryOption title="Delivery" price="149" />
            <DeliveryOption title="Delivery" price="149" />
          </ScrollView>
        </View>

        <View style={styles.specialDeliverySection}>
          <DeliveryOption title="Special Delivery" price="199" isSpecial={true} />
          <DeliveryOption title="Special Delivery" price="199" isSpecial={true} />
          <DeliveryOption title="Special Delivery" price="199" isSpecial={true} />
        </View>
      </ScrollView>
    </DScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBar: {
    borderRadius: 30,
    elevation: 2,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  searchInput: {
    fontSize: 16,
  },
  locationsContainer: {
    marginBottom: 20,
  },
  locationChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  selectedLocationChip: {
    backgroundColor: '#F8931F',
  },
  locationText: {
    color: '#666',
    fontSize: 14,
  },
  selectedLocationText: {
    color: 'white',
    fontWeight: '500',
  },
  deliverySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  urgentDeliveryContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  deliveryCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: '#333',
    marginBottom: 15,
  },
  specialDeliveryCard: {
    width: '100%',
    backgroundColor: '#333',
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  deliveryPrice: {
    color: '#F8931F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  packageIconContainer: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  overlappingIcon: {
    position: 'absolute',
    right: -10,
    bottom: -5,
  },
}); 