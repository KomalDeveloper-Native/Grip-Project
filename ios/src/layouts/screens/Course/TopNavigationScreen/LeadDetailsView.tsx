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

interface Props {}
const LeadDetailsView: FC<Props> = ({navigation}): JSX.Element => {
  const dispatch = useDispatch();
  const statusNo = useSelector(state => state.List.status);

  console.log(statusNo, 'statusNo');
  const route = useRoute();
  const {lead_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const [update, setUpdate] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false); // State for button loading
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      leadLisfun();
    }, []),
  );

  console.log(lead_id, 'lead_jd');

  const leadLisfun = async () => {
    setLoading(true);

    try {
      const storage = await getStorageData();
      console.log(storage.response.user.id, 'storage');
      const response: any = await getMethod(`lead-detail?lead_id=${lead_id}`);
      if (response.data.success === true) {
        setLead(response.data.lead);
        console.log(response.data, 'va');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const updatestatusFun = async id => {
    setButtonLoading(true); // Set button loading state
    setLoading(true);
    try {
      const row = {
        status: id,
      };
      const response: any = await postMethod(
        `update-lead-status?id=${lead_id}`,
        row,
      );
      if (response.data.success === true) {
        // setLead(response.data.lead);
        setUpdate(response.data.data.status);
        console.log(response.data.data.status, 'ds');
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
      setButtonLoading(false); // Reset button loading state
    }
  };
  const memoResult = useMemo(() => {
    if (statusNo !== null) {
      // setTempStatus(statusNo);
      updatestatusFun(statusNo);
    }
  }, []);
  const handleConfirm = () => {
    if (tempStatus !== null) {
      updatestatusFun(tempStatus);
      setTempStatus(null);
      leadLisfun();
    }
    setConfirmVisible(false);
  };

  const handleCancel = () => {
    setTempStatus(null);
    setConfirmVisible(false);
  };

  const confirmAction = (num: number) => {
    dispatch(setStatus(num));
    setTempStatus(num);
    setConfirmVisible(true);
    leadLisfun();
  };

  const SentFun = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FollowUpScreen',
        params: {
          lead_id: item,
        },
      }),
    );
  };

  const SentFun1 = item => {
    // confirmAction(1);

    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddSubscriptionScreen',
        params: {
          lead_id: item,
        },
      }),
    );
  };

  const [subStatus, setSubStatus] = useState(false);

  const unsubFun = () => {
    Alert.alert('Confirmation', 'Are you sure you want to unsubscribe?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          confirmAction(0); // Set status to 0 for unsubscribing
        },
      },
    ]);
  };

  const subFun = () => {
    confirmAction(1); // Set status to 1 for subscribing
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
            <Icon
              name="chatbox-ellipses"
              type="ionicon"
              color="black"
              size={30}
            />
             {lead.status === 'subscribed' ? null:
            <MenuPop
              navigation={navigation}
              item={lead}
              OpenFun={() => confirmAction(1)}
              CloseFun={() => confirmAction(0)}
            />}
            {/* <Icon name="more-vert" type="material" color="black" size={20} /> */}
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
                  <Text style={styles.course}>{lead['course name']}</Text>
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

              <View style={styles.row2}>
                {lead.status === 'subscribed' ? (
                  <Pressable
                    style={[styles.btn, {backgroundColor: 'red'}]}
                    onPress={unsubFun}>
                    <Text style={styles.btnText0}>Subscribed</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.btn}
                    onPress={() => SentFun1(lead_id)}>
                    <Text style={styles.btnText}>Add Subscription</Text>
                  </Pressable>
                )}

                <Pressable style={styles.btn} onPress={() => SentFun(lead_id)}>
                  <Text style={styles.btnText}>Add Follow Up</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </MenuProvider>
      <Modal
        transparent={true}
        visible={confirmVisible}
        animationType="slide"
        onRequestClose={handleCancel}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.menuText1}>Do you want to proceed?</Text>
            <View style={styles.rowIcon1}>
              <Pressable style={styles.btn} onPress={handleConfirm}>
                <Text style={styles.btnText}>Yes</Text>
              </Pressable>
              <Pressable style={styles.btn} onPress={handleCancel}>
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MenuPop = ({navigation, item, OpenFun, CloseFun}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const colorIcon = item.status === 'open' ? 'green' : 'gray';
  const colorIcon1 = item.status === 'closed' ? 'red' : 'gray';
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

      <MenuOptions>
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
        <MenuOption>
          <Pressable onPress={() => CloseFun(0)}>
            <Text style={styles.menuText2}> Close Lead</Text>
          </Pressable>
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
    marginTop: 20,
  },
  menuText2: {
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
    marginBottom: 10,
    marginLeft: 10,
  },

  // Modal
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: responsiveWidth(70),
    height: responsiveHeight(18),
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
});

export default LeadDetailsView;
