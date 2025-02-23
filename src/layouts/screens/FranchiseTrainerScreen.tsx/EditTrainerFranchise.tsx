/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, Icon} from 'react-native-elements';
import {getStorageData, postMethod} from '../../../utils/helper';
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
import {useNavigation} from 'react-day-picker';
import Snackbar from 'react-native-snackbar';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';

interface Props {}
export const EditTrainerFranchise: FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  //  navigation= useNavigation()
  const [loading, setLoading] = useState(false);
  const [franchise, setFranchise] = useState([]);
  const [userData, setUserData] = useState([]);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const [isFocus, setIsFocus] = useState(false);
  const {franchiseData} = route.params;
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      title:'',
      year_of_establishment: '',
      space_required: '',
      investment_required: '',
      business_details: '',
      services_offerings: '',
    },
  });
  const currentYear = new Date().getFullYear();
  const startYear = 1980;
  const years = Array.from({length: currentYear - startYear + 1}, (_, i) => ({
    label: (startYear + i).toString(),
    value: startYear  + i,
  }));
 
  useEffect(() => {
    console.log(franchiseData, 'kk');
    setValue('title', franchiseData.title);
    setValue('year_of_establishment', franchiseData.year_of_establishment);
    setValue('space_required', franchiseData.space_required);
    setValue('investment_required', franchiseData.investment_required);
    setValue('business_details', franchiseData.business_details);
    setValue('services_offerings', franchiseData.services_offerings);

    // Set the selectedYear state to the year_of_establishment value
    setSelectedYear(franchiseData.year_of_establishment || currentYear);
  }, [franchiseData, setValue, currentYear]);

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    fetchFrachise(data);
  };

  const handleConfirm = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const fetchFrachise = async data => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    setLoading(true);
    try {
      const row = {
        user_id: id,
        title: data.title,
        year_of_establishment: data.year_of_establishment,
        business_details: data.business_details,
        space_required: data.space_required,
        investment_required: data.investment_required,
        services_offerings: data.services_offerings,
      };
      console.log(row, 'row');
      const response: any = await postMethod(
        `franchise-update-by-user?id=${franchiseData.id}`,
        row,
      );
      if (response.status === 200) {
        console.log(response.data, 'res0');
        Snackbar.show({
          text: response.data.message,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        navigation.navigate('FranchiseTrainerScreen');
      } else {
        Snackbar.show({
          text: response.data.message,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const [open, setOpen] = useState(false);
  return (
    <>
      <ArrowIcon navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>Edit Franchise</Text>

        <ScrollView keyboardShouldPersistTaps="handled">
          <View>
            <KeyboardAvoidingView enabled>
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Title"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="title"
              />
              {errors.title && (
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
                  <View
                    style={{
                      width: responsiveWidth(90),
                      height: 50,
                      borderWidth: 0.4,
                      alignSelf: 'center',
                      borderEndWidth: 0.4,
                      borderBottomWidth: 0.4,
                      marginBottom: 20,
                    }}>
                    <RNPickerSelect
                      placeholder={{label: 'Select Year', value: null}}
                      items={years}
                      style={{
                        inputIOS: {
                          height: 50,
                          backgroundColor: 'white',
                          color: 'black',
                          marginBottom: 15,
                          borderWidth: 0.4,
                          borderColor: 'black',
                          borderRadius: 50,
                          paddingHorizontal: 10,
                          paddingVertical: 12,
                          elevation: 0.4,
                        },
                        inputAndroid: {
                          width: responsiveWidth(90),
                          height: 50,
                          backgroundColor: 'white',
                          color: 'black',
                          marginBottom: 15,
                          borderWidth: 0.4,
                          borderColor: 'black',
                          borderRadius: 50,
                          borderEndWidth: 1,
                          paddingHorizontal: 10,
                          alignSelf: 'center',
                          elevation: 2,
                        },
                        placeholder: {
                          color: 'black',
                        },
                      }}
                      pickerProps={{
                        accessibilityLabel: selectedYear,
                      }}
                      value={value}
                      onValueChange={onChange}
                    />
                  </View>
                )}
                name="year_of_establishment"
              />

              {errors.year_of_establishment && (
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
                    placeholder="Area Required"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="space_required"
              />
              {errors.space_required && (
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
                    placeholder="Investment Required"
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
                name="investment_required"
              />
              {errors.investment_required && (
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
                    placeholder="Services Offerings"
                    style={styles.textInput}
                    underlineColor="white"
                    outlineColor="white"
                    textColor="black"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={'black'}
                  />
                )}
                name="services_offerings"
              />
              {errors.services_offerings && (
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
                    placeholder="Enter Franchise Details"
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
                name="business_details"
              />
              {errors.business_details && (
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
    // elevation: 1,
    marginBottom: 15,
    paddingBottom: 0,
    justifyContent: 'flex-start',
    alignSelf: 'center',
    borderWidth: 0.4,
    borderRadius:10,
    borderTopStartRadius:10,
    borderBottomEndRadius:10,
  },
  textInput0: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    // elevation: 2,
    marginBottom: 15,
    borderRadius: 10,
    paddingBottom: 50,
    justifyContent: 'flex-start',
    alignSelf: 'center',
    borderWidth: 0.4,
    borderTopStartRadius:10,
    borderBottomEndRadius:10,
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
});
