/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import {Controller, useForm} from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import {TextInput} from 'react-native-paper';
import colors from '../../style/colors';
import Snackbar from 'react-native-snackbar';
import {CommonActions} from '@react-navigation/native';
import {postMethod, storeData} from '../../../utils/helper';
import {ScrollView} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';
import ArrowIcon from '../../Component/ArrowIcon';

interface Props {}
const OtpVerification: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const {phone_no} = route.params;
  const [otp, setOtp] = useState('');
  const otpRef = useRef(null);

  useEffect(() => {
    // Automatically focus the first input when the component mounts
    otpRef.current?.focus();
  }, []);

  const handleFocus = () => {
    // Focus on the OTP input when clicked
    otpRef.current?.focus();
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const OtpLogin = async () => {
    const raw = {
      otp_code: otp,
      phone_no: phone_no,
    };
    try {
      console.log(raw, 'raw');
      setLoading(true);
      const response: any = await postMethod('verify-otp', raw);
      // console.log(response.data);

      if (response.data.status === true) {
        console.log(response.data);
        await storeData(response.data);  
        navigation.dispatch(
          CommonActions.navigate({
            name: 'DrawerNavigation',
          }),
        );
      } else {
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  return (
    <>
      <ArrowIcon iconName={'arrow-back'} navigation={navigation} />

      <View style={styles.container}>
        <View>
          <Image
            source={require('../../img/one.jpeg')}
            style={styles.logoImage}
          />
        </View>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView enabled>
            <View style={styles.cover}>
              <Text style={styles.title}>OTP Verification</Text>
              <Text style={styles.text}>Enter OTP Sent to +{phone_no}</Text>

              <OTPInputView
                pinCount={6}
                code={otp}
                onCodeChanged={code => setOtp(code)}
                // autoFocusOnLoad
                autoFocusOnLoad={false}
                editable={true}
                // clearInputs={true}
                style={{marginTop: -395, marginBottom: 30}}
                codeInputFieldStyle={{ borderWidth: 1, borderColor: '#000' }}
                codeInputHighlightStyle={{ borderColor: '#03DAC6' }}
              />

              <View style={{marginTop: -395, marginBottom: 40}}>
                <Pressable
                  onPress={() => navigation.navigate('ResendOtpScreen')}>
                  <Text style={styles.text1}>Resend OTP</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => OtpLogin()}
                style={styles.btn}
                android_ripple={{color: 'white'}}>
                {loading ? (
                  <ActivityIndicator size={20} color={colors.white} />
                ) : (
                  <Text style={styles.btnText}>Verify Otp</Text>
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logoImage: {
    width: responsiveWidth(40),
    height: responsiveHeight(15),
    alignSelf: 'center',
    marginVertical: responsiveWidth(20),
  },
  cover: {
    width: wp('100%'),
    height: hp('76.5%'),
    backgroundColor: colors.white,
    padding: 24,
    // paddingVertical: 50,
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
    marginBottom: 5,
    fontFamily: 'Roboto-SemiBold',
  },

  text: {
    textAlign: 'left',
    color: 'gray',
    fontSize: responsiveFontSize(1.65),
    fontFamily: 'Roboto-Light',
    opacity: 10,
  },
  text1: {
    textAlign: 'center',
    fontSize: responsiveFontSize(1.85),
    marginBottom: 10,
    opacity: 10,
    color: 'black',
    fontFamily: 'Roboto-Medium',
    textDecorationLine: 'underline',
  },

  textInput: {
    width: responsiveWidth(89),
    height: responsiveHeight(7),
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    // marginTop:-312,
    marginBottom: 20,
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0.1,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRightColor: 'white',
    borderColor: 'gray',
  },

  row: {
    flexDirection: 'row',
    width: responsiveWidth(89),
    alignSelf: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 4,
    marginTop: -3,
  },
  error: {
    width: 330,
    color: 'red',
    fontSize: 10,
    marginTop: -5,
    marginBottom: 5,
  },
  btn: {
    backgroundColor: colors.black,
    width: wp('87%'),
    height: hp('7%'),
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    // marginTop: -280,
    borderRadius: 8,
    elevation: 0.05,
    justifyContent: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
});
export default OtpVerification;
