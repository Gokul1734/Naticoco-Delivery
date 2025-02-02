import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { Text, Card, Switch, Button } from 'react-native-paper';
import { MotiView } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import DScreenBackground from './Components/DScreenBackground';
import DeliveryLoadingScreen from './Components/DeliveryLoadingScreen';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DeliveryCard = ({ order, onPress }) => {
  const { orderId, amount, status } = order;
  
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 1000 }}
    >
      <TouchableOpacity onPress={() => onPress()}>
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
            {status === 'READY' && (
              <Button 
                mode="contained" 
                style={styles.startButton}
                onPress={() => onPress(true)}
              >
                Start
              </Button>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </MotiView>
  );
};

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address,setAddress] = useState('');
  const [errorMsg,setErrorMsg] = useState('');
  // const [deliverypersonId,setDeliveryPersonId] = useState('');

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
      // console.log(parsedDetails);
      setUserDetails(parsedDetails);
      // setDeliveryPersonId(parsedDetails.deliverypersonId);
      setIsAvailable(parsedDetails.availability);
    }
    setIsLoading(false);
  } catch (error) {
    console.error('Error loading user details:', error);
    setIsLoading(false);
  }
};

  useEffect(() => {
   const initializeData = async () => {
     try {
       let { status } = await Location.requestForegroundPermissionsAsync();
       if (status !== "granted") {
         setErrorMsg("Permission to access location was denied");
         setAddress("Location access denied");
         return;
       }

       const location = await Location.getCurrentPositionAsync({});
       setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.latitude,
       });
       // Save location to AsyncStorage
       await AsyncStorage.setItem(
         "riderLocation",
         JSON.stringify({
          latitude: 13.051486857261544,
          longitude: 80.24041309607061,
         })
       );

       const del = await AsyncStorage.getItem("riderDetails");
       const deliverypersonId = JSON.parse(del).deliverypersonId;
       // console.log(deliverypersonId);
       

       const res = await axios.post("http://192.168.29.165:3500/Adminstore/delivery/update-location", {
         deliverypersonId : deliverypersonId,
         latitude: location.coords.latitude,
         longitude: location.coords.longitude,

        });
       
       if (res.status != 200) {
        console.log('Error in', deliverypersonId);
       }

       // Get address from coordinates
       const addressResponse = await Location.reverseGeocodeAsync({
         latitude: location.coords.latitude,
         longitude: location.coords.longitude,
       });

       if (addressResponse[0]) {
         const addressObj = addressResponse[0];
         const formattedAddress = addressObj.district || "";
         setAddress(formattedAddress);
       }

     } catch (error) {
       console.error("Error initializing data:", error);
       setErrorMsg("Error getting location");
       setAddress("Location unavailable");
     } finally {
       setIsLoading(false);
     }
   };

   initializeData();

   const intervalId = setInterval(() => {
    initializeData();
    // console.log("Location : ",currentLocation);
  }, 5000);

  // Clean up the interval when the component is unmounted
  return () => clearInterval(intervalId);
 }, []);



  const fetchOrders = async () => {
   // console.log(userDetails._id);

      const response = await axios.get(`http://192.168.29.165:3500/Adminstore/delivery/orders/${userDetails._id}`);
      if (response.data != null) {
        setOrders(response.data);
      }
      // console.log(orders);

  };

  useEffect(() => {
    // Fetch orders immediately on mount
    fetchOrders();

    // Set up interval to fetch orders every 5 seconds
    const intervalId = setInterval(() => {
      fetchOrders();
      // console.log(currentLocation);
    }, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  },);

      // console.log(orders);

  const toggleAvailability = async () => {
    try {
      const newAvailability = !isAvailable;
      const response = await axios.patch(`http://192.168.29.165:3500/Adminstore/delivery/availability/${userDetails._id}`, {
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

  // console.log(currentLocation);

  const handleOrderPress = async (orderId, startDelivery = false) => {
    if (!startDelivery) {
      navigation.navigate('OrderDetails', { orderId });
      return;
    }
    console.log(orderId);
    try {
      const response = await axios.post(
        'http://192.168.29.165:3500/Adminstore/delivery/deliveryocation',
        { orderId : orderId }
      );
      console.log(response.data);
      if (response.data) {
        const { StoreLocation, CustomerLocation } = response.data;
        
        // Navigate to LocationScreen with both locations
        Alert.alert('Do you want to take up this order', 'Confirm to Proceed', [
         {
           text: 'Cancel',
           onPress: () => console.log('Cancel Pressed'),
           style: 'cancel',
         },
         {text: 'Confirm', onPress: () => navigation.navigate('DeliveryMap', {
          orderId,
          StoreLocation,
          CustomerLocation,
          initialRegion: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
        })},
       ]);
      }
    } catch (error) {
      console.error('Error fetching delivery location:', error);
      Alert.alert(
        'Error',
        'Unable to fetch delivery location. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  if (isLoading) {
    return <DeliveryLoadingScreen />;
  }

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

        {/* Active Orders Section */}
        <View style={styles.deliveryDetailsSection}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.cardsContainer}
          >
            {orders
              .filter(order => ['ACCEPTED', 'PREPARING', 'READY'].includes(order.status))
              .map(order => (
                <DeliveryCard
                  key={order._id}
                  order={order}
                  onPress={(startDelivery) => handleOrderPress(order.orderId, startDelivery)}
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
                  order={order}
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
    alignSelf : 'center',
    justifyContent : 'center',
    width : '50%',
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
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
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
    textTransform: 'uppercase',
    color: 'white',
  },
  startButton: {
    marginTop: 10,
    backgroundColor: '#F8931F',
  },
  deliveryDetailsSection: {
    marginBottom: 30,
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