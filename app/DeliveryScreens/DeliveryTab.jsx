import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, Dimensions, SafeAreaView } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, getSafeAreaPadding } from '../utils/responsive';
import DeliveryHome from './DeliveryHome';
import DeliverySearch from './DeliverySearch';
import DeliveryLocations from './DeliveryLocations';
import DeliveryProfile from './DeliveryProfile';
import DeliverySavings from './DeliverySavings';

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TabIcon = ({ focused, icon }) => (
  <MotiView
    from={{ scale: 0.5, opacity: 0 }}
    animate={{ 
      scale: focused ? 1 : 0.8, 
      opacity: 1 
    }}
    transition={{ 
      type: 'spring',
      duration: 500
    }}
    style={[
      styles.iconContainer,
      focused && styles.focusedIconContainer
    ]}
  >
    <Ionicons
      name={icon}
      size={30}
      color={focused ? '#F8931F' : '#666'}
      style={styles.icon}
    />
  </MotiView>
);

export default function DeliveryTab() {
  const safeAreaPadding = getSafeAreaPadding();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Locations':
              iconName = focused ? 'location' : 'location-outline';
              break;
            case 'Savings':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <TabIcon focused={focused} icon={iconName} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          ...styles.tabBar,
          bottom: Platform.OS === 'ios' ? safeAreaPadding.paddingBottom : 16,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DeliveryHome} />
      <Tab.Screen name="Search" component={DeliverySearch} />
      <Tab.Screen name="Locations" component={DeliveryLocations} />
      <Tab.Screen name="Savings" component={DeliverySavings} />
      <Tab.Screen name="Profile" component={DeliveryProfile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: scale(20),
    right: scale(20),
    height: verticalScale(70),
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(35),
    borderTopRightRadius: scale(35),

    paddingHorizontal: scale(10),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderTopWidth: 0,
    padding : 10,
    marginBottom : -50
  },
  iconContainer: {
    marginTop: Platform.OS === 'ios' ? verticalScale(15) : verticalScale(10),
    width: scale(50),
    height: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(25),
  },
  focusedIconContainer: {
    backgroundColor: '#FFF5E6',
    transform: [{ scale: 1.1 }],
  },
  icon: {
    marginTop: Platform.OS === 'ios' ? 0 : -2,
  }
});
