import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, Card, Switch } from 'react-native-paper';
import { MotiView } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import DScreenBackground from './Components/DScreenBackground';
import DeliveryLoadingScreen from './Components/DeliveryLoadingScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DeliveryCard = ({ orderId, amount, status, onPress }) => (
  <MotiView
    from={{ opacity: 0, translateY: 50 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'timing', duration: 1000 }}
  >
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.deliveryCard}>
        <Card.Content>
          <Image 
            source={require('../../assets/images/package.png')} 
            style={styles.packageIcon}
          />
          <Text style={styles.deliveryTitle}>Order #{orderId}</Text>
          <Text style={styles.deliveryPrice}>Rs {amount}/-</Text>
          <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
            {status}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  </MotiView>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return '#FFA500';
    case 'PREPARING': return '#4169E1';
    case 'READY': return '#32CD32';
    case 'COMPLETED': return '#008000';
    case 'REJECTED': return '#FF0000';
    default: return '#000000';
  }
};

export default function DeliveryHome() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails?._id) {
      fetchOrders();
    }
  }, [userDetails]);

  const loadUserDetails = async () => {
    try {
      const details = await AsyncStorage.getItem('riderDetails');
      if (details) {
        const parsedDetails = JSON.parse(details);
        setUserDetails(parsedDetails);
        setIsAvailable(parsedDetails.availability);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user details:', error);
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://192.168.29.242:3500/Adminstore/delivery/orders/${userDetails._id}`);
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newAvailability = !isAvailable;
      const response = await axios.patch(`http://192.168.29.242:3500/Adminstore/delivery/availability/${userDetails._id}`, {
        availability: newAvailability
      });
      
      if (response.status === 200) {
        setIsAvailable(newAvailability);
        const updatedDetails = { ...userDetails, availability: newAvailability };
        await AsyncStorage.setItem('riderDetails', JSON.stringify(updatedDetails));
        setUserDetails(updatedDetails);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  if (isLoading) {
    return <DeliveryLoadingScreen />;
  }

  const handleOrderPress = (orderId) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  return (
    <DScreenBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hi {userDetails?.name || 'Rider'}.</Text>
            <TouchableOpacity style={styles.notificationButton}>
              <Image 
                source={require('../../assets/images/notification.gif')}
                style={styles.notificationGif}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.availabilityContainer}>
              <Text style={styles.availabilityText}>
                {isAvailable ? 'Available' : 'Unavailable'}
              </Text>
              <Switch
                value={isAvailable}
                onValueChange={toggleAvailability}
                color="#F8931F"
              />
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Image 
                source={require('../../assets/images/profile.gif')}
                style={styles.profileGif}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Orders Section */}
        <View style={styles.deliveryDetailsSection}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.cardsContainer}
          >
            {orders
              .filter(order => ['PENDING', 'PREPARING', 'READY'].includes(order.status))
              .map(order => (
                <DeliveryCard
                  key={order._id}
                  orderId={order.orderId}
                  amount={order.amount}
                  status={order.status}
                  onPress={() => handleOrderPress(order._id)}
                />
              ))
            }
          </ScrollView>
        </View>

        {/* Completed Orders Section */}
        <View style={styles.deliveryDetailsSection}>
          <Text style={styles.sectionTitle}>Completed Orders</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.cardsContainer}
          >
            {orders
              .filter(order => order.status === 'COMPLETED')
              .map(order => (
                <DeliveryCard
                  key={order._id}
                  orderId={order.orderId}
                  amount={order.amount}
                  status={order.status}
                  onPress={() => handleOrderPress(order._id)}
                />
              ))
            }
          </ScrollView>
        </View>

        {/* Updates Section */}
        <View style={styles.updatesSection}>
          <Text style={styles.sectionTitle}>Latest Updates</Text>
          <Card style={styles.updatesCard}>
            <Image 
              source={require('../../assets/images/updates.png')}
              style={styles.updatesImage}
              resizeMode="cover"
            />
          </Card>
        </View>
      </ScrollView>
    </DScreenBackground>
  );
}
const styles = StyleSheet.create({
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
    textTransform: 'uppercase'
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8931F',
    marginTop: 5
  },
  orderCard: {
    width: 160,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 3
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8931F',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  availabilityText: {
    marginRight: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  todaySection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  deliveryImage: {
    borderRadius: 15,
  },
  deliveryDetailsSection: {
    marginBottom: 30,
  },
  cardsContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  deliveryCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: '#333',
  },
  packageIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
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
  updatesSection: {
    marginBottom: 30,
  },
  updatesCard: {
    borderRadius: 17,
    padding: 0,
  },
  updatesImage: {
    margin: 0,
    width: '100%',
    height: 150,
    borderRadius: 15,
  },
  notificationButton: {
    width: 40,
    height: 40,
    padding: 1,
    paddingRight: 4,
    paddingBottom: 7,
    borderRadius: 35,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationGif: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileGif: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});