/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, Icon} from 'react-native-elements';
import {
  FormPostMethod,
  getStorageData,
  postMethod,
} from '../../../utils/helper';
import {Controller, useForm} from 'react-hook-form';
import {TextInput} from 'react-native-paper';
import {Pressable} from 'react-native';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import ArrowIcon from '../../Component/ArrowIcon';
import DocumentPicker from 'react-native-document-picker';
import {Dropdown} from 'react-native-element-dropdown';
import Snackbar from 'react-native-snackbar';

interface Props {}
export const JobApplyScreen: FC<Props> = ({route, navigation}): JSX.Element => {
  navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [franchise, setFranchise] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [isFocus, setIsFocus] = useState(false);
  const {jobid, loginUser, apply} = route.params;
  const data = [
    {label: 'Full-Time', value: 'Full-Time'},
    {label: 'Part-Time', value: 'Part-Time'},
  ];
  useMemo(async () => {
    const storage = await getStorageData();
    console.log(storage.response.user, 'ste');
    setUserData(storage.response.user);
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      message: '',
      current_salary: '',
      year_of_experience: '',
      job_type: '',
      attachment: '',
    },
  });
  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    fetchFrachise(data);
  };

  const selectOneFiles = async () => {
    console.log('laka');
    try {
      const res = await DocumentPicker.pickSingle({
        type: [
          DocumentPicker.types.images, // For image files
          DocumentPicker.types.pdf,    // For PDF files
        ],
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

  const fetchFrachise = async data => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('loginuser', userData.id);
      formData.append('job_id', jobid);
      formData.append('job_type', data.job_type);
      formData.append('message', data.message);
      formData.append('current_salary', data.current_salary);
      formData.append('year_of_experience', data.year_of_experience);
      if (selectedFiles) {
        formData.append('attachment', {
          uri: selectedFiles.uri,
          type: selectedFiles.type,
          name: selectedFiles.name,
        });
      } else {
        console.error('No file selected');
      }
      console.log(formData, 'ff');
      const response: any = await FormPostMethod('job-apply', formData);
      if (response.status === 200) {
        console.log(response.data, 'res0');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'JobScreen',

                params: {
                  jobid: jobid,
                  loginUser: loginUser,
                  apply: apply,
                },
              },
            ], // Replace with your desired route
          }),
        );

        Snackbar.show({
          text: response.data.message,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        setLoading(false);
      } else {
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ArrowIcon navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>Apply job for the post of Yoga Trainer</Text>

        <Text style={styles.title1}>
          {userData.first_name} {userData.current_salary}
        </Text>
        <Text style={styles.title1}>{userData.email}</Text>
        <Text style={styles.title1}>{userData.phone_number}</Text>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View>
            <KeyboardAvoidingView enabled>
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Total years of experience"
                    style={styles.textInput}
                    keyboardType="number-pad"
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="year_of_experience"
              />
              {errors.year_of_experience && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>This field is required.</Text>
                </View>
              )}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Current salary"
                    keyboardType="number-pad"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="current_salary"
              />
              {errors.current_salary && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>This field is required.</Text>
                </View>
              )}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    style={[styles.dropdown, isFocus]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.textInput}
                    iconStyle={styles.iconStyle}
                    data={data}
                    search={false}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    itemTextStyle={{
                      color: 'black',
                    }}
                    placeholder={!isFocus ? 'Job Type' : 'Job Type'}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      onChange(item.value);
                      setIsFocus(false);
                    }}
                  />
                )}
                name="job_type"
              />
              {errors.job_type && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>This field is required.</Text>
                </View>
              )}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Message"
                    style={styles.textInput0}
                    // multiline
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="message"
              />
              {errors.message && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>This field is required.</Text>
                </View>
              )}
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
                <Text style={{color: selectedFiles ? 'black' : 'black'}}>
                  {selectedFiles ? selectedFiles.name : 'Upload Resume'}
                </Text>
              </Pressable> 
              {selectedFiles === null && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>This field is required.</Text>
                </View>
              )}
            </KeyboardAvoidingView>
          </View>
          <Pressable style={styles.btn} onPress={handleSubmit(onSubmit)}>
            {loading ? (
              <ActivityIndicator size={20} color="black" />
            ) : (
              <Text style={styles.btnText}>Submit</Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    // alignItems: 'flex-start',
  },
  title: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Black',
    fontSize: responsiveFontSize(2.5),
    color: colors.black,
    marginTop: 0,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  title1: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2.2),
    color: colors.black,
    marginBottom: 10,
    alignSelf: 'center',
  },
  textInput: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 1,
    marginBottom: 15,
    borderRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: 0,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  textInput0: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 2,
    marginBottom: 15,
    borderRadius: 10,
    paddingBottom: 50,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  dropdown: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    marginBottom: 15,
    alignSelf: 'center',
    color: 'black',
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
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 12,
    marginBottom: 10,
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
    width: responsiveWidth(35),
    height: responsiveHeight(6.5),
    backgroundColor: 'white',
    elevation: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  btnText: {
    color: 'black',
    fontSize: 18,
  },
  textrow: {
    marginBottom: 15,
  },
});
