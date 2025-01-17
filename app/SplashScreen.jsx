import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import { MotiView } from 'moti';
import { useEffect } from 'react';
import * as ExpoSplashScreen from 'expo-splash-screen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Prevent auto hide of splash screen
ExpoSplashScreen.preventAutoHideAsync();

export default function CustomSplashScreen({ onFinish }) {
  useEffect(() => {
    const hideSplash = async () => {
      // Wait for 2 seconds
      // await new Promise(resolve => setTimeout(resolve, 5000));
      // Hide the splash screen
      await ExpoSplashScreen.hideAsync();
      // Call onFinish callback
      onFinish();
    };

    hideSplash();
  }, []);

  return (
    <View style={styles.container}>
        <Image
          source={require('../assets/images/SplashScreen.jpg')}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.quote}>“High-Quality <Text style={styles.text2}>Poultry</Text>, Low-Quality <Text style={styles.text2}>Worries</Text>”</Text>
        <Text style={styles.mark}>R</Text>
        <View style={styles.textContainer}>
         <Text style={styles.text}>A Unit of MaktSon Group</Text>
         <Image source={require('../assets/images/prod.png')} style={styles.logo} />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT, 
  },
  text2: {
    fontSize: 16,
    fontWeight: '300',
    fontFamily: 'golos',
    margin: 0,
    bottom: 180,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fd7e14',
    position: 'absolute',
  },
  quote: {
    fontSize: 16,
    fontWeight: '300',
    fontFamily: 'golos',
    margin: 0,
    bottom: 180,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'black',
    position: 'absolute',
  },
  mark: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: 'bold',
    margin: 0,
    bottom: 466,
    left: 345,
    right: 0,
    textAlign: 'center',
    color: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 100,
    padding: 3,
    width: 25,
    height: 25,
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: 10,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  textContainer: {
    bottom: 50,
    left: 0,
    right: 0,
    textAlign: 'center',
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
  },
}); 