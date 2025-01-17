import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { ActivityIndicator, Text } from 'react-native-paper';
import DScreenBackground from './DScreenBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DeliveryLoadingScreen() {
  return (
    <DScreenBackground>
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 1000, loop: true }}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#F8931F" />
          <Text style={styles.loadingText}>Loading...</Text>
        </MotiView>
      </View>
    </DScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#F8931F',
    fontWeight: '600',
  },
}); 