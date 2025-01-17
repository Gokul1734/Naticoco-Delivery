import { Platform } from 'react-native';
import { Asset } from 'expo-asset';

// Create a centralized image mapping object
export const productImages = {
  'natiChicken.jpg': require('../../assets/images/logoo.jpg'),
  'ChickenKebab.jpg': require('../../assets/images/ChickenKebab.jpg'),
  'tandoori.jpg': require('../../assets/images/tandoori.jpg'),
  'wob.jpg': require('../../assets/images/wob.jpeg'),
  'thighs.jpg': require('../../assets/images/thighs.jpeg'),
  'ggp.jpg': require('../../assets/images/ggp.jpg'),
  'cp3.jpg': require('../../assets/images/cp3.jpg'),
  'cp2.jpg': require('../../assets/images/cp2.jpg'),
  'cp.jpg': require('../../assets/images/cp.jpg'),
  'salad.jpg': require('../../assets/images/salad.jpg'),
  'heat and eat.jpeg': require('../../assets/images/heat and eat.jpeg'),
  'classic chicken momos.jpg': require('../../assets/images/classic chicken momos.jpg'),
};

// Helper function to get image based on image name
export const getItemImage = (imageName) => {
  return productImages[imageName] || productImages['logoo.jpg']; // Default to logo if image not found
};

// Helper function to preload all images
export const preloadImages = async () => {
  try {
    await Asset.loadAsync(Object.values(productImages));
    // Add minimum loading time for better UX
    await new Promise(resolve => setTimeout(resolve, Platform.OS === 'ios' ? 800 : 500));
  } catch (error) {
    console.error('Error preloading images:', error);
  }
};
