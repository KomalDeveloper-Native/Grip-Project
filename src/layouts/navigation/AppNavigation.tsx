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
import SubscriptionList from '../screens/Course/LeadScreen/SubscriptionList';
import LeadList from '../screens/Course/LeadScreen/LeadList';
import TopNavigator from './TopNavigation';
import CustomTopNavigator from './CustomTopNavigator';
import FollowUP from '../screens/Course/LeadScreen/FollowUp';
import Stude from '../screens/Course/LeadScreen/Stude';
import AddSubscription from '../screens/Course/LeadScreen/AddSubscriptionScreen';
import FollowUpScreen from '../screens/Course/LeadScreen/FollowUpScreen';
import {DrawerNavigation, ShopDrawerNavigator} from './DrawnNavigation';
import LeadDetailsView from '../screens/Course/LeadScreen/LeadDetailsView';
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
import ChangeLeadStatus from '../screens/Course/LeadScreen/ChangeLeadStatus';
import FollowDetailScreen from '../screens/Course/LeadScreen/FollowDetail';
import ChatAppbar from '../Component/ChatAppbar';
import ChatLIst from '../screens/Account/ChatList';
import ChatList from '../screens/Account/ChatList';
import ForgetPassword from '../screens/Auth/ForgetPassword';
import EmailCode from '../screens/Auth/EmailCode';
import Resetpassword from '../screens/Auth/Resetpassword';
import PasswordChange from '../screens/Auth/PasswordChange';
import CustomerReview from '../screens/Course/CourseDetail/CustomerReview';
import ReviewDetailPage from '../screens/Course/CourseDetail/AddCustomerReview';
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
import MarkFees from '../screens/Course/LeadScreen/MarkFees';
import RejoinScreen from '../screens/Course/LeadScreen/RejoinScreen';
import OtpLoginScreen from '../screens/Auth/OtpLoginScreen';
import OtpVerification from '../screens/Auth/OtpVerification';
import ResendOtpScreen from '../screens/Auth/ResendOtpScreen';
import {FranchiseApply} from '../screens/Apply/FranchiseApplyScreen';
import {ApplyEventScreen} from '../screens/Apply/ApplyEventScreen';
import {JobApplyScreen} from '../screens/Apply/JobApplyScreen';
import {RetreatApplyScreen} from '../screens/Apply/RetreatApplyScreen';
import {AddJobScreen} from '../screens/TrainerJob/AddJobScreen';
import TrainerJobScreen from '../screens/TrainerJob/TrainerJobScreen';
import TrainerJobDetail from '../screens/TrainerJob/TrainerJobDetailScreen';
import JobDetail from '../screens/TrainerJob/JobDetail';
import {EditJobScreen} from '../screens/TrainerJob/EditJobScreen';
import ApplicationScreeen from '../screens/TrainerJob/JobTopNavigator.tsx/ApplicationScreeen';
import RetreatUserDetailScreen from '../screens/RetreatTrainer/RetreatUserDetailScreen';
import RetreatUserScreen from '../screens/RetreatTrainer/RetreatUserScreen';
import RetreatDetail from '../screens/RetreatTrainer/RetreatDetail';
import {AddNewRetreat} from '../screens/RetreatTrainer/AddNewRetreat';
import {EditRetreatScreen} from '../screens/RetreatTrainer/EditRetreatScreen';
import RetreatTopNavigator from './TabNavigation/RetreatTopNavigator';
import CustomRetreatTopNavigator from './TabNavigation/CustomRetreatTopNavigator';
import Booking from '../screens/RetreatTrainer/RetreatTopNavigator/Booking';
import RetreatLead from '../screens/RetreatTrainer/RetreatTopNavigator/RetreatLead';
import RetreatFollow from '../screens/RetreatTrainer/RetreatTopNavigator/RetreatFollow';
import ReatreatFollowDetail from '../screens/RetreatTrainer/RetreatTopNavigationDetail/ReatreatFollowDetail';
import AddRetreatLeadFollow from '../screens/RetreatTrainer/RetreatTopNavigationDetail/AddRetreatLeadFollow';
import RetreatLeadDetail from '../screens/RetreatTrainer/RetreatTopNavigationDetail/RetreatLeadDetail';
import RetreatMarkFees from '../screens/RetreatTrainer/RetreatTopNavigationDetail/RetreatMarkFees';
import RetreatStudent from '../screens/RetreatTrainer/RetreatTopNavigator/RetreatStudent';
import FranchiseTrainerScreen from '../screens/FranchiseTrainerScreen.tsx/FranchiseTrainerScreen';
import FranchiseTrainerDetailScreen from '../screens/FranchiseTrainerScreen.tsx/FranchiseTrainerDetailScreen';
import {CreateTrainerFranchise} from '../screens/FranchiseTrainerScreen.tsx/CreateTrainerFranchise';
import FranchiseDetail from '../screens/FranchiseTrainerScreen.tsx/FranchiseDetail';
import {EditTrainerFranchise} from '../screens/FranchiseTrainerScreen.tsx/EditTrainerFranchise';
import InterestedFranchise from '../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/InterestedFranchise';
import LeadFranchise from '../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/LeadFranchise';
import FranchiseTopNavigation from './TabNavigation/FranchiseTopNavigation';
import CustomFranchiseTopNavigation from './TabNavigation/CustomFranchiseTopNavigation';
import LeadFranchiseDetails from '../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/LeadFranchiseDetails';
import InterestedFranchiseDetail from '../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/InterestedFranchiseDetail';
import FollowFrachise from '../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/FollowFrachise';
import FranchiseFollowDetail from '../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/FranchiseFollowDetail';
import AddFranchiseFollowUp from '../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/AddFranchiseFollowUp';
import AddCutomerInterest from '../screens/FranchiseTrainerScreen.tsx/FranchiseTopNavigator/AddCutomerInterest';
import CandidateScreen from '../screens/TrainerJob/JobTopNavigator.tsx/CandidateScreen';
import JobTopNavigation from './TabNavigation/JobTopNavigation';
import CustomJobTopNavigation from './TabNavigation/CustomJobTopNavigation';
import ApplicationDetail from '../screens/TrainerJob/JobTopDetails/ApplicationDetail';
import AppRedux from '../../..';
import TrainerEventScreen from '../screens/TrainerEvent/TrainerEventScreen';
import TrainerEventDetailScreen from '../screens/TrainerEvent/TrainerEventDetailScreen';
import TrainerEvent from '../screens/TrainerEvent/TrainerEvent';
import RetreatWriteReview from '../screens/Retreat/RetreatWriteReview';
import RetreatReviewScreen from '../screens/Retreat/RetreatReviewScreen';
import AddBookingScreen from '../screens/RetreatTrainer/RetreatTopNavigationDetail/AddBookingScreen';
import TransactionCustomTopNavigator from '../screens/Account/Transaction/TransactionCustomTopNavigator';
import TransitionTopNavigator from '../screens/Account/Transaction/TransactionTopNavigaor';
import RetreatTransaction from '../screens/Account/Transaction/RetreatTransaction';
import CourseTransaction from '../screens/Account/Transaction/CourseTransaction';
import ReviewListScreen from '../screens/Account/Transaction/Review/ReviewListScreen';
import EditReviewScreen from '../screens/Account/Transaction/Review/EditReviewScreen';
import userJob from '../screens/Account/userJob/userJob';
import userJobDetail from '../screens/Account/userJob/userJobDetail';
import CandidateDetail from '../screens/TrainerJob/JobTopDetails/CandidateDetail';
import userFranchise from '../screens/Account/userFranchise/userFranchise';
import userFranchiseDetail from '../screens/Account/userFranchise/userFranchiseDetail';
import userCourse from '../screens/Account/userCourse/userCourse';
import userCourseDetail from '../screens/Account/userCourse/userCourseDetail';
import userRetreat from '../screens/Account/userRetreat/userRetreat';
import userRetreatDetail from '../screens/Account/userRetreat/userRetreatDetail';
import HomeScreen from '../screens/Ecom/HomeScreen';
import Description from '../screens/Ecom/DescriptionScreen';
import Mycart from '../screens/Ecom/Cart/MycartScreen';
import CheckoutScreen from '../screens/Ecom/Cart/CheckoutScreen';
import AddressScreen from '../screens/Ecom/Address/AddressScreen';
import PaymentScreen from '../screens/Ecom/Payment/PaymentScreen';
import PaymentSuccessful from '../screens/Ecom/Payment/PaymentSuccessful';
import CompletedScreen from '../screens/Ecom/Order/CompletedScreen';
import ActiveScreen from '../screens/Ecom/Order/ActiveScreen';
import OrderTopNavigation from './TabNavigation/OrderTopNavigation';
import CustomOrderTopNavigation from './TabNavigation/CustomOrderTopNavigation';
import CancelScreen from '../screens/Ecom/Order/CancelScreen';
import { ProductList } from '../screens/Ecom/ProductList';
import ShippingAddress from '../screens/Ecom/Address/ShippingAddress';
import TrackOrderScreen from '../screens/Ecom/Order/TrackOrder';
import ApplyCoupon from '../screens/Ecom/Cart/ApplyCoupon';
import CartItemScreen from '../screens/Ecom/Cart/CartItemScreen';


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
      console.log(getData, 'GEt');
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
      initialRouteName={auth === '' ? 'LoginScreen' : 'DrawerNavigation'}>
      {/* LOgIN SCREENS ============================= */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OtpLoginScreen" component={OtpLoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="ResendOtpScreen" component={ResendOtpScreen} />

      {/* Register Screen ============================= */}
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
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
      <Stack.Screen name="LeadDetailsView" component={LeadDetailsView} />
      <Stack.Screen name="EditCourse" component={EditCourse} />
      <Stack.Screen name="ChangeLeadStatus" component={ChangeLeadStatus} />
      <Stack.Screen name="MarkFees" component={MarkFees} />
      <Stack.Screen name="RejoinScreen" component={RejoinScreen} />

      {/*BottomNavigator */}
      {/* Menu */}
      <Stack.Screen name="MenuScreen" component={MenuScreen} />

      {/* Nottification */}
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />

      {/* Account */}
      <Stack.Screen name="AccountScreen" component={AccountScreen} />

      {/* ChatScreen */}
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="UpdateScreen" component={UpDateScreen} />

      {/* Ecom */}
     <Stack.Screen name="HomeScreen" component={HomeScreen} />
     <Stack.Screen name="ProductList" component={ProductList} />

     <Stack.Screen name="Description" component={Description} />

     {/* cart */}
     <Stack.Screen name="Mycart" component={Mycart} />
     <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
     <Stack.Screen name="ApplyCoupon" component={ApplyCoupon} />
     <Stack.Screen name="CartItemScreen" component={CartItemScreen} />


      
      {/* Address */}
     <Stack.Screen name="ShippingAddress" component={ShippingAddress} />

     <Stack.Screen name="AddressScreen" component={AddressScreen} />
     <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
     <Stack.Screen name="PaymentSuccessful" component={PaymentSuccessful} />

      {/*Order*/}
      <Stack.Screen name="TrackOrderScreen" component={TrackOrderScreen} />

      <Stack.Screen name="CompletedScreen" component={CompletedScreen} />
      <Stack.Screen name="ActiveScreen" component={ActiveScreen} />
      <Stack.Screen name="CancelScreen" component={CancelScreen} />

    
    {/* OrderTopNavigator */}
    <Stack.Screen
        name="OrderTopNavigation"
        component={OrderTopNavigation}
      />
      <Stack.Screen
        name="CustomOrderTopNavigation"
        component={CustomOrderTopNavigation}
      />
      

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
      <Stack.Screen
        name="RetreatDetailsScreen"
        component={RetreatDetailsScreen}
      />
      <Stack.Screen name="RetreatWriteReview" component={RetreatWriteReview} />
      <Stack.Screen
        name="RetreatReviewScreen"
        component={RetreatReviewScreen}
      />

      {/* Franchise */}
      <Stack.Screen name="FranchiseScreen" component={FranchiseScreen} />
      <Stack.Screen name="FranchiseSearch" component={FranchiseSearch} />
      <Stack.Screen
        name="FranchiseDetailScreen"
        component={FranchiseDetailScreen}
      />

      {/*Franchise Trainer  */}
      <Stack.Screen
        name="FranchiseTrainerScreen"
        component={FranchiseTrainerScreen}
      />
      <Stack.Screen
        name="FranchiseTrainerDetailScreen"
        component={FranchiseTrainerDetailScreen}
      />
      <Stack.Screen name="FranchiseDetail" component={FranchiseDetail} />
      <Stack.Screen
        name="CreateTrainerFranchise"
        component={CreateTrainerFranchise}
      />
      <Stack.Screen
        name="EditTrainerFranchise"
        component={EditTrainerFranchise}
      />

      <Stack.Screen
        name="AddFranchiseFollowUp"
        component={AddFranchiseFollowUp}
      />

      {/**Franchise Top Navigator   */}
      <Stack.Screen
        name="FranchiseTopNavigation"
        component={FranchiseTopNavigation}
      />
      <Stack.Screen
        name="CustomFranchiseTopNavigation"
        component={CustomFranchiseTopNavigation}
      />

      {/*Franchise Top Navigator Screen */}
      <Stack.Screen name="AddCutomerInterest" component={AddCutomerInterest} />
      <Stack.Screen
        name="InterestedFranchise"
        component={InterestedFranchise}
      />
      <Stack.Screen name="LeadFranchise" component={LeadFranchise} />
      <Stack.Screen name="FollowFrachise" component={FollowFrachise} />
      <Stack.Screen
        name="InterestedFranchiseDetail"
        component={InterestedFranchiseDetail}
      />
      <Stack.Screen
        name="LeadFranchiseDetails"
        component={LeadFranchiseDetails}
      />
      <Stack.Screen
        name="FranchiseFollowDetail"
        component={FranchiseFollowDetail}
      />

      {/*Job  */}
      <Stack.Screen name="JobScreen" component={JobScreen} />
      <Stack.Screen name="JobSearch" component={JobSearch} />
      <Stack.Screen name="JobDetailScreen" component={JobDetailScreen} />

      {/* Trainer Job */}
      <Stack.Screen name="AddJobScreen" component={AddJobScreen} />
      <Stack.Screen name="EditJobScreen" component={EditJobScreen} />

      <Stack.Screen name="TrainerJobScreen" component={TrainerJobScreen} />
      <Stack.Screen name="TrainerJobDetail" component={TrainerJobDetail} />
      <Stack.Screen name="JobDetail" component={JobDetail} />

      {/* Job Top Navigator */}
      <Stack.Screen name="JobTopNavigation" component={JobTopNavigation} />
      <Stack.Screen
        name="CustomJobTopNavigation"
        component={CustomJobTopNavigation}
      />

      {/*Job Top Navigation Screen*/}
      <Stack.Screen name="ApplicationScreeen" component={ApplicationScreeen} />
      <Stack.Screen name="CandidateScreen" component={CandidateScreen} />

      {/*Job Top Detail Navigation Screen*/}
      <Stack.Screen name="ApplicationDetail" component={ApplicationDetail} />
      <Stack.Screen name="CandidateDetail" component={CandidateDetail} />

      {/* Retreat User */}
      <Stack.Screen name="RetreatUserScreen" component={RetreatUserScreen} />
      <Stack.Screen
        name="RetreatUserDetailScreen"
        component={RetreatUserDetailScreen}
      />
      <Stack.Screen name="RetreatDetail" component={RetreatDetail} />
      <Stack.Screen name="AddNewRetreat" component={AddNewRetreat} />
      <Stack.Screen name="EditRetreatScreen" component={EditRetreatScreen} />

      {/* Retreat Trainer */}
      <Stack.Screen
        name="RetreatTopNavigator"
        component={RetreatTopNavigator}
      />
      <Stack.Screen
        name="CustomRetreatTopNavigator"
        component={CustomRetreatTopNavigator}
      />

      {/* Reatreat Top Navigator Screen */}
      <Stack.Screen name="Booking" component={Booking} />
      <Stack.Screen name="RetreatLead" component={RetreatLead} />
      <Stack.Screen name="RetreatFollow" component={RetreatFollow} />
      <Stack.Screen name="RetreatStudent" component={RetreatStudent} />
      <Stack.Screen name="RetreatMarkFees" component={RetreatMarkFees} />

      <Stack.Screen
        name="ReatreatFollowDetail"
        component={ReatreatFollowDetail}
      />
      <Stack.Screen name="AddBookingScreen" component={AddBookingScreen} />
      <Stack.Screen
        name="AddRetreatLeadFollow"
        component={AddRetreatLeadFollow}
      />
      <Stack.Screen name="RetreatLeadDetail" component={RetreatLeadDetail} />

      {/*Event  */}
      <Stack.Screen name="EventScreen" component={EventScreen} />
      <Stack.Screen name="EventSearch" component={EventSearch} />
      <Stack.Screen name="EventDetailScreen" component={EventDetailScreen} />

      {/* Event Trainer */}
      <Stack.Screen name="TrainerEventScreen" component={TrainerEventScreen} />
      <Stack.Screen
        name="TrainerEventDetailScreen"
        component={TrainerEventDetailScreen}
      />
      <Stack.Screen name="TrainerEvent" component={TrainerEvent} />

      {/*{Franchise,event,job,trainer} Apply */}
      <Stack.Screen name="FranchiseApply" component={FranchiseApply} />
      <Stack.Screen name="ApplyEventScreen" component={ApplyEventScreen} />
      <Stack.Screen name="JobApplyScreen" component={JobApplyScreen} />
      <Stack.Screen name="RetreatApplyScreen" component={RetreatApplyScreen} />

      {/* Navigator */}
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="TopNavigation" component={TopNavigator} />
      <Stack.Screen name="AppNavigation" component={AppNavigation} />

      {/*  */}
      <Stack.Screen name="ShopDrawerNavigator" component={ShopDrawerNavigator} />
      <Stack.Screen name="StudioIdentity" component={StudioIdentity} />
      <Stack.Screen name="SubmitStudio" component={SubmitStudio} />

  
      {/* Appbar */}
      <Stack.Screen name="Appbar" component={Appbar} />
      <Stack.Screen name="ArrowIcon" component={ArrowIcon} />
      <Stack.Screen name="AppbarPlus" component={AppbarPlus} />
      <Stack.Screen name="AppBarSearch" component={AppBarSearch} />
      <Stack.Screen name="TrainerSearch" component={TrainerSearch} />

      <Stack.Screen name="ChatAppbar" component={ChatAppbar} />
      {/* TabNavgion */}
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
      <Stack.Screen name="ReviewListScreen" component={ReviewListScreen} />
      <Stack.Screen name="EditReviewScreen" component={EditReviewScreen} />

      {/* Account */}
      <Stack.Screen
        name="TransitionTopNavigator"
        component={TransitionTopNavigator}
      />
      <Stack.Screen
        name="TransactionCustomTopNavigator"
        component={TransactionCustomTopNavigator}
      />

      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="RetreatTransaction" component={RetreatTransaction} />
      <Stack.Screen name="CourseTransaction" component={CourseTransaction} />
      <Stack.Screen name="userJob" component={userJob} />
      <Stack.Screen name="userJobDetail" component={userJobDetail} />
      <Stack.Screen name="userFranchise" component={userFranchise} />
      <Stack.Screen name="userFranchiseDetail" component={userFranchiseDetail} />
      <Stack.Screen name="userCourse" component={userCourse} />
      <Stack.Screen name="userCourseDetail" component={userCourseDetail} />
      <Stack.Screen name="userRetreat" component={userRetreat} />
      <Stack.Screen name="userRetreatDetail" component={userRetreatDetail} />




    </Stack.Navigator>
  ) : (
    <View>
      <ActivityIndicator size={20} color={colors.white} />
    </View>
  );
};

export default AppNavigation;
