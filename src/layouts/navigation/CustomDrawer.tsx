/* eslint-disable quotes */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
// import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  // Alert,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Svg, Path} from 'react-native-svg';
import React, {useEffect, useState} from 'react';
import colors from '../style/colors';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Divider} from 'react-native-paper';
import FranchiseScreen from '../screens/Franchise/FranchiseScreen';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const CustomDrawer = ({props, navigation,route}: any) => {
 
  const navigateToScreen = (screenName: any) => () => {
    navigation.navigate(screenName);
  };

  return (
    <View style={{flex: 1, borderRadius: 50}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View
            style={{
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: 20, // Add padding if needed
              backgroundColor: 'white', // Optional background
              marginBottom: 50,
            }}>
            <Image
              source={require('../img/GRIPLogo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        <Divider />

        <View
          style={{
            height: 57,
            marginTop: 25,
            marginBottom: -35,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="meditation"
                size={20}
                style={styles.bg}
              />
            )}
            label={() => <Text style={styles.RouteName}>Find a Class</Text>}
            onPress={navigateToScreen('CourseScreen')}
          />
        </View>
        <View
          style={{
            height: 57,
            marginTop: 25,
            marginBottom: -35,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="account-tie"
                size={20}
                style={styles.bg}
              />
            )}
            label={() => <Text style={styles.RouteName}>Find a Trainer</Text>}
            onPress={navigateToScreen('TrainerList')}
          />
        </View>
        <View
          style={{
            height: 57,
            marginTop: 25,
            marginBottom: -35,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="spa"
                size={20}
                style={styles.bg}
              />
            )}
            label={() => <Text style={styles.RouteName}>Book a Retreat</Text>}
            onPress={navigateToScreen('RetreatScreen')}
          />
        </View>
        <View
          style={{
            height: 57,
            marginTop: 25,
            marginBottom: -35,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="storefront"
                size={20}
                style={styles.bg}
              />
            )}
            label={() => (
              <Text style={styles.RouteName}>Franchise Opportunities</Text>
            )}
            onPress={navigateToScreen('FranchiseScreen')}
          />
        </View>
        <View
          style={{
            height: 57,
            marginTop: 25,
            marginBottom: -35,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="home"
                size={20}
                // color={colors.blac}
                style={styles.bg}
              />
            )}
            label={() => <Text style={styles.RouteName}>Find Jobs</Text>}
            onPress={navigateToScreen('JobScreen')}
          />
        </View>
        <View
          style={{
            height: 57,
            marginTop: 25,
            marginBottom: -35,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="home"
                size={20}
                // color={colors.blac}
                style={styles.bg}
              />
            )}
            label={() => <Text style={styles.RouteName}>Browse Event</Text>}
            onPress={navigateToScreen('EventScreen')}
          />
        </View>
        {/* <View
          style={{
            height: 57,
            marginBottom: -35,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <Icon
                name="home"
                size={20}
                // color={colors.blac}
                style={styles.bg}
              />
            )}
            label={() => <Text style={styles.RouteName}>Find an Instructor</Text>}
            onPress={navigateToScreen('Account')}
          />
        </View> */}
      </DrawerContentScrollView>
    </View>
  );
};
export default CustomDrawer;

const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  drawerContent: {
    height: 80,
  },

  text: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
  RouteName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    color: colors.black,
    marginLeft: -20,
  },

  RouteName1: {
    width: 200,
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    color: colors.black,
    marginLeft: -17,
  },
  bg: {
    width: 30,
    height: 30,
    padding: 4.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    // backgroundColor: colors.blac,
  },
  bg1: {
    width: 30,
    height: 30,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    // backgroundColor: colors.blac,
  },

  logo: {
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    borderRadius: 100,
    alignSelf: 'center',
  },
});
