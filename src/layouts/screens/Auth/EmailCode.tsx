/* eslint-disable jsx-quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
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
import {postMethod} from '../../../utils/helper';
import {ScrollView} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';
import ArrowIcon from '../../Component/ArrowIcon';

interface Props {}
const EmailCode: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const {email} = route.params;
  const [otp, setOtp] = useState('');

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
      newPassword: '',
    },
  });

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    ForgetPassword(data);
  };

  const ForgetPassword = async (props: any) => {
    const raw = {
      email: email,
      token: otp,
      newPassword: props.newPassword,
    };
    try {
      console.log(raw, 'raw');
      setLoading(true);
      const response: any = await postMethod('set-new-password', raw);
      if (response.status === 200) {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'LoginScreen',
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
              <Text style={styles.title}>Please Check Your Email</Text>
              <Text style={styles.text}>We’ve sent a code to {email}</Text>

              <OTPInputView
                pinCount={4}
                onCodeChanged={code => setOtp(code)}
                style={{marginTop: -385, marginBottom: 20}}
              />

              <View style={{marginTop: -395, marginBottom: 20}}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    minLength: 6,
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  }}
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      placeholder="New Password"
                      placeholderTextColor={colors.text_secondary}
                      underlineColor={colors.white}
                      value={value}
                      activeOutlineColor="gray"
                      outlineColor="white"
                      onChangeText={value => onChange(value)}
                      style={styles.textInput}
                      textColor="black"
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
                  name="newPassword"
                />
                {errors.newPassword &&
                  errors.newPassword.type === 'required' && (
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
                {errors.newPassword &&
                  errors.newPassword.type === 'minLength' && (
                    <View style={styles.row}>
                      <Feather
                        name="alert-circle"
                        size={9}
                        color="red"
                        style={styles.icon}
                      />
                      <Text style={styles.error}>
                        Password must include uppercase, lowercase, numeric, and
                        special characters, and be at least 8 characters long.
                      </Text>
                    </View>
                  )}
                {errors.newPassword &&
                  errors.newPassword.type === 'pattern' && (
                    <View style={styles.row}>
                      <Feather
                        name="alert-circle"
                        size={9}
                        color="red"
                        style={styles.icon}
                      />
                      <Text style={styles.error}>Password is invalid.</Text>
                    </View>
                  )}
              </View>
              <Pressable
                onPress={handleSubmit(onSubmit)}
                style={styles.btn}
                android_ripple={{color: 'white'}}>
                {loading ? (
                  <ActivityIndicator size={20} color={colors.white} />
                ) : (
                  <Text style={styles.btnText}>Verify</Text>
                )}
              </Pressable>

              <View>
                <Text style={styles.text1}>Send code again</Text>
              </View>
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
    marginVertical: responsiveWidth(30),
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
    color: colors.black,
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
export default EmailCode;
