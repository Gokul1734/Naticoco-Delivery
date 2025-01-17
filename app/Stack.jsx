import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import TabNavigator from "./Tab";
// import LoginScreen from "./Login";
// import SignUpScreen from "./CustomerScreens/Screens/SignUp";
// import { SafeAreaView } from "react-native";
// import CartScreen from "./CustomerScreens/Screens/Cart";
// import CheckoutScreen from "./CustomerScreens/Screens/Checkout";
// import SuccessSplash from "./CustomerScreens/Components/SuccessSplash";
// import TrackScreen from "./CustomerScreens/Screens/Track";
// import ItemDisplay from "./CustomerScreens/Components/ItemDisplay";
// import MyOrders from "./CustomerScreens/Screens/MyOrders";
// import Profile from "./CustomerScreens/Screens/Profile";
// import MyAddresses from "./CustomerScreens/Screens/MyAddresses";
// import FilteredItems from "./CustomerScreens/Components/FilteredItems";
// import Welcome from "./CustomerScreens/Screens/Welcome";
// import Location from "./CustomerScreens/Screens/Location";
// import StoreType from "./CustomerScreens/Screens/StoreType";
// import CrispyHome from "./CustomerScreens/Screens/CrispyHome";
// import { Dimensions } from "react-native";
// import { useGlobalAssets } from "./hooks/useGlobalAssets";
// import LoadingScreen from "./CustomerScreens/Components/LoadingScreen";
// import ScreenBackground from "./CustomerScreens/Components/ScreenBackground";
import DeliveryTab from "./DeliveryScreens/DeliveryTab";

// import StoreStack from "./StoreScreens/StoreStack";
// import Postorder from "./CustomerScreens/Screens/Postorder";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// //Admin Screens
// import ManageStore from "./AdminScreens/ManageStore";
// import AdminHome from "./AdminScreens/AdminHome";
// import UserManagement from "./AdminScreens/ManageUser";
// import OrderAnalytics from "./AdminScreens/OrderAnalytics";
// import DeliveryPartner from "./AdminScreens/DeliveryPartner";
// import AddStore from "./AdminScreens/AddStore";

//Delivery Screens
import DeliveryHome from "./DeliveryScreens/DeliveryHome";
import ActiveDeliveries from "./DeliveryScreens/ActiveDeliveries";
import { Dimensions } from "react-native";
import LoginScreen from "./DeliveryScreens/DeliveryLogin";
// import LoadingScreen from "./CustomerScreens/Components/LoadingScreen";
// import ScreenBackground from "./CustomerScreens/Components/ScreenBackground";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  // const isLoadingGlobal = useGlobalAssets();

  // if (isLoadingGlobal) {
  //   return <LoadingScreen />;
  // }

  return (

      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
            flex: 1,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            padding: 0,
            margin: 0,
          },
          animation: "default",
          safeAreaInsets: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        }}
      >
       <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DeliveryTab"
          component={DeliveryTab}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
}
