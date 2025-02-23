/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useMemo, useState} from 'react';
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
import {setStatus} from '../../../../Redux/ListSlice ';
import {Controller, useForm} from 'react-hook-form';
import {TextInput} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDate} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddBookingScreen from './AddBookingScreen';

interface Props {}
const RetreatLeadDetail: FC<Props> = ({navigation}): JSX.Element => {
  const dispatch = useDispatch();
  const statusNo = useSelector(state => state.List.status);
  const route = useRoute();
  const {lead_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const [update, setUpdate] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false); // State for button loading
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      end_date: '',
    },
  });
  const onSubmit = async data => {
    Keyboard.dismiss();
    subscriptionEndFun(data);
  };
  useFocusEffect(
    useCallback(() => {
      getsubscriptionEndFun(statusNo);
      leadLisfun();
    }, []),
  );
  const leadLisfun = async () => {
    setLoading(true);
    try {
      const response: any = await getMethod(
        `retreat-lead-detail?lead_id=${lead_id}`,
      );
      console.log(response.data, 'va');
      if (response.data.success === true) {
        setLead(response.data.lead);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const subscriptionStata = async id => {
    setButtonLoading(true); // Set button loading state
    console.log(tempStatus);
    setLoading(true);
    try {
      const row = {
        lead_id: lead_id,
        status: id,
      };
      const response: any = await postMethod(
        `user-retreat-lead-update-status`,
        row,
      );
      if (response.status === 200) {
        setUpdate(response.data.status);
        await leadLisfun();
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
      setButtonLoading(false); // Reset button loading state
    }
  };
  const subscriptionEndFun = async data => {
    setLoading(true);
    const row = {
      subscription_id: lead_id,
      end_date: data.end_date,
    };
    try {
      const response = await postMethod('subscription-end', row);
      if (response.data.success === true) {
        setDatePickerVisible(false);
        const endedSubscriptions =
          JSON.parse(await AsyncStorage.getItem('subscriptionEndFun')) || [];
        if (!endedSubscriptions.includes(lead_id)) {
          endedSubscriptions.push(lead_id);
          await AsyncStorage.setItem(
            'subscriptionEndFun',
            JSON.stringify(endedSubscriptions),
          );
        }

        setUpdate(true);
      }
    } catch (error) {
      console.error('Failed to update subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(statusNo, 'status');

  const getsubscriptionEndFun = async () => {
    try {
      const endedSubscriptions =
        JSON.parse(await AsyncStorage.getItem('subscriptionEndFun')) || [];
      if (endedSubscriptions.includes(id)) {
        setUpdate(true);
      } else {
        setUpdate(false);
      }
    } catch (error) {
      console.error('Failed to retrieve update status:', error);
    }
  };

  const handleConfirm1 = date => {
    setDatePickerVisible(false);
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setValue('end_date', formattedDate);
  };

  const formatDate = date => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const memoResult = useMemo(async () => {
    if (statusNo !== null) {
      await subscriptionStata(statusNo);
    }
  }, [statusNo]);

  const handleCancel = () => {
    setTempStatus(null);
  };

  const confirmAction = async status => {
    dispatch(setStatus(status));
    setTempStatus(status);
    await leadLisfun();
  };

  const SentFun = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddRetreatLeadFollow',
        params: {
          lead_id: item,
        },
      }),
    );
  };

  const SentTo = item => {
    // confirmAction(1);
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddBookingScreen',
        params: {
          lead_id: lead_id,
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <MenuProvider>
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : (
          <>
            <View style={styles.row0}>
              <Icon
                name="arrow-back"
                type="material"
                color="black"
                size={25}
                onPress={() => navigation.goBack()}
              />
              <View style={{flexDirection: 'row', gap: 20}}>
                {/* <Icon
      name="chatbox-ellipses"
      type="ionicon"
      color="black"
      size={30}
    /> */}

                <MenuPop
                  navigation={navigation}
                  item={lead}
                  OpenFun={() => confirmAction(1)}
                  CloseFun={() => confirmAction(0)}
                />
              </View>
            </View>
            <View style={styles.row}>
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
                      <Text style={styles.name}>{lead.name}</Text>
                      <Text style={styles.course}>{lead['retreat name']}</Text>
                    </View>
                    <View>
                      <View style={styles.row1}>
                        <Icon
                          name="update"
                          type="material"
                          size={20}
                          color="black"
                        />
                        <Text style={styles.date}>{lead.status}</Text>
                      </View>
                      <View style={styles.row1}>
                        <Icon
                          name="event"
                          type="material"
                          size={20}
                          color="black"
                        />
                        <Text style={styles.newDate}>{lead['Lead Date']}</Text>
                      </View>
                    </View>
                  </View>
                  {lead.status === 'Close' ? null : (
                    <View style={styles.row2}>
                      {lead.booking !== 'yes' ? (
                        <Pressable
                          style={styles.btn}
                          onPress={() => SentTo(lead.id)}>
                          <Text style={styles.btnText}>Add Booking</Text>
                        </Pressable>
                      ) : null}

                      <Pressable
                        style={styles.btn}
                        onPress={() => SentFun(lead.id)}>
                        <Text style={styles.btnText}>Add Follow Up</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </>
        )}
      </MenuProvider>
      <Modal
        transparent={true}
        visible={confirmVisible}
        animationType="slide"
        onRequestClose={handleCancel}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Pressable style={styles.cancelIcon} onPress={handleCancel}>
              <Icon type="material" name="close" size={30} color="#000" />
            </Pressable>
            <View style={styles.rowIcon}>
              <Text style={styles.menuText1}>End Subscription</Text>
            </View>
            <Text style={styles.name}>End Date</Text>

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
                  <Text style={styles.error}>This field is required.</Text>
                </View>
              )}

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm1}
                onCancel={() => setDatePickerVisible(false)}
              />
            </View>

            <Pressable style={styles.btnItem} onPress={handleSubmit(onSubmit)}>
              {loading ? (
                <ActivityIndicator size={20} color="black" />
              ) : (
                <Text style={styles.btnItemText}>Submit</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MenuPop = ({navigation, item, OpenFun, CloseFun}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const colorIcon = item.status === 'Open' ? 'green' : 'gray';
  const colorIcon1 = item.status === 'Close' ? 'red' : 'gray';
  const [closeButtonClicked, setCloseButtonClicked] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setCloseButtonClicked(false); // Reset close button state when opening modal
  };

  const handleToggleAndClick = () => {
    if (!closeButtonClicked) {
      setModalVisible(false);
      setCloseButtonClicked(true); // Set close button clicked once
    }
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
        <MenuOption>
          <Pressable onPress={toggleModal}>
            <Text style={styles.menuText2}>Change Lead Status</Text>
          </Pressable>
          <Modal
            transparent={true}
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={toggleModal}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Pressable style={styles.cancelIcon} onPress={toggleModal}>
                  <Icon type="material" name="close" size={30} color="#000" />
                </Pressable>
                <View style={styles.rowIcon}>
                  <Text style={styles.menuText1}>Change Lead Status</Text>

                  <Pressable style={styles.rowIcon1} onPress={() => OpenFun(1)}>
                    <Icon
                      type="material"
                      name="check-circle"
                      size={20}
                      color={colorIcon}
                    />
                    <Text style={styles.menuText}>Open</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rowIcon1}
                    onPress={() => CloseFun(0)}>
                    <Icon
                      type="material"
                      name="check-circle"
                      size={20}
                      color={colorIcon1}
                    />
                    <Text style={styles.menuText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </MenuOption>
        {item.status !== 'Close' ? (
          <MenuOption>
            <Pressable onPress={() => CloseFun(0)}>
              <Text style={styles.menuText2}> Close Lead</Text>
            </Pressable>
          </MenuOption>
        ) : null}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#D3D3D3',
  },
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  row: {
    borderRadius: 10,
    flex: 1,
    width: responsiveWidth(95),
    backgroundColor: 'white',

    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    width: responsiveWidth(45),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    width: responsiveWidth(45),
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  row1: {
    flexDirection: 'row',
    gap: 15,
  },
  row2: {
    width: responsiveWidth(74),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: 10,
  },
  date: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  newDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  btn: {
    width: responsiveWidth(30),
    height: responsiveHeight(5),
    backgroundColor: 'white',
    elevation: 2.5,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
  },
  btnText: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
  },
  btnText0: {
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
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 20,
  },
  menuText2: {
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },

  // Modal
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: responsiveWidth(90),
    // height: responsiveHeight(18),
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
  },
  cancelIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  modalText: {
    // marginTop: 20,
    // fontSize: 18,
    // textAlign: 'center',
  },
  rowIcon: {},
  rowIcon1: {
    flexDirection: 'row',
    gap: 10,
    // marginBottom:10,
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    width: responsiveWidth(85),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 2,
    marginBottom: 25,
    borderRadius: 10,
    marginTop: 5,
    paddingBottom: 0,
    alignSelf: 'center',
  },
  btnItem: {
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
  btnItemText: {
    color: 'black',
    fontSize: responsiveFontSize(1.96),
    fontFamily: 'Roboto-Medium',
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
});

export default RetreatLeadDetail;
