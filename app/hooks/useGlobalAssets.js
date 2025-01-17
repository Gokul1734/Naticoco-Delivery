import { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';

const globalAssets = {
  // Add other global assets here if needed
};

export const useGlobalAssets = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        if (Object.keys(globalAssets).length > 0) {
          await Asset.loadAsync(Object.values(globalAssets));
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Error loading global assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  return isLoading;
}; 