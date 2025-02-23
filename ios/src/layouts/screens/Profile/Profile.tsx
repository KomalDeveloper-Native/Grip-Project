/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {FC} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {TextInput} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../style/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Controller, useForm} from 'react-hook-form';
import Snackbar from 'react-native-snackbar';
import {
  FormPostMethod,
  getStorageData,
  postMethod,
} from '../../../utils/helper';
import DocumentPicker from 'react-native-document-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Dropdown} from 'react-native-element-dropdown';
import Appbar from '../../Component/Appbar';
import ArrowIcon from '../../Component/ArrowIcon';

interface Props {}
const Profile: FC<Props> = ({navigation}: any): JSX.Element => {
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleFile, setSingleFile] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [data, setData] = useState<any>({});
  const [selectedGender, setSelectedGender] = useState<string | null>('');

  const option = [
    {label: 'Male', value: 'Value'},
    {label: 'Female', value: 'Female'},
    {label: 'Other', value: 'Other'},
  ];

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email_id: '',
      gender: '',
      phone_no: '',
      facebook: '',
      youtube: '',
      linkedin: '',
      instagram: '',
      birtday: '',
      address: '',
      about_me: '',
      language: '',
      skills: '',
    },
  });

  useEffect(() => {
    (async () => {
      const storage = await getStorageData();
      const id = storage.response.user.id;
      const response: any = await postMethod(`update-trainer-profile?id=${id}`);
      const data = response.data.data;
      console.log(data,'data')
      setData(data);
      setValue('first_name', data.first_name);
      setValue('last_name', data.last_name);
      setValue('email_id', data.email_id);
      setValue('gender', data.gender);
      setValue('phone_no', data.phone_no);
      setValue('facebook', data.facebook);
      setValue('youtube', data.youtube);
      setValue('linkedin', data.linkedin);
      setValue('instagram', data.instagram);
      setValue('address', data.address);
      setValue('about_me', data.about_me);
      setValue('language', data.language);
      setValue('skills', data.skills);
      setSelectedDate(data.birtday);
    })();
  }, []);

  const selectOneFile = async () => {
    console.log('laka');
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setSingleFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Canceled from single doc picker');
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const selectOneFiles = async () => {
    console.log('laka');
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setSelectedFiles(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Canceled from single doc picker');
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const handleConfirm = (date: Date) => {
    setDatePickerVisible(false);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setValue('birtday', formattedDate);
  };

  const onSubmit = async (data: any) => {
    return ProfileFun(data);
  };

  const ProfileFun = async (data: any) => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email_id', data.email_id);
      formData.append('gender', data.gender);
      formData.append('phone_no', data.phone_no);
      formData.append('facebook', data.facebook);
      formData.append('youtube', data.youtube);
      formData.append('linkedin', data.linkedin);
      formData.append('instagram', data.instagram );
      formData.append('birtday', selectedDate);
      formData.append('address', data.address );
      formData.append('about_me', data.about_me);
      formData.append('language', data.language);
      formData.append('skills', data.skills);
      formData.append('id', id);

      if (singleFile) {
        formData.append('profile_pic', {
          uri: singleFile.uri,
          type: singleFile.type,
          name: singleFile.name,
        });
      }
      if (selectedFiles) {
        formData.append('user_certificates', {
          uri: selectedFiles.uri,
          type: selectedFiles.type,
          name: selectedFiles.name,
        });
      }

      const response: any = await FormPostMethod(
        `update-trainer-profile?id=${id}`,
        formData,
      );

      if (response.data.status === 'success') {
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: '#7CA942',
        });

        navigation.reset({
          index: 0,
          routes: [{name: 'DrawerNavigation'}],
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      Snackbar.show({
        text: 'Profile update failed.',
        duration: 3000,
        textColor: colors.white,
        backgroundColor: 'red',
      });
    }
  };

  return (
    <>
      <ArrowIcon iconName={'arrow-back'} navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.text}>Profile Details</Text>
        <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView enabled>
          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <TextInput
                  placeholder="First Name"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  value={value}
                  style={styles.textInput}
                  textColor="black"
                />
              )}
              name="first_name"
            />
          </View>
          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <TextInput
                  placeholder="Last Name"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  value={value}
                  onChangeText={value => onChange(value)}
                  style={styles.textInput}
                  textColor="black"
                />
              )}
              name="last_name"
            />
          </View>

          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  value={value}
                  onChangeText={onChange}
                  style={styles.textInput}
                  textColor="black"
                />
              )}
              name="email_id"
            />
          </View>
          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <TextInput
                  placeholder="Phone"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  value={value}
                  onChangeText={onChange}
                  style={styles.textInput}
                  textColor="black"
                />
              )}
              name="phone_no"
            />
          </View>

          <Pressable
            onPress={() => setDatePickerVisible(true)}
            style={[
              styles.textrow,
              {
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(90),
                height: responsiveHeight(7),
                backgroundColor: colors.white,
                elevation: 1.5,
                borderBottomStartRadius: 15,
                borderTopLeftRadius: 15,
                borderBottomRightRadius: 15,
                borderTopEndRadius: 15,
                opacity: 55.15,
                paddingHorizontal: 15,
              },
            ]}>
            <Text style={{color: selectedDate ? 'black' : 'gray'}}>
              {selectedDate
                ? selectedDate
                : data.birtday
                ? data.birtday
                : 'Dob'}
            </Text>
          </Pressable>
          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <Dropdown
                  style={[styles.dropdown, isFocus]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.textInput}
                  iconStyle={styles.iconStyle}
                  selectText={data.gender}
                  selectTextStyle={data.gender}
                  data={option}
                  search={false}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  itemTextStyle={{
                    color: 'black',
                  }}
                  placeholder={!isFocus ? data.gender : data.gender}
                  value={value ?? data.gender}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    onChange(item.value);
                    setIsFocus(false);
                  }}
                />
              )}
              name="gender"
            />
          </View>
          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholder="Language"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  value={value}
                  onChangeText={value => onChange(value)}
                  style={styles.textInput}
                  textColor="black"
                />
              )}
              name="language"
            />
          </View>
          <View style={styles.textrow}>
            <Controller
              control={control}
        
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholder="Skills"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  value={value}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  onChangeText={value => onChange(value)}
                  style={styles.textInput}
                  textColor="black"
                />
              )}
              name="skills"
            />
          </View>
          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <TextInput
                  placeholder="About me"
                  multiline
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  value={value}
                  onChangeText={onChange}
                  style={[styles.textInput]}
                  textColor="black"
                />
              )}
              name="about_me"
            />
          </View>
          <Text style={styles.text}>Certificate </Text>

          <Pressable
            onPress={() => selectOneFiles()}
            style={[
              styles.textrow,
              {
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(90),

                height: responsiveHeight(7),
                backgroundColor: colors.white,
                elevation: 1.5,
                borderBottomStartRadius: 15,
                borderTopLeftRadius: 15,
                borderBottomRightRadius: 15,
                borderTopEndRadius: 15,
                opacity: 55.15,
                paddingHorizontal: 15,
              },
            ]}>
            <Text style={{color:selectedFiles?'black':'gray'}}>
              {selectedFiles
                ? selectedFiles.name
                : data.user_certificates
                ? data.user_certificates
                : 'Upload Certificates'}
            </Text>
          </Pressable>

          <Text style={styles.text}>Locations</Text>
          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <TextInput
                  placeholder="Entre Location"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  value={value}
                  onChangeText={onChange}
                  style={[styles.textInput]}
                  textColor="black"
                />
              )}
              name="address"
            />
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisible(false)}
          />
          <Text style={styles.text}>Select Profile Photo</Text>
          <Pressable
            onPress={() => selectOneFile()}
            style={[
              styles.textrow,
              {
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                width: responsiveWidth(90),

                height: responsiveHeight(7),
                backgroundColor: colors.white,
                elevation: 1.5,
                borderBottomStartRadius: 15,
                borderTopLeftRadius: 15,
                borderBottomRightRadius: 15,
                borderTopEndRadius: 15,
                opacity: 55.15,
                paddingHorizontal: 15,
              },
            ]}>
            <Text style={{color: singleFile?'black':'gray'}}>
              {singleFile
                ? singleFile.name
                : data.profile_pic
                ? data.profile_pic
                : 'Upload Photot'}
            </Text>
          </Pressable>

          <Text style={styles.text}>Social links</Text>

          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholder="Facebook"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  style={styles.textInput}
                  value={value}
                  onChangeText={value => onChange(value)}
                  textColor="black"
                />
              )}
              name="facebook"
            />
          </View>
          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholder="youtube"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  style={styles.textInput}
                  value={value}
                  onChangeText={value => onChange(value)}
                  textColor="black"
                />
              )}
              name="youtube"
            />
          </View>
          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholder="Linkedin"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  style={styles.textInput}
                  value={value}
                  onChangeText={value => onChange(value)}
                  textColor="black"
                />
              )}
              name="linkedin"
            />
          </View>

          <View style={styles.textrow}>
            <Controller
              control={control}
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholder="Instagram"
                  placeholderTextColor={colors.gray}
                  underlineColor={colors.white}
                  activeOutlineColor="gray"
                  outlineColor="white"
                  style={styles.textInput}
                  value={value}
                  onChangeText={value => onChange(value)}
                  textColor="black"
                />
              )}
              name="instagram"
            />
          </View>
          <Pressable
            style={[styles.btn, loading && styles.loading]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}>
            <Text style={styles.btnText}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Text>
          </Pressable>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  text: {
    width: responsiveWidth(90),

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2.2),
    marginBottom: 10,
    alignSelf: 'center',
  },
  textInput: {
    width: responsiveWidth(90),
    height: responsiveHeight(7),
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    marginBottom: 5,
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    // borderWidth: 0.1,
    overflow: 'hidden',
    borderRightColor: 'white',
    // borderColor: 'white',
    alignSelf: 'center',
  },
  textInput1: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
  },
  textInput0: {
    width: responsiveWidth(90),
    paddingBottom: 50,
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    // marginBottom: 10,
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    // borderWidth: 0.1,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRightColor: 'white',
    // borderColor: 'white',
  },

  textrow: {
    marginBottom: 15,
  },
  errorInput: {
    borderColor: 'red',
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
  dropdown: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 15,
    elevation: 2,
    alignSelf: 'center',
    color: 'black',
    marginBottom: 5,
  },
  dropdownButtonText: {
    textAlign: 'left',
    color: 'black',
  },
  dropdownRowText: {
    textAlign: 'left',
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
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
});

export default Profile;
