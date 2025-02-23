/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable quotes */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import {Avatar} from '@rneui/themed';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import {Icon} from 'react-native-elements';
import colors from '../../../style/colors';
import {getMethod, getStorageData, postMethod} from '../../../../utils/helper';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setStatus, setUpdateStatus} from '../../../../Redux/ListSlice ';
import {Controller, useForm} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import {TextInput} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {MouseButton, ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import MenuPop from './RejoinScreen';

interface Props {}
const MarkFees: FC<Props> = ({navigation}): JSX.Element => {
  const route = useRoute();
  const {suscription_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<number | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [suscription, setSuscription] = useState([]);
  const [message, setMessage] = useState(null);
  useFocusEffect(
    useCallback(() => {
      suscriptionLisfun();
      suscriptionHistory();
    }, [suscription_id, suscription]),
  );

  const suscriptionLisfun = async () => {
    setLoading(true);
    try {
      const response: any = await getMethod(
        `suscription-detail?suscription_id=${suscription_id}`,
      );
      if (response.status === 200) {
        console.log(response.data.subscription);
        setSuscription(response.data.subscription);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const suscriptionHistory = async () => {
    setLoading(true);
    try {
      const storage = await getStorageData();
      console.log(storage.response.user.id, suscription_id, 'storage');
      const row = {
        suscription_id: suscription_id,
      };
      const response: any = await postMethod('suscription-history', row);
      if (response.status === 200) {
        console.log(response.data, 'history');
        setHistory(response.data.history);
        setMessage(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      paid_amount: '',
      paid_date: '',
      due_amount: '',
      due_date: '',
    },
  });

  const handleConfirm = (date: {
    getFullYear: () => any;
    getMonth: () => number;
    getDate: () => {(): any; new (): any; toString: {(): string; new (): any}};
  }) => {
    setDatePickerVisible(false);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setValue('paid_date', formattedDate);
    setValue('due_date', formattedDate);
  };

  const onSubmit = async (data: any) => {
    if (suscription.subscription_type === 'Paid') {
      dueStatus(data);
    } else {
      updateStatus(data);
    }
    Keyboard.dismiss();
  };

  const updateStatus = async (data: {paid_amount: any; paid_date: any}) => {
    setLoading(true);

    const row = {
      suscription_id: suscription_id,
      paid_amount: data.paid_amount,
      paid_date: data.paid_date,
    };
    try {
      const response: any = await postMethod('suscription-mark-fees-paid', row);
      if (response.status === 200) {
        setConfirmVisible(false);
        reset();
        setSelectedDate(null);
      }
    } catch (error) {
      console.error('Failed to update suscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const dueStatus = async (data: {due_amount: any; due_date: any}) => {
    setLoading(true);
    const row = {
      suscription_id: suscription_id, // using the correct subscription ID
      due_amount: data.due_amount,
      due_date: data.due_date,
    };
    try {
      const response: any = await postMethod('suscription-mark-fees-due', row);
      if (response.status === 200) {
        setConfirmVisible(false);
        reset();
        setSelectedDate(null);
      }
    } catch (error) {
      console.error('Failed to update subscription status to due:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempStatus(null);
    setConfirmVisible(false);
  };

  return (
    <View style={styles.container}>
      <MenuProvider>
        <View style={styles.row0}>
          <Icon
            name="arrow-back"
            type="material"
            color="black"
            size={20}
            onPress={() => navigation.goBack()}
          />

          <View style={{flexDirection: 'row', gap: 20}}>
            <MenuPop
              navigation={navigation}
              item={history}
              id={suscription_id}
              message={message}
              subscriptionDetails={suscription}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View>
            <View style={styles.row1}>
              <Avatar
                size={40}
                avatarStyle={{backgroundColor: '#D3D3D3'}}
                rounded
                source={require('../../../img/one.jpeg')}
              />
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}>
                  <View>
                    <Text style={styles.name}>{suscription.name}</Text>
                    <Text style={styles.course}>{suscription.course}</Text>
                  </View>
                  <View>
                    <View style={styles.row1}>
                      <Icon
                        name="update"
                        type="material"
                        size={20}
                        color="black"
                        style={{width: 40, }}
                      />
                      <Text style={styles.date}>
                        {suscription.subscription_type}
                      </Text>
                    </View>
                    <View style={styles.rowText}>
                      <Icon
                        name="event"
                        type="material"
                        size={20}
                        color="black"
                        style={{width: 40, marginLeft: -10}}
                      />
                      <Text style={styles.newDate}>{suscription.date}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {suscription.subscription_type ===
            'End' ? null : suscription.subscription_type === 'Paid' ? (
              <Pressable
                style={[styles.btn1, {backgroundColor: 'red'}]}
                onPress={() => setConfirmVisible(true)}>
                <Text style={[styles.btnText1]}>Mark Fees as Due</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.btn1}
                onPress={() => setConfirmVisible(true)}>
                <Text style={styles.btnText1}>Mark Fees as paid</Text>
              </Pressable>
            )}

            <View>
              <Text style={styles.name}>Subscription Start Date</Text>
              <View style={styles.textInput0}>
                <Text style={styles.course}>
                  {suscription['suscription Start Date']}
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.name}>Last Payment Date</Text>

              <View style={styles.textInput0}>
                <Text style={styles.course}>
                  {suscription['Last Payment Date']}
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.name}>Last Payment Amount</Text>

              <View style={styles.textInput0}>
                <Text style={styles.course}>
                  ₹ {suscription['Last Payment Amount']}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </MenuProvider>

      {suscription.subscription_type ===
      'End' ? null : suscription.subscription_type === 'Paid'  ? (
        <Modal
          transparent={true}
          visible={confirmVisible}
          animationType="slide"
          onRequestClose={handleCancel}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.rowIcon}>
                <Text style={styles.menuText1}>Mark Fees as Due</Text>
                <Pressable onPress={handleCancel}>
                  <Icon
                    type="material"
                    name="close"
                    size={20}
                    color={'black'}
                  />
                </Pressable>
              </View>

              <View>
                <View style={{alignSelf: 'center'}}>
                  <Text style={styles.name}>Due Amount</Text>
                  <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder={''}
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
                    name="due_amount"
                  />
                  {errors.due_amount && (
                    <View
                      style={[
                        styles.rowText,
                        {width: responsiveWidth(80), alignSelf: 'center'},
                      ]}>
                      <Feather
                        name="alert-circle"
                        size={9}
                        color="red"
                        style={styles.icon}
                      />
                      <Text style={styles.error}>This field is required.</Text>
                    </View>
                  )}

                  <Text style={styles.name}>Due Date</Text>

                  <View>
                    <Controller
                      control={control}
                      rules={{required: true}}
                      render={({field: {onChange}}) => (
                        <TextInput
                          placeholder={''}
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
                      name="due_date"
                    />
                    {errors.due_date && (
                      <View
                        style={[
                          styles.rowText,
                          {width: responsiveWidth(80), alignSelf: 'center'},
                        ]}>
                        <Feather
                          name="alert-circle"
                          size={9}
                          color="red"
                          style={styles.icon}
                        />
                        <Text style={styles.error}>
                          This field is required.
                        </Text>
                      </View>
                    )}

                    <DateTimePickerModal
                      minimumDate={new Date()}
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={() => setDatePickerVisible(false)}
                    />
                  </View>

                  <Pressable
                    style={styles.btnItem}
                    onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.btnText}>Submit</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        <Modal
          transparent={true}
          visible={confirmVisible}
          animationType="slide"
          onRequestClose={handleCancel}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.rowIcon}>
                <Text style={styles.menuText1}>Mark Fees as Paid</Text>
                <Pressable onPress={handleCancel}>
                  <Icon
                    type="material"
                    name="close"
                    size={20}
                    color={'black'}
                  />
                </Pressable>
              </View>

              <View>
                <View style={{alignSelf: 'center'}}>
                  <Text
                    style={[
                      styles.name,
                      {width: responsiveWidth(80), alignSelf: 'center'},
                    ]}>
                    Paid Amount
                  </Text>
                  <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        placeholder={''}
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
                    name="paid_amount"
                  />
                  {errors.paid_amount && (
                    <View
                      style={[
                        styles.rowText,
                        {width: responsiveWidth(80), alignSelf: 'center'},
                      ]}>
                      <Feather
                        name="alert-circle"
                        size={9}
                        color="red"
                        style={styles.icon}
                      />
                      <Text style={styles.error}>This field is required.</Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.name,
                      {width: responsiveWidth(80), alignSelf: 'center'},
                    ]}>
                    Paid Date
                  </Text>

                  <View>
                    <Controller
                      control={control}
                      rules={{required: true}}
                      render={({field: {onChange}}) => (
                        <TextInput
                          placeholder={''}
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
                      name="paid_date"
                    />
                    {errors.paid_date && (
                      <View
                        style={[
                          styles.rowText,
                          {width: responsiveWidth(80), alignSelf: 'center'},
                        ]}>
                        <Feather
                          name="alert-circle"
                          size={9}
                          color="red"
                          style={styles.icon}
                        />
                        <Text style={styles.error}>
                          This field is required.
                        </Text>
                      </View>
                    )}

                    <DateTimePickerModal
                      minimumDate={new Date()}
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={() => setDatePickerVisible(false)}
                    />
                  </View>

                  <Pressable
                    style={styles.btnItem}
                    onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.btnText}>Submit</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const MenuPop = ({navigation, item, id, message, subscriptionDetails}) => {
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisible1] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [update, setUpdate] = useState(null);
  const [feeType, setFeeType] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [selectedDate1, setSelectedDate1] = useState('');
  const [selectedPaymentDate, setSelectedPaymentDate] = useState('');
  const updateRejoin = useSelector(state => state.List.updateStatus);
  const [isPaymentDatePickerVisible, setPaymentDatePickerVisible] =
    useState(false);
  const data = [
    {label: 'Paid', value: 'Paid'},
    {label: 'Unpaid', value: 'Unpaid'},
  ];

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const closeModel = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModalSec = () => {
    setModalVisible1(!isModalVisible1);
  };

  const toggleModalSec1 = () => {
    setModalVisible2(!isModalVisible2);
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      end_date: '',
      fee: '',
      feeType: '',
      rejoin_date: '',
      payment_date: '',
    },
  });

  const onSubmit = async (data: {
    fee: any;
    feeType: any;
    rejoin_date: any;
    payment_date: any;
  }) => {
    Keyboard.dismiss();
    if (subscriptionDetails.subscription_type === 'End') {
      RejoinStatus(data);
    } else {
      updateStatus(data);
    }
  };
  const updateStatus = async (data: {end_date: any}) => {
    setLoading(true);
    const row = {
      subscription_id: id,
      end_date: data.end_date,
    };

    try {
      const response = await postMethod('subscription-end', row);
      if (response.data.success === true) {
        reset();
        setSelectedDate(null);
        setModalVisible1(!isModalVisible1);

        console.log(response.data, 'hh1');
      }
    } catch (error) {
      console.error('Failed to update subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const RejoinStatus = async (data: {
    fee: any;
    feeType: any;
    rejoin_date: any;
    payment_date: any;
  }) => {
    setLoading(true);
    const row = {
      subscription_id: id,
      fee: data.fee,
      feeType: data.feeType,
      rejoin_date: data.rejoin_date,
      payment_date: data.payment_date,
      status: 2,
    };

    try {
      const response: any = await postMethod('subscription-rejoin', row);
      if (response.status === 200) {
        dispatch(setStatus(2));
        reset();
        setSelectedDate1(null);
        setSelectedPaymentDate(null);
        setModalVisible2(!isModalVisible2);
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = (date: any) => {
    setDatePickerVisible(false);
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setValue('end_date', formattedDate);
  };

  const handleConfirm1 = (date: any) => {
    setDatePickerVisible1(false);
    const formattedDate = formatDate(date);
    setSelectedDate1(formattedDate);
    setValue('rejoin_date', formattedDate);
  };

  const handlePaymentDateConfirm = (date: any) => {
    setPaymentDatePickerVisible(false);
    const formattedDate = formatDate(date);
    setSelectedPaymentDate(formattedDate);
    setValue('payment_date', formattedDate);
  };

  const formatDate = (date: {
    getFullYear: () => any;
    getMonth: () => number;
    getDate: () => {(): any; new (): any; toString: {(): string; new (): any}};
  }) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <Menu>
      <MenuTrigger>
        <Icon name="more-vert" type="material" color="black" size={25} />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionWrapper: {
            paddingHorizontal: 15, // Adjust horizontal padding
          },
          optionsContainer: {
            marginVertical: 25,
            paddingVertical: 10,
            backgroundColor: '#fff', // Set background color
            borderRadius: 15, // Rounded corners
            elevation: 5, // Add shadow for Android
            shadowColor: '#000', // Shadow color for iOS
            shadowOpacity: 0.2, // Shadow opacity for iOS
            shadowRadius: 4, // Shadow radius for iOS
            shadowOffset: {width: 0, height: 2}, // Shadow offset for iOS
          },
        }}>
        <View>
          <MenuOption>
            <Pressable onPress={toggleModal}>
              <Text style={styles.menuText2}>History</Text>
            </Pressable>

            <>
              <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={toggleModal}>
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <ScrollView>
                      <View style={styles.rowIcon}>
                        <Text style={styles.menuText1}>History</Text>
                        <Pressable
                          style={styles.cancelIcon}
                          onPress={closeModel}>
                          <Icon
                            type="material"
                            name="close"
                            size={30}
                            color="#000"
                          />
                        </Pressable>
                      </View>
                      {item ? (
                        item.map(
                          (item: {
                            paid_date:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | null
                              | undefined;
                            paid_amount:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | null
                              | undefined;
                          }) => (
                            <View>
                              <View style={styles.rowIcon}>
                                <View style={{marginBottom: 10}}>
                                  <Text style={styles.menuText1}>
                                    {item.type}
                                  </Text>
                                  <Text style={styles.menuText1}>
                                    {item.date}
                                  </Text>
                                </View>

                                {item.paid_amount ? (
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      gap: 15,
                                      alignItems: 'center',
                                      marginBottom: 10,
                                    }}>
                                    <Text
                                      style={[
                                        styles.menuText2,
                                        {marginBottom: 0},
                                      ]}>
                                      ₹{item.paid_amount}
                                    </Text>
                                  </View>
                                ) : null}
                              </View>
                            </View>
                          ),
                        )
                      ) : (
                        <View style={styles.modalView}>
                          <Text style={styles.modalText}>{message}</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            </>
          </MenuOption>

          {/* End Subscription */}

          <MenuOption>
            {subscriptionDetails.subscription_type === 'End' ? (
              <Pressable onPress={toggleModalSec1}>
                <Text style={styles.menuText2}>Rejoin Subscription</Text>
              </Pressable>
            ) : (
              <Pressable onPress={toggleModalSec}>
                <Text style={styles.menuText2}>End Subscription</Text>
              </Pressable>
            )}

            {subscriptionDetails.subscription_type === 'End' ? (
              <Modal
                transparent={true}
                visible={isModalVisible2}
                animationType="slide"
                onRequestClose={toggleModalSec1}>
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <Pressable
                      style={styles.cancelIcon}
                      onPress={toggleModalSec1}>
                      <Icon
                        type="material"
                        name="close"
                        size={30}
                        color="#000"
                      />
                    </Pressable>
                    <View style={styles.rowIcon}>
                      <Text style={styles.menuText1}>Rejoin Subscription</Text>
                    </View>

                    <View>
                      <Controller
                        control={control}
                        rules={{required: true}}
                        render={({field: {onChange, value}}) => (
                          <TextInput
                            placeholder="Subscription Fees"
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
                        <View style={styles.rowText}>
                          <Feather
                            name="alert-circle"
                            size={9}
                            color="red"
                            style={styles.icon}
                          />
                          <Text style={styles.error}>
                            This field is required.
                          </Text>
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
                            // inputSearchStyle={[styles.textInput,{width:25}]}
                            iconStyle={styles.iconStyle}
                            containerStyle={{width: 150}}
                            data={data}
                            search={false}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            itemTextStyle={{
                              color: 'black',
                            }}
                            placeholder={
                              !isFocus
                                ? 'Select Payment Status'
                                : 'Select Payment Status'
                            }
                            value={value}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                              setFeeType(item.value);
                              setIsFocus(false);

                              setValue('feeType', item.value);
                              if (item.value !== 'Paid') {
                                setSelectedDate('');
                                setValue('payment_date', null); // Clear fee_date if payment type is not Paid
                              }
                              setIsFocus(false);
                            }}
                          />
                        )}
                        name="feeType"
                      />
                      {errors.feeType && (
                        <View style={styles.rowText}>
                          <Feather
                            name="alert-circle"
                            size={9}
                            color="red"
                            style={styles.icon}
                          />
                          <Text style={styles.error}>
                            This field is required.
                          </Text>
                        </View>
                      )}

                      <Controller
                        control={control}
                        rules={{required: true}}
                        render={({field: {onChange}}) => (
                          <TextInput
                            placeholder="Select Rejoining Date"
                            style={styles.textInput}
                            textColor="black"
                            underlineColor="white"
                            outlineColor="white"
                            value={selectedDate1}
                            onChangeText={onChange}
                            placeholderTextColor={'black'}
                            editable={false}
                            right={
                              <TextInput.Icon
                                icon="calendar"
                                size={20}
                                onPress={() => setDatePickerVisible1(true)}
                              />
                            }
                          />
                        )}
                        name="rejoin_date"
                      />
                      {errors.rejoin_date && (
                        <View style={styles.rowText}>
                          <Feather
                            name="alert-circle"
                            size={9}
                            color="red"
                            style={styles.icon}
                          />
                          <Text style={styles.error}>
                            This field is required.
                          </Text>
                        </View>
                      )}

                      {feeType === 'Paid' && ( // Conditionally render Payment Date picker
                        <>
                          <Controller
                            control={control}
                            rules={{required: feeType === 'Paid'}}
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
                                    onPress={() =>
                                      setPaymentDatePickerVisible(true)
                                    }
                                  />
                                }
                              />
                            )}
                            name="payment_date"
                          />
                          {errors.payment_date && (
                            <View style={styles.rowText}>
                              <Feather
                                name="alert-circle"
                                size={9}
                                color="red"
                                style={styles.icon}
                              />
                              <Text style={styles.error}>
                                This field is required.
                              </Text>
                            </View>
                          )}
                        </>
                      )}

                      <Pressable
                        style={styles.btn}
                        onPress={handleSubmit(onSubmit)}>
                        {loading ? (
                          <ActivityIndicator size={20} color="black" />
                        ) : (
                          <Text style={styles.btnText}>Submit</Text>
                        )}
                      </Pressable>

                      <DateTimePickerModal
                        minimumDate={new Date()}
                        isVisible={isDatePickerVisible1}
                        mode="date"
                        onConfirm={handleConfirm1}
                        onCancel={() => setDatePickerVisible1(false)}
                      />
                      <DateTimePickerModal
                        minimumDate={new Date()}
                        isVisible={isPaymentDatePickerVisible}
                        mode="date"
                        onConfirm={handlePaymentDateConfirm}
                        onCancel={() => setPaymentDatePickerVisible(false)}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            ) : (
              <Modal
                transparent={true}
                visible={isModalVisible1}
                animationType="slide"
                onRequestClose={toggleModalSec}>
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <Pressable
                      style={styles.cancelIcon}
                      onPress={toggleModalSec}>
                      <Icon
                        type="material"
                        name="close"
                        size={30}
                        color="#000"
                      />
                    </Pressable>
                    <View style={styles.rowIcon}>
                      <Text style={styles.menuText1}>End Subscription</Text>
                    </View>

                    <View>
                      <Controller
                        control={control}
                        rules={{required: true}}
                        render={({field: {onChange}}) => (
                          <TextInput
                            placeholder={'End Date'}
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
                        name="end_date"
                      />
                      {errors.end_date && (
                        <View style={[styles.rowText, {marginLeft: 0}]}>
                          <Feather
                            name="alert-circle"
                            size={9}
                            color="red"
                            style={styles.icon}
                          />
                          <Text style={styles.error}>
                            This field is required.
                          </Text>
                        </View>
                      )}

                      <DateTimePickerModal
                        minimumDate={new Date()}
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={() => setDatePickerVisible(false)}
                      />
                    </View>

                    <Pressable
                      style={styles.btnItem}
                      onPress={handleSubmit(onSubmit)}>
                      {loading ? (
                        <ActivityIndicator size={20} color="black" />
                      ) : (
                        <Text style={styles.btnText}>Submit</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              </Modal>
            )}
          </MenuOption>
        </View>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#D3D3D3',
    alignItems: 'flex-start',
  },
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  row: {
    borderRadius: 10,
    width: responsiveWidth(95),
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
    alignSelf: 'center',
    // flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    width: responsiveWidth(45),
    marginBottom: 5,
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    width: responsiveWidth(45),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.65),
    letterSpacing: 1,
    marginBottom: 5,
    color: 'black',
  },

  row1: {
    flexDirection: 'row',
    gap: 15,
  },

  date: {
    // width: responsiveWidth(15),
    marginBottom: 5,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
    textAlign:'left',
    alignItems:'flex-start'
    
  },
  newDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
    // width: responsiveWidth(35),
    marginBottom: 5,

  },
  btn: {
    width: responsiveWidth(30),
    height: responsiveHeight(5),
    backgroundColor: 'white',
    elevation: 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
    marginBottom: 40,
  },
  btnText: {
    color: 'black',
    fontSize: responsiveFontSize(1.96),
    fontFamily: 'Roboto-Medium',
  },
  btnItem: {
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
  btn1: {
    width: responsiveWidth(30),
    height: responsiveHeight(5),
    backgroundColor: 'green',
    elevation: 2.5,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 10,
  },
  btnText1: {
    color: 'white',
    fontSize: responsiveFontSize(1.6),
  },

  menuText: {
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.5),
  },
  menuText1: {
    color: colors.black,
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
  },
  menuText2: {
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
    // marginLeft: 10,
  },
  menuText3: {
    color: colors.white,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },

  // Modal
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // marginVertical:20,
  },
  modalContainer: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
    alignSelf: 'center',
  },
  cancelIcon: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  modalText: {
    // marginTop: 20,
    // fontSize: 18,
    // textAlign: 'center',
  },
  rowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },

  box: {
    width: 40,
    height: 30,
    borderRadius: 5,
    backgroundColor: 'red',

    alignItems: 'center',
    justifyContent: 'center',
  },

  textInput: {
    width: responsiveWidth(80),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 2,
    marginBottom: 25,
    borderRadius: 10,
    paddingBottom: 0,
    alignSelf: 'center',
  },
  textInput0: {
    width: responsiveWidth(90),
    height: 50,
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 2,
    marginBottom: 25,
    borderRadius: 10,
    paddingBottom: 0,
    borderWidth: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  rowText: {
    flexDirection: 'row',
    marginLeft: 12,
    marginBottom: 5,
  },
  icon: {
    marginRight: 4,
    marginTop: -8,
  },
  error: {
    width: 330,
    color: 'red',
    fontSize: 10,
    marginTop: -10,
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

  dropdown: {
    width: responsiveWidth(80),
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});

export default MarkFees;
