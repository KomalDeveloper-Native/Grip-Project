/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-shadow */
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
import {setStatus} from '../../../../Redux/ListSlice ';
import {Controller, useForm} from 'react-hook-form';
import {TextInput} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDate} from 'date-fns';
import {AsyncStorage} from 'react-native';

interface Props {}
const LeadFranchiseDetails: FC<Props> = ({navigation}): JSX.Element => {
  const dispatch = useDispatch();
  const statusNo = useSelector(state => state.List.status);
  const route = useRoute();
  const {lead_id, franchise_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const [update, setUpdate] = useState([]);
  const [tempStatus, setTempStatus] = useState<number | null>(null);
  console.log(lead_id);
  useFocusEffect(
    useCallback(async () => {
      await leadLisfun();
    }, [lead_id]),
  );

  const leadLisfun = async () => {
    setLoading(true);
    try {
      const storage = await getStorageData();
      console.log(storage.response.user.id, 'storage');
      const response: any = await getMethod(
        `franchise-lead-detail-user?id=${lead_id}`,
      );

      if (response.data.status === 'success') {
        setLead(response.data.lead_detail);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error1');
    }
  };

  const updatestatusFun = async id => {
    setLoading(true);
    try {
      const row = {
        status: id,
      };
      const response: any = await postMethod(
        `franchise-lead-change-status-user?id=${lead_id}`,
        row,
      );

      console.log(response.data, 'data1');
      if (response.status === 200) {
        setUpdate(response.data.new_status);
        console.log(response.data.new_status, 'ds');
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally { 
      setLoading(false);
    }
  };

  const memoResult = useMemo(async () => {
    if (statusNo !== null) {
      updatestatusFun(statusNo);
      await leadLisfun()
    }
  }, [statusNo]);

  const confirmAction = (num: number) => {
    dispatch(setStatus(num));
    setTempStatus(num);
  };
  const SentFun = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddFranchiseFollowUp',
        params: {
          lead_id: item,
        },
      }),
    );
  };

  const SentFun1 = item => {
    confirmAction(1);
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddCutomerInterest',
        params: {
          lead_id: item,
          franchiseData: lead,
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <MenuProvider>
        <View style={styles.row0}>
          <Icon
            name="arrow-back"
            type="material"
            color="black"
            size={25}
            onPress={() => navigation.goBack()}
          />
          <View style={{flexDirection: 'row', gap: 20}}>
            <MenuPop
              navigation={navigation}
              item={lead}
              OpenFun={() => confirmAction(1)}
              CloseFun={() => confirmAction(0)}
            />
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size={20} color={'black'} />
        ) : (
          <>
            <View style={styles.row}>
              <View style={styles.row1}>
                <Avatar size={40} rounded source={{uri: lead.image}} />
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                    }}>
                    <View>
                      <Text style={styles.name}>{lead.name}</Text>
                      <Text style={styles.course}>{lead.franchise_name}</Text>
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
                        <Text style={styles.newDate}>{lead.date}</Text>
                      </View>
                    </View>
                  </View>
                  {lead.status !== 'Close' && (
                    <View style={styles.row2}>
                      <Pressable
                        style={styles.btn}
                        onPress={() => SentFun1(lead_id)}>
                        <Text style={styles.btnText}>Add Interests</Text>
                      </Pressable>

                      <Pressable
                        style={styles.btn}
                        onPress={() => SentFun(lead_id)}>
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
    </View>
  );
};

export const MenuPop: FC<MenuPopProps> = ({
  navigation,
  item,
  OpenFun,
  CloseFun,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const colorIcon = item.status === 'Open' ? 'green' : 'gray';
  const colorIcon1 = item.status === 'Close' ? 'red' : 'gray';

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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
            paddingVertical: 7,
            marginVertical: -5,
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
                  <Pressable style={styles.rowIcon1} onPress={() => OpenFun()}>
                    <Icon
                      type="material"
                      name="check-circle"
                      size={20}
                      color={colorIcon}
                    />
                    <Text style={styles.menuText}>Open</Text>
                  </Pressable>

                  <Pressable style={styles.rowIcon1} onPress={() => CloseFun()}>
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
        <MenuOption>
          {item.status !== 'Close' && (
            <Pressable onPress={() => CloseFun()}>
              <Text style={styles.menuText2}> Close Lead</Text>
            </Pressable>
          )}
        </MenuOption>
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
    alignSelf: 'center',
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
    // marginLeft: 10,
  },
  menuText2: {
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
    marginLeft: 0,
    marginBottom: 5,
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
  // Modal

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
  },
  buttonText1: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
  },
  modalText: {
    alignItems: 'center',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.75),
    marginVertical: 10,
  },

  cancelIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },

  rowIcon: {
    padding: 5,
  },

  rowIcon1: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  rowIcon2: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    alignSelf: 'center',
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

export default LeadFranchiseDetails;
