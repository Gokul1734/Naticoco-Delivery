import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()
  .catch(() => {
    /* reloading the app might trigger some race conditions, ignore them */
  }); 