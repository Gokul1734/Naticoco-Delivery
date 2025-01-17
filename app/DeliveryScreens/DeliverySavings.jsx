import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, TextInput, Platform } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DScreenBackground from './Components/DScreenBackground';
import DeliveryLoadingScreen from './Components/DeliveryLoadingScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SavingsCard = ({ amount, deliveries }) => (
  <MotiView
    from={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', duration: 1500 }}
  >
    <LinearGradient
      colors={['#F8931F', '#f4a543']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.savingsCard}
    >
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.amountText}>{amount}/-</Text>
          <View style={styles.deliveriesContainer}>
            <Text style={styles.deliveriesLabel}>Total Delivered</Text>
            <Text style={styles.deliveriesCount}>{deliveries}</Text>
          </View>
        </View>
        <View style={styles.coinsContainer}>
          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 1000, delay: 500 }}
          >
            <Ionicons name="cash" size={40} color="#FFD700" />
          </MotiView>
        </View>
      </View>
      <TouchableOpacity style={styles.transferButton}>
        <Text style={styles.transferButtonText}>Transfer</Text>
      </TouchableOpacity>
    </LinearGradient>
  </MotiView>
);

export default function DeliverySavings() {
  const [upiHandle, setUpiHandle] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or fetch savings data
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <DeliveryLoadingScreen />;
  }

  const handleTransfer = () => {
    if (!upiHandle) return;
    setIsTransferring(true);
    // Implement UPI transfer logic here
    setTimeout(() => {
      setIsTransferring(false);
      setUpiHandle('');
    }, 2000);
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
          <Text style={styles.headerTitle}>Your Savings</Text>
        </MotiView>

        <SavingsCard amount="5999" deliveries="99" />

        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000, delay: 300 }}
          style={styles.upiSection}
        >
          <Text style={styles.upiLabel}>Enter UPI handle</Text>
          <TextInput
            style={styles.upiInput}
            placeholder="Enter UPI handle"
            value={upiHandle}
            onChangeText={setUpiHandle}
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={[
              styles.upiTransferButton,
              isTransferring && styles.upiTransferButtonDisabled
            ]}
            onPress={handleTransfer}
            disabled={isTransferring || !upiHandle}
          >
            <Text style={styles.upiTransferButtonText}>
              {isTransferring ? 'Transferring...' : 'Transfer to UPI'}
            </Text>
          </TouchableOpacity>
        </MotiView>
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
  savingsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  deliveriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveriesLabel: {
    color: 'white',
    opacity: 0.9,
    marginRight: 8,
  },
  deliveriesCount: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  coinsContainer: {
    position: 'relative',
  },
  transferButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  transferButtonText: {
    color: '#F8931F',
    fontWeight: '600',
  },
  upiSection: {
    marginTop: 20,
  },
  upiLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '600',
  },
  upiInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  upiTransferButton: {
    backgroundColor: '#F8931F',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  upiTransferButtonDisabled: {
    backgroundColor: '#ccc',
  },
  upiTransferButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 