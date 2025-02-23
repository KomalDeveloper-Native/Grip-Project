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
import {Avatar, Icon, SearchBar} from 'react-native-elements';
import {locale} from 'moment';
import {Circle} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import colors from '../../../style/colors';
import {Row} from 'react-day-picker';

interface Props {}

const CompletedScreen: FC<Props> = ({navigation}) => {
  const [couponCode, setCouponCode] = useState('');
  const [applied, setApplied] = useState(false);

  const applyCoupon = () => {
    if (couponCode.trim() === '') {
      Alert.alert('Error', 'Please enter a valid coupon code.');
    } else {
      setApplied(true);
      Alert.alert('Success', `Coupon "${couponCode}" applied!`);
    }
  };

  const sentFun = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Description',
        // params: {
        //   franchiseid: id,
        // },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          width: responsiveWidth(100),
          backgroundColor: 'white',
          opacity: 9,
          alignSelf: 'center',
          paddingVertical: 10,
        }}>
        <View style={styles.cart}>
          <View style={styles.content}>
            <Image
              source={require('../../../img/GripBheem.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.text1}>Grip Tongue Drum</Text>
            <Text style={styles.text2}>Meditation Entertainmet</Text>
            <Text style={styles.text1}>Rs 4,999.00</Text>
          </View>
          <View style={styles.numberContainer}>
          <Text style={styles.text3}>Leave Review</Text>
          
          </View>
        </View>
        <View style={styles.cart}>
          <View style={styles.content}>
            <Image
              source={require('../../../img/GripBheem.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.text1}>Grip Tongue Drum</Text>
            <Text style={styles.text2}>Meditation Entertainment</Text>
            <Text style={styles.text1}>Rs 4,999.00</Text>
          </View>
          <View style={styles.numberContainer}>
          <Text style={styles.text3}>Leave Review</Text>
        
          </View>
        </View>
        <View style={styles.cart}>
          <View style={styles.content}>
            <Image
              source={require('../../../img/gripTongueDrum.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.text1}>Grip Tongue Drum</Text>
            <Text style={styles.text2}>Meditation Entertainment</Text>
            <Text style={[styles.text1, {fontFamily: 'Roboto-Medium'}]}>
              Rs 4,999.00
            </Text>
          </View>
          <View style={styles.numberContainer}>
          
            <Text style={styles.text3}>Leave Review</Text>
          
          </View>
        </View>
      </ScrollView>
      {/* Cover for Payment and Coupon */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingBottom: 0,
  },
  row: {
    width: responsiveWidth(60),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  text: {
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'center',
  },
  locationText: {
    width: responsiveWidth(90),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    textAlign: 'justify',
    alignSelf: 'center',
    marginBottom: 10,
  },
  location: {
    width: responsiveWidth(59.5),

    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.85),
  
  },
  changeBtn:{
    backgroundColor:'white',
    width: responsiveWidth(25),

    height:responsiveHeight(5),
    alignItems:'center',
    justifyContent:'center',
    textAlign: 'justify',
    borderWidth:0.5,
    borderColor:'gray',
    borderRadius:50,
    elevation:2,
    opacity:55
  },
  changeBtnText:{
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.8),
  },
  checkout: {
    width: responsiveWidth(90),

    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'center',
  },

  cart: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 1,
    opacity: 88,
    alignSelf: 'center',
    marginTop: 10,
    padding: 10,
    flexDirection: 'row',
  },
  content: {
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    elevation: 1,
    opacity: 85,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    resizeMode: 'contain',
  },
  column: {
    width: responsiveWidth(35),
    gap: 2,
    flexDirection: 'column',
  },
  numberContainer: {
    width: responsiveWidth(22),

    height: responsiveHeight(5),
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 1,
  },
  text1: {
    width: responsiveWidth(40),

    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Bold',
    textAlign: 'left',
    alignSelf: 'center',
  },
  text2: {
    width: responsiveWidth(40),

    color: 'black',
    fontSize: responsiveFontSize(1.65),
    fontFamily: 'Roboto-Regular',
    textAlign: 'left',
    alignSelf: 'center',
  },
  text3: {
    color: 'white',
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'center',
  },

});

export default CompletedScreen;
