import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { View, SafeAreaView, StatusBar, Text, StyleSheet } from 'react-native';
import StackNavigator from './Stack';
import CustomSplashScreen from './SplashScreen';
// import { CartProvider } from './CustomerScreens/context/CartContext';
import * as Font from 'expo-font';
// import { AuthProvider } from './context/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import ScreenBackground from './CustomerScreens/Components/ScreenBackground';
import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'golos': require('../assets/fonts/gt.ttf'),
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onSplashComplete = useCallback(() => {
    setIsReady(true);
  }, []);

  if (!appIsReady || !isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <CustomSplashScreen onFinish={onSplashComplete} />
      </View>
    );
  }

  return (
    <NavigationIndependentTree style={styles.container}>
      <GestureHandlerRootView >
        <PaperProvider>
              <StackNavigator />
        </PaperProvider>
      </GestureHandlerRootView>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width : SCREEN_WIDTH,
    height : SCREEN_HEIGHT,
    padding: 0,
    margin: 0,
  },
});
