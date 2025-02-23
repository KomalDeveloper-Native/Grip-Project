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
import { Divider } from 'react-native-paper';
import FranchiseScreen from '../screens/Franchise/FranchiseScreen';

const CustomDrawer = ({props,navigation}: any) => {
  // navigation = useNavigation();
  const navigateToScreen = (screenName: any) => () => {
    navigation.navigate(screenName);
  };

  return (
    <View style={{flex: 1,borderRadius:50}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: 50,
            }}>
            <Image
              source={require('../img/Rectangle92.png')}
              style={styles.logo}
            />
          </View>
        </View>
        <Divider />

        <View
          style={{
            height: 57,
            marginTop: 25,
            marginBottom: -16,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="home"
                size={20}
                color={colors.white}
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
            marginBottom: -16,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="home"
                size={20}
                color={colors.white}
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
            marginBottom: -16,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="home"
                size={20}
                color={colors.white}
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
            marginBottom: -16,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="home"
                size={20}
                color={colors.white}
                style={styles.bg}
              />
            )}
            label={() => <Text style={styles.RouteName}>Franchise Opportunities</Text>}
            onPress={navigateToScreen('FranchiseScreen')}
          />
        </View>
        <View
          style={{
            height: 57,
            marginTop: 25,
            marginBottom: -16,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="home"
                size={20}
                color={colors.white}
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
            marginBottom: -16,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="home"
                size={20}
                color={colors.white}
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
            marginBottom: -16,
            paddingLeft: 5,
            justifyContent: 'flex-end',
          }}>
          <DrawerItem
            icon={() => (
              <Icon
                name="home"
                size={20}
                color={colors.white}
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
    backgroundColor: colors.brand_primary,
  },
  bg1: {
    width: 30,
    height: 30,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: colors.brand_primary,
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius:50,
    alignSelf: 'center',
    alignItems: 'center',
  },
});
