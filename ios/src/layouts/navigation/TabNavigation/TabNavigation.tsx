/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {useCallback, useRef, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, TouchableOpacity, View} from 'react-native';
import colors from '../../style/colors';
import {getStorageData} from '../../../utils/helper';
import {useFocusEffect} from '@react-navigation/native';
import MenuScreen from '../../screens/Account/MenuScreen';
import ChatScreen from '../../screens/Account/ChatScreen';
import NottificationScreen from '../../screens/Account/NottificationScreen';
import UpDateScreen from '../../screens/Account/UpDateCourseScreen';
import AccountScreen from '../../screens/Account/AccountScreen';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import ChatList from '../../screens/Account/ChatList';

const Tab = createBottomTabNavigator();

const TabNavigation = ({navigation}: any) => {
  const lastPressRef = useRef(0);
  const handleMenuPress = () => {
    const now = Date.now();
    if (now - lastPressRef.current > 1000) {
      // 1 second interval
      lastPressRef.current = now;
      console.log(lastPressRef.current);
      navigation.openDrawer();
    }
  };

  const CustomTabBarButton = (props: any) => {
    return (
      <TouchableOpacity
        {...props}
        onPress={() => {
          props.onPress();
          handleMenuPress();
        }}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="menu"
            color={props.focused ? 'black' : 'gray'}
            size={20}
          />
          <Text
            style={{
              color: props.focused ? 'black' : 'gray',
              fontSize: responsiveFontSize(1.5),
              marginTop: 5,
            }}>
            Menu
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.white,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.gray,
        headerShown: false,
      }}>
      <Tab.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatList}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text
              style={{
                color: focused ? color : 'gray',
                fontSize: responsiveFontSize(1.5),
                marginTop: -10,
              }}>
              Chat
            </Text>
          ),
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="chat" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="NottificationScreen"
        component={NottificationScreen}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text
              style={{
                color: focused ? color : 'gray',
                fontSize: responsiveFontSize(1.5),
                marginTop: -10,
              }}>
              Notification
            </Text>
          ),
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="bell-ring" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="UpDateScreen"
        component={UpDateScreen}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text
              style={{
                color: focused ? color : 'gray',
                fontSize: responsiveFontSize(1.5),
                marginTop: -10,
              }}>
              Updates
            </Text>
          ),
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="update" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{
          tabBarLabel: ({focused, color}) => (
            <Text
              style={{
                color: focused ? color : 'gray',
                fontSize: responsiveFontSize(1.5),
                marginTop: -10,
              }}>
              Account
            </Text>
          ),
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={23} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
