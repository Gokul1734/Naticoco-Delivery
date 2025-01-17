import { View, StyleSheet, Dimensions } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LoadingScreen() {
  return (
    <LinearGradient
      colors={['#fff', '#fff5e6']}
      style={styles.container}
    >
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 500 }}
      >
        <ActivityIndicator size="large" color="#F8931F" />
        <Text style={styles.text}>Loading...</Text>
      </MotiView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'golos',
  },
}); 