/* eslint-disable quotes */
/* eslint-disable jsx-quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, ActivityIndicator} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import colors from '../style/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Appbar from '../Component/Appbar';
import AppBarSearch from '../Component/AppBarSearch';
import AppbarPlus from '../Component/Appbarplus';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import CourseScreen from '../screens/Course/CourseList/CourseScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import NewCourseScreen from '../screens/Course/NewCourse/NewCourseScreen';
import CourseDetailScreen from '../screens/Course/CourseDetail/CourseDetailScreen';
import UpDateScreen from '../screens/Account/UpDateCourseScreen';
import SubscriptionList from '../screens/Course/TopNavigationScreen/SubscriptionList';
import LeadList from '../screens/Course/TopNavigationScreen/LeadList';
import TopNavigator from './TopNavigation';
import CustomTopNavigator from './CustomTopNavigator';
import FollowUP from '../screens/Course/TopNavigationScreen/FolluwUp';
import Stude from '../screens/Course/TopNavigationScreen/Stude';
import AddSubscription from '../screens/Course/TopNavigationScreen/AddSubscriptionScreen';
import FollowUpScreen from '../screens/Course/TopNavigationScreen/FollowUpScreen';
import {DrawerNavigation} from './DrawnNavigation';
import LeadDetailsView from '../screens/Course/TopNavigationScreen/LeadDetailsView';
import TrainingDetail from '../screens/Course/TrainerCourse/TrainingDetail';
import NewSeoDetails from '../screens/Course/NewCourse/NewSeoDetails';
import EditCourse from '../screens/Course/EditCourse/EditCourse';
import Nottification from '../screens/Account/NottificationScreen';
import Account from '../screens/Account/AccountScreen';
import TabNavigation from './TabNavigation/TabNavigation';
import TrainerCourseScreen from '../screens/Course/TrainerCourse/TrainerCourseScreen';
import TrainerDetailScreen from '../screens/Course/TrainerCourse/TrainerDetailScreen';
import MenuScreen from '../screens/Account/MenuScreen';
import AccountScreen from '../screens/Account/AccountScreen';
import NottificationScreen from '../screens/Account/NottificationScreen';
import StudioIdentity from '../screens/Kyc/StudioIdentity';
import SubmitStudio from '../screens/Kyc/SubmitStudio';
import NotificationScreen from '../screens/Account/NottificationScreen';
import ChatScreen from '../screens/Account/ChatScreen';
import ChangeLeadStatus from '../screens/Course/TopNavigationScreen/ChangeLeadStatus';
import FollowDetailScreen from '../screens/Course/TopNavigationScreen/FollowDetail';
import ChatAppbar from '../Component/ChatAppbar';
import ChatLIst from '../screens/Account/ChatList';
import ChatList from '../screens/Account/ChatList';
import ForgetPassword from '../screens/Auth/ForgetPassword';
import EmailCode from '../screens/Auth/EmailCode';
import Resetpassword from '../screens/Auth/Resetpassword';
import PasswordChange from '../screens/Auth/PasswordChange';
import CustomerReview from '../screens/Course/CourseDetail/CustomerReview';
import ReviewDetailPage from '../screens/Course/CourseDetail/ReviewDetailPage';
import Profile from '../screens/Profile/Profile';
import TrainerList from '../screens/Trainer/TrainerList';
import TrainerScreen from '../screens/Trainer/TrainerScreen';
import AddTrainerReview from '../screens/Trainer/AddTrainerReview';
import TrainerReview from '../screens/Trainer/TrainerReview';
import TrainerSearch from '../Component/TrainerSearch';
import ArrowIcon from '../Component/ArrowIcon';
import RetreatScreen from '../screens/Retreat/RetreatScreen';
import RetreatSearch from '../Component/RetreatSearch';
import RetreatDetailsScreen from '../screens/Retreat/RetreatDetailsScreen';
import FranchiseScreen from '../screens/Franchise/FranchiseScreen';
import FranchiseSearch from '../Component/FranchiseSearch';
import FranchiseDetailScreen from '../screens/Franchise/FranchiseDetailScreen';
import JobScreen from '../screens/Job/JobScreen';
import JobSearch from '../Component/JobSearch';
import JobDetailScreen from '../screens/Job/JobDetailScreen';
import EventScreen from '../screens/Event/EventScreen';
import EventSearch from '../Component/EventSearch';
import EventDetailScreen from '../screens/Event/EventDetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [auth, setAuth] = useState('');
  const [load, setLoad] = useState(true);
  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async () => {
    try {
      const getData = await AsyncStorage.getItem('user_data');
      if (getData) {
        setAuth(getData);
      }
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };

  return load === false ? (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={auth === '' ? 'LoginScreen' : 'LoginScreen'}>
      {/* LOgIN SCREENS ============================= */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      {/* Register Screen ============================= */}
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      {/* Register Screen ============================= */}
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="EmailCode" component={EmailCode} />
      <Stack.Screen name="Resetpassword" component={Resetpassword} />
      <Stack.Screen name="PasswordChange" component={PasswordChange} />

      {/* Course Screen */}
      <Stack.Screen name="CourseScreen" component={CourseScreen} />
      <Stack.Screen name="NewCourseScreen" component={NewCourseScreen} />
      <Stack.Screen name="NewSeoDetails" component={NewSeoDetails} />
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailScreen} />
      <Stack.Screen name="SubscriptionList" component={SubscriptionList} />
      <Stack.Screen name="LeadList" component={LeadList} />
      <Stack.Screen name="FollowUp" component={FollowUP} />
      <Stack.Screen name="Student" component={Stude} />
      <Stack.Screen name="AddSubscriptionScreen" component={AddSubscription} />
      <Stack.Screen name="FollowUpScreen" component={FollowUpScreen} />
      <Stack.Screen name="FollowDetail" component={FollowDetailScreen} />
      <Stack.Screen name="Profile" component={Profile} />

      <Stack.Screen name="LeadDetailsView" component={LeadDetailsView} />
      <Stack.Screen name="EditCourse" component={EditCourse} />
      <Stack.Screen name="ChangeLeadStatus" component={ChangeLeadStatus} />

      {/* Nottification */}
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />

      {/* Account */}
      <Stack.Screen name="AccountScreen" component={AccountScreen} />

      {/* ChatScreen */}
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ChatList" component={ChatList} />

      {/* Chat */}
      <Stack.Screen name="UpdateScreen" component={UpDateScreen} />

      {/* Trainer Course */}
      <Stack.Screen
        name="TrainerCourseScreen"
        component={TrainerCourseScreen}
      />
      <Stack.Screen
        name="TrainerDetailScreen"
        component={TrainerDetailScreen}
      />
      <Stack.Screen name="TrainingDetail" component={TrainingDetail} />
      <Stack.Screen name="CustomerReview" component={CustomerReview} />
      <Stack.Screen name="ReviewDetailPage" component={ReviewDetailPage} />

      {/* Trainer */}
      <Stack.Screen name="TrainerList" component={TrainerList} />
      <Stack.Screen name="TrainerScreen" component={TrainerScreen} />
      <Stack.Screen name="AddTrainerReview" component={AddTrainerReview} />
      <Stack.Screen name="TrainerReview" component={TrainerReview} />

      {/* Retreat  */}
      <Stack.Screen name="RetreatScreen" component={RetreatScreen} />
      <Stack.Screen name="RetreatSearch" component={RetreatSearch} />
      <Stack.Screen name="RetreatDetailsScreen" component={RetreatDetailsScreen} />

      {/* Franchise */}
      <Stack.Screen name="FranchiseScreen" component={FranchiseScreen} />
      <Stack.Screen name="FranchiseSearch" component={FranchiseSearch} />
      <Stack.Screen name="FranchiseDetailScreen" component={FranchiseDetailScreen} />

     {/*Job  */}
     <Stack.Screen name="JobScreen" component={JobScreen} />
     <Stack.Screen name="JobSearch" component={JobSearch} />
     <Stack.Screen name="JobDetailScreen" component={JobDetailScreen} />

     {/*Event  */}
     <Stack.Screen name="EventScreen" component={EventScreen} />
     <Stack.Screen name="EventSearch" component={EventSearch} />
     <Stack.Screen name="EventDetailScreen" component={EventDetailScreen} />


      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="TopNavigation" component={TopNavigator} />
      <Stack.Screen name="AppNavigation" component={AppNavigation} />

      <Stack.Screen name="StudioIdentity" component={StudioIdentity} />
      <Stack.Screen name="SubmitStudio" component={SubmitStudio} />

      {/* Menu */}
      <Stack.Screen name="MenuScreen" component={MenuScreen} />

      {/* Appbar */}
      <Stack.Screen name="Appbar" component={Appbar} />
      <Stack.Screen name="ArrowIcon" component={ArrowIcon} />

      <Stack.Screen name="AppbarPlus" component={AppbarPlus} />
      <Stack.Screen name="AppBarSearch" component={AppBarSearch} />
      <Stack.Screen name="TrainerSearch" component={TrainerSearch} />

      <Stack.Screen name="ChatAppbar" component={ChatAppbar} />

      {/* TabNavgion */}
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
    </Stack.Navigator>
  ) : (
    <View>
      <ActivityIndicator size={20} color={colors.brand_primary} />
    </View>
  );
};

export default AppNavigation;
