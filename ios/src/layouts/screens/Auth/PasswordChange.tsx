/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {FC} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from 'react-native-elements';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OTPInputView from '@twotalltotems/react-native-otp-input';
// 9810953465

interface Props {}
const PasswrodChange: FC<Props> = ({navigation}): JSX.Element => {
  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require('../../img/one.jpeg')}
          style={styles.logoImage}
        />
      </View>
      <View style={styles.cover}>
        <Text style={styles.title}> Password Changed</Text>
        <Text style={styles.text}>
          Your Password has been changed Succesfully
        </Text>
        <Pressable style={styles.btn} onPress={()=>navigation.navigate('LoginScreen')}>
          <Text style={styles.btnText}>Back to Login</Text>
        </Pressable>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  logoImage: {
    width: responsiveWidth(40),
    height: responsiveHeight(15),
    alignSelf: 'center',
    marginVertical: responsiveWidth(30),
  },
  cover: {
    width: wp('100%'),
    height: hp('76.5%'),
    backgroundColor: colors.white,
    padding: 24,
    paddingVertical: 50,
    borderRadius: 50,
    elevation: 10.5,
    opacity: 8.15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    textAlign: 'left',
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Roboto-SemiBold',
    marginBottom: 40,
  },

  text: {
    width: 250,
    textAlign: 'center',
    color: 'gray',
    fontSize: responsiveFontSize(1.85),
    fontFamily: 'Roboto-Regular',
    opacity: 10,
    marginBottom: 50,
    alignSelf: 'center',
  },
  text1: {
    textAlign: 'center',
    color: 'gray',
    fontSize: responsiveFontSize(1.85),
    marginBottom: 10,

    fontFamily: 'Roboto-Right',
    opacity: 10,
  },
  btn: {
    backgroundColor: colors.black,
    width: wp('87%'),
    height: hp('7%'),
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    elevation: 0.05,
    justifyContent: 'center',
    marginBottom:10
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
});
export default PasswrodChange;
