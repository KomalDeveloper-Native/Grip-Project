/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Keyboard,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {TextInput} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {postMethod} from '../../../../utils/helper';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import colors from '../../../style/colors';
import {useSelector, useDispatch} from 'react-redux';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setStatus} from '../../../../Redux/ListSlice ';
import CourseScreen from '../CourseList/CourseScreen';

interface Props {}
const AddSubscription: FC<Props> = ({navigation, route}): JSX.Element => {
  const dispatch = useDispatch();
  const [isFocus, setIsFocus] = useState(false);
  const {lead_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPaymentDate, setSelectedPaymentDate] = useState('');
  const [isPaymentDatePickerVisible, setPaymentDatePickerVisible] =
    useState(false);
  const [feeType, setFeeType] = useState(''); // New state to track feeType selection
  const trainerId = useSelector(state => state.List.id);
  const [update, setUpdate] = useState([]);
  const colorScheme = useColorScheme();
  const datePickerColor = colorScheme === 'dark' ? 'gray' : 'gray';
  const isDarkMode = useColorScheme() === 'dark';

  const data = [
    {label: 'Paid', value: 'Paid'},
    {label: 'Unpaid', value: 'Unpaid'},
  ];

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      fee: '',
      feeType: '',
      feeDate: '',
      payment_date: '',
    },
  });

  const handleConfirm = date => {
    setDatePickerVisible(false);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setValue('feeDate', formattedDate);
  };

  const handlePaymentDateConfirm = date => {
    setPaymentDatePickerVisible(false);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    setSelectedPaymentDate(formattedDate);
    setValue('payment_date', formattedDate);
  };

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    updateStatus(data);
  };

  const updateStatus = async (data: {fee: any; feeType: any; feeDate: any}) => {
    setLoading(true);
    const row = {
      id: lead_id,
      fee: data.fee,
      feeType: data.feeType,
      feeDate: data.feeDate,
      status: 2,
    };
    console.log(row,'row')

    try {
      const response: any = await postMethod('leadto-suscription', row);
      if (response.data.success === true) {
        console.log(response.data);
        dispatch(setStatus(2));
        navigation.dispatch(
          CommonActions.navigate({
            name: 'TopNavigation',
            params: {
              courseid: null,
              screen: 'SubscriptionList',
            },
          }),
        );
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatestatusFun = async id => {
    setLoading(true);
    try {
      const row = {
        status: id,
      };
      const response: any = await postMethod(
        `update-lead-status?id=${lead_id}`,
        row,
      );

      console.log(response.data, 'data');
      if (response.data.success === true) {
        // setLead(response.data.lead);
        setUpdate(response.data.status);
        console.log(response.data.status, 'ds');
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Icon
        name="arrow-back"
        size={25}
        type="material"
        style={{marginBottom: 20}}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>Add Subscription</Text>

      <Controller
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Entry Fee"
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
        name="fee"
      />
      {errors.fee && (
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
            placeholder={
              !isFocus ? 'Select Payment Status' : 'Select Payment Status'
            }
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              onChange(item.value);
              setIsFocus(false);
              setFeeType(item.value); // Set the feeType state
            }}
          />
        )}
        name="feeType"
      />
      {errors.feeType && (
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

      {feeType === 'Paid' && ( // Conditionally render Payment Date picker
        <>
          <Controller
            control={control}
            rules={{required: true}} // Make it required when feeType is "Paid"
            render={({field: {onChange}}) => (
              <TextInput
                placeholder="Select Payment Date"
                style={styles.textInput}
                textColor="black"
                underlineColor="white"
                outlineColor="white"
                value={selectedPaymentDate}
                onChangeText={onChange}
                placeholderTextColor={'black'}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="calendar"
                    size={20}
                    onPress={() => setPaymentDatePickerVisible(true)}
                  />
                }
              />
            )}
            name="payment_date"
          />
          {errors.payment_date && (
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
        </>
      )}

      <Controller
        control={control}
        rules={{required: true}}
        render={({field: {onChange}}) => (
          <TextInput
            placeholder="Enter Date"
            style={styles.textInput}
            textColor="black"
            underlineColor="white"
            outlineColor="white"
            value={selectedDate}
            onChangeText={onChange}
            placeholderTextColor={'black'}
            editable={false}
            right={
              <TextInput.Icon
                icon="calendar"
                size={20}
                onPress={() => setDatePickerVisible(true)}
              />
            }
          />
        )}
        name="feeDate"
      />
      {errors.feeDate && (
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

      <Pressable style={styles.btn} onPress={handleSubmit(onSubmit)}>
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : (
          <Text style={styles.btnText}>Submit</Text>
        )}
      </Pressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisible(false)}
        minimumDate={new Date()}
        colorPrimaryDark
        customConfirmButtonIOS={{color: '#FFFFFF', fontWeight: 'bold'}}
        customCancelButtonIOS={{color: '#FFFFFF', fontSize: 16}}

        // customConfirmButtonIOS={{
        //   color: '#FFFFFF',
        // }}
        // customCancelButtonIOS={{
        //   color: '#FFFFFF',
        // }}
      />

      <DateTimePickerModal
        isVisible={isPaymentDatePickerVisible}
        minimumDate={new Date()}
        mode="date"
        onConfirm={handlePaymentDateConfirm}
        onCancel={() => setPaymentDatePickerVisible(false)}
        themeVariant={isDarkMode ? 'dark' : 'light'} // Ensure visibility by theme
        textColor={isDarkMode ? '#FFFFFF' : '#000000'} // Ensure text is visible
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'flex-start',
  },
  title: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Black',
    fontSize: responsiveFontSize(2.5),
    color: colors.black,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  textInput: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 2,
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
    paddingBottom: 0,
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
});

export default AddSubscription;
