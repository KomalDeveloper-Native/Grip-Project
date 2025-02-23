/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerNavigator from './CustomDrawer';
import LoginScreen from '../screens/Auth/LoginScreen';
import CourseScreen from '../screens/Course/CourseList/CourseScreen';
import CustomDrawer from './CustomDrawer';
import TopNavigation from './TopNavigation';
import CourseDetailScreen from '../screens/Course/CourseDetail/CourseDetailScreen';
import TabNavigation from './TabNavigation/TabNavigation';
import Account from '../screens/Account/AccountScreen';
import MenuScreen from '../screens/Account/MenuScreen';
import TrainerScreen from '../screens/Trainer/TrainerScreen';
import TrainerList from '../screens/Trainer/TrainerList';
import RetreatScreen from '../screens/Retreat/RetreatScreen';
import FranchiseScreen from '../screens/Franchise/FranchiseScreen';
import JobScreen from '../screens/Job/JobScreen';
import EventScreen from '../screens/Event/EventScreen';
import FranchiseDetailScreen from '../screens/Franchise/FranchiseDetailScreen';
import JobDetailScreen from '../screens/Job/JobDetailScreen';
import EventDetailScreen from '../screens/Event/EventDetailScreen';
import { FranchiseApply } from '../screens/Apply/FranchiseApplyScreen';
import FranchiseSearch from '../Component/FranchiseSearch';
import RetreatMarkFees from '../screens/RetreatTrainer/RetreatTopNavigationDetail/RetreatMarkFees';
import Booking from '../screens/RetreatTrainer/RetreatTopNavigator/Booking';
import Mycart from '../screens/Ecom/Cart/MycartScreen';
import EcomCustomDrawn from './EcomCustomDrawn';
import HomeScreen from '../screens/Ecom/HomeScreen';

const Drawer = createDrawerNavigator();

export function DrawerNavigation() {
  return (
    <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    initialRouteName="TabNavigation"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Drawer.Screen name="TabNavigation" component={TabNavigation} />
    <Drawer.Screen name="CourseScreen" component={CourseScreen} />
    <Drawer.Screen name="TrainerList" component={TrainerList} />
    <Drawer.Screen name="RetreatScreen" component={RetreatScreen} />
    <Drawer.Screen name="FranchiseScreen" component={FranchiseScreen} />
    <Drawer.Screen name="JobScreen" component={JobScreen} />
    <Drawer.Screen name="EventScreen" component={EventScreen} />


  </Drawer.Navigator>
  );
}

const ShopDrawer = createDrawerNavigator();
 export const ShopDrawerNavigator = () => {
  return (
    <ShopDrawer.Navigator
     
      drawerContent={(props) => <EcomCustomDrawn {...props} />}
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
      }}
      >
      <ShopDrawer.Screen name="HomeScreen" component={HomeScreen} />

      <ShopDrawer.Screen name="Mycart" component={Mycart} />
    </ShopDrawer.Navigator>
  );
};
