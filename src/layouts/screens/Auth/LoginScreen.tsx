/* eslint-disable jsx-quotes */
/* eslint-disable no-dupe-keys */
/* eslint-disable quotes */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, {FC, useState} from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Keyboard,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import colors from '../../style/colors';
import {Controller, useForm} from 'react-hook-form';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CommonActions} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {postMethod, storeData} from '../../../utils/helper';

const {width} = Dimensions.get('window');
interface Props {
  navigation: any;
}

const LoginScreen: FC<Props> = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const [isUsernameFocused, setUsernameFocused] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };
  // use React Hook Form
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    LogIn(data);
  };

  const LogIn = async (props: any) => {
    const apiResponse = {
      data: {
        status: false,
        message: 'Incorrect Email and Password',
      },
    };
    const raw = {
      username: props.username,
      password: props.password,
    };
    try {
      setLoading(true);
      const response: any = await postMethod('login', raw);
      if (response.data.status === true) {
        await storeData(response.data);
        // await auth().signInWithEmailAndPassword(email, password);

        navigation.reset({
          index: 0,
          routes: [{name: 'DrawerNavigation'}],
        });
      } else {
        Snackbar.show({
          text: apiResponse.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error', apiResponse.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require('../../img/one.jpeg')}
          style={styles.logoImage}
        />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.cover}>
          <KeyboardAvoidingView enabled>
            <View style={styles.coverText}>
              <View style={styles.textRow}>
                <Text style={styles.label}>Username</Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  }}
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      placeholderTextColor={colors.black}
                      underlineColor={colors.white}
                      value={value}
                      activeOutlineColor="gray"
                      outlineColor="white"
                      onChangeText={value => onChange(value)}
                      style={styles.textInput}
                      textColor="black"
                    />
                  )}
                  name="username"
                />
                {errors.username && errors.username.type === 'required' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>username is required.</Text>
                  </View>
                )}
                {errors.username && errors.username.type === 'pattern' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>username is not valid.</Text>
                  </View>
                )}
              </View>
              <View style={styles.textRow}>
                <Text style={styles.label}>Password</Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,

                  }}
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      placeholderTextColor={colors.black}
                      underlineColor={colors.white}
                      value={value}
                      activeOutlineColor="gray"
                      outlineColor="white"
                      onChangeText={value => onChange(value)}
                      style={styles.textInput}
                      textColor="black"
                      secureTextEntry={!isPasswordVisible}
                      // keyboardType="visible-password"
                      // returnKeyType="next"
                      right={
                        <TextInput.Icon
                          icon={isPasswordVisible ? 'eye' : 'eye-off'}
                          size={20}
                          onPress={togglePasswordVisibility}
                        />
                      }
                    />
                  )}
                  name="password"
                />
                {errors.password && errors.password.type === 'required' && (
                  <View style={styles.row}>
                    <Feather
                      name="alert-circle"
                      size={9}
                      color="red"
                      style={styles.icon}
                    />
                    <Text style={styles.error}>Password is required.</Text>
                  </View>
                )}
                     {errors.password && errors.password.type === 'minLength' && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>
                    Password must be at least 8 characters long.
                  </Text>
                </View>
              )}
           
         
              </View>
            </View>
            <Pressable onPress={() => navigation.navigate('ForgetPassword')}>
              <Text style={styles.forgotBox}>Forgot Password</Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={styles.btn}
              android_ripple={{color: 'white'}}>
              {loading ? (
                <ActivityIndicator size={20} color={colors.white} />
              ) : (
                <Text style={styles.btnText}>Login Now</Text>
              )}
            </Pressable>
            <View>
              <Text style={styles.Text}>Or</Text>
            </View>
            <Pressable
              onPress={()=>navigation.navigate('OtpLoginScreen')}
              style={styles.btn}
              android_ripple={{color: 'white'}}>
         
                <Text style={styles.btnText}>Login with Otp</Text>
            </Pressable>
       
{/*  */}
            {/* <View style={styles.LoginRow0}>
              <Icon name="google" style={[styles.icon0, styles.googleIcon]} />
              <Icon name="apple" style={[styles.icon0, styles.appleIcon]} />
              <Icon
                name="facebook"
                style={[styles.icon0, styles.facebookIcon]}
              />
            </View> */}
            <View style={styles.LoginRow}>
              <Text style={styles.btnText0}>Don’t have an account ? </Text>
              <Pressable
                android_ripple={{color: 'white'}}
                onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.btnText1}>Register Now</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;
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
    marginVertical: responsiveWidth(10),
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
  coverText: {
    height: responsiveHeight(27),
  },

  textRow: {
    marginBottom: 8,
  },
  label: {
    color: colors.black,
    fontSize: 17,
    marginBottom: 2,
    fontFamily: 'Roboto-Medium',
  },
  textInput: {
    width: responsiveWidth(86.5),
    height: responsiveHeight(7),
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    marginBottom: 10,
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0.1,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRightColor: 'white',
    borderColor: 'gray',
  },

  forgotBox: {
    textAlign: 'right',
    color: 'black',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 5,
  },
  textInputFocused: {
    borderColor: colors.bg_green,
  },
  errorInput: {
    borderColor: 'red',
  },

  row: {
    width: responsiveWidth(86.5),
    flexDirection: 'row',
    marginLeft: 12,
  },
  icon: {
    marginRight: 4,
    marginTop: -3,
  },
  error: {
    width: 280,
    color: 'red',
    fontSize: 10,
    marginTop: -5,
    // marginBottom
  },
  btn: {
    backgroundColor: colors.black,
    width: wp('87%'),
    height: hp('7%'),
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 20,
    borderRadius: 8,
    elevation: 0.05,
    marginBottom: 15,
    justifyContent: 'center',
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },

  Text: {
    color: colors.black,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    textAlign: 'center',
  },
  icon0: {
    fontSize: 50,
  },
  LoginRow0: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    // alignSelf:"center",
  },
  googleIcon: {
    color: '#4285F4',
  },
  appleIcon: {
    color: '#000000',
  },
  facebookIcon: {
    color: '#3b5998',
  },

  LoginRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignSelf: 'center',
  },
  btnText0: {
    color: colors.gray,
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
  },
  btnText1: {
    color: colors.black,
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    textDecorationLine: 'underline',
  },
});
