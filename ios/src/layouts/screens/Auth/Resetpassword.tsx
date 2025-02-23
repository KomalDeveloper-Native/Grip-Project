/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {FC} from 'react';
import {Image, Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
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
import Snackbar from 'react-native-snackbar';
import {Controller, useForm} from 'react-hook-form';
import {CommonActions} from '@react-navigation/native';
import {getStorageData, postMethod} from '../../../utils/helper';
import Feather from 'react-native-vector-icons/Feather';

interface Props {}
const Resetpassword: FC<Props> = ({navigation}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [isold_passwordFocused, setold_passwordFocused] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      old_password: '',
      new_password: '',
    },
  });

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    ForgetPassword(data);
  };

  const ForgetPassword = async (props: any) => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    const raw = {
      user_id:id,
      old_password: props.old_password,
      new_password: props.new_password,

    };
    try {
      setLoading(true);
      const response: any = await postMethod('change-password', raw);
      if (response.status === 200) {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'HomeScreen',
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
    <View style={styles.container}>
      <View>
        <Image
          source={require('../../img/one.jpeg')}
          style={styles.logoImage}
        />
      </View>
      <View style={styles.cover}>
        <Text style={styles.title}>Reset Password</Text>
        <View>
          <Text style={styles.text}>Please type something you’ll remenber</Text>
          <Text style={styles.label}>Old Password</Text>
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
                activeOutlineColor="gray"
                outlineColor="white"
                style={styles.textInput}
                textColor="black"
                placeholder="Old password"
                secureTextEntry={!isPasswordVisible}
                right={
                  <TextInput.Icon
                    icon={isPasswordVisible ? 'eye' : 'eye-off'}
                    size={20}
                    onPress={togglePasswordVisibility}
                  />
                }
              />
            )}
            name="old_password"
          />
          {errors.old_password && errors.old_password.type === 'required' && (
            <View style={styles.row}>
              <Feather
                name="alert-circle"
                size={9}
                color="red"
                style={styles.icon}
              />
              <Text style={styles.error}>old_password is required.</Text>
            </View>
          )}
          <Text style={styles.label}>New Password</Text>
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
                activeOutlineColor="gray"
                outlineColor="white"
                style={styles.textInput}
                textColor="black"
                placeholder="New password"
                secureTextEntry={!isPasswordVisible}
                right={
                  <TextInput.Icon
                    icon={isPasswordVisible ? 'eye' : 'eye-off'}
                    size={20}
                    onPress={togglePasswordVisibility}
                  />
                }
              />
            )}
            name="new_password"
          />
          {errors.new_password && errors.new_password.type === 'required' && (
            <View style={styles.row}>
              <Feather
                name="alert-circle"
                size={9}
                color="red"
                style={styles.icon}
              />
              <Text style={styles.error}>New Password is required.</Text>
            </View>
          )}
        </View>
        <Pressable style={styles.btn} onPress={()=>handleSubmit(onSubmit)}>
          <Text style={styles.btnText}>Reset Password</Text>
        </Pressable>
        <View style={styles.LoginRow}>
          <Text style={styles.btnText0}>Already Have a Account ?</Text>
          <Pressable
            android_ripple={{color: 'white'}}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.btnText1}>Login Now</Text>
          </Pressable>
        </View>
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
  title: {
    textAlign: 'left',
    color: 'black',
    fontSize: responsiveFontSize(2.5),
    marginBottom: 5,
    fontFamily: 'Roboto-SemiBold',
  },
  label: {
    color: colors.black,
    fontSize: 17,
    marginBottom: 2,
    fontFamily: 'Roboto-Medium',
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
    marginBottom: 30,
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0.1,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRightColor: 'white',
    borderColor: 'gray',
  },
  LoginRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignSelf: 'center',
  },
  btnText0: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
  },
  btnText1: {
    color: colors.black,
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    textDecorationLine: 'underline',
  },
  text: {
    textAlign: 'left',
    color: 'gray',
    fontSize: responsiveFontSize(1.65),
    marginBottom: 10,
    fontFamily: 'Roboto-Light',
    opacity: 10,
  },
  text1: {
    textAlign: 'center',
    color: 'black',
    fontSize: responsiveFontSize(1.9),
    marginBottom: 10,
    fontFamily: 'Roboto-Right',
    opacity: 10,
  },
  text2: {
    width: 190,
    textAlign: 'center',
    color: 'black',
    fontSize: responsiveFontSize(1.9),
    marginBottom: 10,
    fontFamily: 'Roboto-Right',
    opacity: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
    marginLeft: 12,
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
    marginBottom: 45,
    justifyContent: 'center',
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
});
export default Resetpassword;
