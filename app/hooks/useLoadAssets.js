import { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';

export const useLoadAssets = (images) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await Asset.loadAsync(Object.values(images));
        await new Promise(resolve => setTimeout(resolve, 800)); // Minimum loading time
      } catch (error) {
        console.error('Error loading assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  return isLoading;
}; 