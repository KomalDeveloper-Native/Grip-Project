/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import {Card, TextInput} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {Avatar, CheckBox, Icon, SearchBar} from 'react-native-elements';
import {locale} from 'moment';
import {Circle} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import colors from '../../../style/colors';
import {Row} from 'react-day-picker';
import OrderTopNavigation from '../../../navigation/TabNavigation/OrderTopNavigation';

interface Props {}

const PaymentSuccessful: FC<Props> = ({navigation}) => {
  const [couponCode, setCouponCode] = useState('');
  const [applied, setApplied] = useState(false);

  const [selectedValue, setSelectedValue] = useState(null);

  const sentFun = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name:'OrderTopNavigation',
        // params: {
        //   franchiseid: id,
        // },
      }),
    );
  };

  return (
    <>
      <View style={styles.row}>
        <Icon
          type="material"
          name="arrow-back"
          size={25}
          color={'black'}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.text}>Payment</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.cart}>
          <View style={styles.circle}>
            <Icon
              name="check" // Replace with "right" if that's the desired icon
              type="font-awesome"
              size={50}
              color="white"
            />
          </View>
          <Text style={[styles.text, {fontSize: responsiveFontSize(3.5)}]}>
            Payment Successful
          </Text>
          <Text style={{marginBottom:20}}>Thank You For Your Purchase</Text>
         
        </View>
        <Pressable style={styles.btn} onPress={() => sentFun()}>
          <Text style={[styles.btnText]}>Apply</Text>
        </Pressable>
        {/* Cover for Payment and Coupon */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    paddingVertical: 20,

    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  row: {
    width: responsiveWidth(100),
    backgroundColor: 'white',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 0,
    paddingLeft: 10,
    alignSelf: 'center',
    paddingTop: 20,
  },
  text: {
    width: responsiveWidth(90),

    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  locationText: {
    width: responsiveWidth(90),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    textAlign: 'justify',
    alignSelf: 'center',
  },
  location: {
    width: responsiveWidth(59.5),

    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.85),
  },

  cart: {
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: -100,
  },

  circle: {
    width: responsiveWidth(20), // Adjust size as needed
    height: responsiveHeight(10),
    borderRadius: 50, // Half of width/height to make it a perfect circle
    backgroundColor: 'black', // Change to your desired background color
    justifyContent: 'center',
    alignItems: 'center',
  },

  
  btn: {
    width: responsiveWidth(85),
    height: responsiveHeight(6.5),
    backgroundColor: 'black',
    justifyContent: 'center',
    borderRadius: 50,
    alignSelf: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentSuccessful;
