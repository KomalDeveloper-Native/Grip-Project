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
