import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DScreenBackground from './Components/DScreenBackground';
import DeliveryLoadingScreen from './Components/DeliveryLoadingScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DeliveryCard = ({ title, price, onPress }) => (
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
          <Text style={styles.deliveryTitle}>{title}</Text>
          <Text style={styles.deliveryPrice}>Rs {price}/-</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  </MotiView>
);

export default function DeliveryHome() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('Syam');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
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
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hi {userName}.</Text>
            <TouchableOpacity style={styles.notificationButton}>
              <Image 
                source={require('../../assets/images/notification.gif')}
                style={styles.notificationGif}
              />
            </TouchableOpacity>
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

        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today's Delivery</Text>
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/images/delivery1.png')}
              style={[{width: SCREEN_WIDTH * 0.43,height: 150,},styles.deliveryImage]}
              resizeMode='contain'
            />
            <Image 
              source={require('../../assets/images/delivery2.png')}
              style={[{height: 111,width:SCREEN_WIDTH * 0.43,marginTop:22},styles.deliveryImage]}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.deliveryDetailsSection}>
          <Text style={styles.sectionTitle}>Get Delivery Details</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.cardsContainer}
          >
            <DeliveryCard title="Delivery" price="149" onPress={() => {}} />
            <DeliveryCard title="Delivery" price="149" onPress={() => {}} />
            <DeliveryCard title="Delivery" price="149" onPress={() => {}} />
          </ScrollView>
        </View>

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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8931F',
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
    // width: SCREEN_WIDTH * 0.43,
    // height: 150,
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
    padding:0,
  },
  updatesImage: {
   margin : 0,
    width: '100%',
    height: 150,
    borderRadius: 15,
  },
  notificationButton: {
    width: 40,
    height: 40,
    padding:1,
    paddingRight:4,
    paddingBottom : 7,
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