import { ImageBackground, StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import LoadingScreen from './LoadingScreen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const backgroundImage = require('../../../assets/images/backdrop.jpg');

export default function ScreenBackground({ children, style }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBackgroundImage = async () => {
      try {
        await Asset.loadAsync([backgroundImage]);
        if (isMounted) {
          setIsImageLoaded(true);
        }
      } catch (error) {
        console.error('Error loading background image:', error);
        if (isMounted) {
          setIsImageLoaded(true);
        }
      }
    };

    loadBackgroundImage();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isImageLoaded) {
    return <LoadingScreen />;
  }

  return (
    <View style={[styles.container, style]}>
      <ImageBackground 
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover"
        imageStyle={{ opacity: 1 }}
      >
        <LinearGradient
          colors={['#e0e0e0', '#c5c5c5']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.contentContainer}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
}); 