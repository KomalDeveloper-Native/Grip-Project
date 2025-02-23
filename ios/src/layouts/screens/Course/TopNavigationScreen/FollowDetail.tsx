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
  ScrollView,
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
import {Divider} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus } from '../../../../Redux/ListSlice ';

interface Props {}
const FollowDetail: FC<Props> = ({route, navigation}): JSX.Element => {
  const {follow, lead_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState([]);
  const [nextUpdate, setNextUpdate] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<number | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatch = useDispatch();
  const statusNo = useSelector(state => state.List.status);
  
  useFocusEffect(
    useCallback(() => {
      nextHistory();
      followHistory();
    }, []),
  );

  const nextHistory = async () => {
    setLoading(true);
    try {
      const row = {
        leadId: lead_id,
      };
      const response: any = await postMethod(
        'next-lead-follow-up-history',
        row,
      );
      if (response.data.success === true) {
        setNextUpdate(response.data.followUpHistory);
        console.log(response.data,'jk');
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(lead_id, 'mk');

  const followHistory = async () => {
    setLoading(true);
    try {
      const row = {
        leadId: lead_id,
      };
      const response: any = await postMethod('lead-follow-up-history', row);
      if (response.data.success === true) {
        setUpdate(response.data.followUpHistory);
        console.log(response.data,'uuu');
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
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
        // setUpdate(response.data.data.status);
        console.log(response.data.data.status, 'ds99 ');
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
      followHistory();
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
    followHistory();
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
              name="plus"
              type="material-community"
              color={'black'}
              size={30}
             onPress={() => SentFun(lead_id)}
            />
            <Icon
              name="chatbox-ellipses"
              type="ionicon"
              color="black"
              size={30}
            />
            <MenuPop navigation={navigation} lead_id={lead_id}  CloseFun={() => confirmAction(0)} />
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
                  <Text style={styles.name}>{follow.Name}</Text>
                  <Text style={styles.course}>{follow.course_name}</Text>
                </View>
                <View>
                  <View style={styles.row1}>
                    <Icon
                      name="chatbox-ellipses"
                      type="ionicon"
                      size={20}
                      color="black"
                      onPress={() => navigation.goBack()}
                    />
                    <Text style={styles.date}>{follow.comments}</Text>
                  </View>
                  <View style={styles.row1}>
                    <Icon
                      name="event"
                      type="material"
                      size={20}
                      color="black"
                    />
                    <Text style={styles.newDate}>{follow.follow_up_date}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.box}>
        <View style={styles.textBg}>
            <Text
              style={[
                styles.course,
                {marginBottom: 0, fontSize: responsiveFontSize(1.9)},
              ]}>
             Next Follow Up 
            </Text>
          </View>
          {nextUpdate.map(item => (
            <>
              <View style={styles.box0}>
                <Icon
                  name="chatbox-ellipses"
                  type="ionicon"
                  size={20}
                  color="black"
                />
                <Text style={styles.course}>{item.comments}</Text>
              </View>
              <View style={styles.box0}>
                <Icon name="event" type="material" size={20} color="black" />
                <Text style={styles.course}>{item.follow_up_date}</Text>
              </View>
            </>
          ))}
        </View>

        <View style={styles.box1}>
          <View style={styles.textBg}>
            <Text
              style={[
                styles.course,
                {marginBottom: 5, fontSize: responsiveFontSize(1.9)},
              ]}>
              Follow Up History
            </Text>
          </View>

          <ScrollView >
            {update.map(item => (
              <ScrollView>
                <View style={styles.box0}>
                  <Icon
                    name="chatbox-ellipses"
                    type="ionicon"
                    size={20}
                    color="black"
                  />
                  <Text style={styles.course}>{item.comments}</Text>
                </View>
                <View style={styles.box0}>
                  <Icon name="event" type="material" size={20} color="black" />
                  <Text style={styles.course}>{item.follow_up_date}</Text>
                </View>
                <Divider />
              </ScrollView>
            ))}
          </ScrollView>
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

const MenuPop = ({navigation, lead_id,CloseFun}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const SentFun1 = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddSubscriptionScreen',
        params: {
          lead_id: item,
        },
      }),
    );
  };

  return (
    <Menu>
      <MenuTrigger>
        <Icon name="more-vert" type="material" color="black" size={25} />
      </MenuTrigger>

      <MenuOptions>
        <MenuOption>
          <Pressable onPress={() => SentFun1(lead_id)}>
            <Text style={styles.menuText2}>Subscribe</Text>
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
                  <Text style={styles.menuText}>Change Lead Status</Text>

                  {/* <Pressable style={styles.rowIcon1}>
                    <Icon
                      type="material"
                      name="check-circle"
                      size={20}
                    />
                    <Text style={styles.menuText}>Subscribe</Text>
                  </Pressable>
                  <Pressable
                    style={styles.rowIcon1}
                   >
                    <Icon
                      type="material"
                      name="check-circle"
                      size={20}
                      color={colorIcon1}
                    />
                    <Text style={styles.menuText}>Close</Text>
                  </Pressable> */}
                </View>
                {/* <Text style={styles.modalText}>
                  {isModalVisible ? 'Open' : 'Close'}
                </Text> */}
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
    flexGrow: 1,
    borderRadius: 10,
    width: responsiveWidth(95),

    backgroundColor: 'white',

    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  box: {
    width: responsiveWidth(90),
    backgroundColor: '#D3D3D3',
    flexDirection: 'column',
    borderRadius: 5,
    position: 'absolute',
    padding: 20,
    marginTop: 120,
    alignSelf: 'center',
    justifyContent: 'space-between',

    gap: 10,
    marginBottom: 50,
    opacity: 88,
    elevation: 1,
  },

  // EEECEC
  box1: {
    width: responsiveWidth(90),
    backgroundColor: '#EEECEC',
    flexDirection: 'column',
    borderRadius: 5,
    position: 'absolute',
    padding: 20,
    marginTop: 310,
    alignSelf: 'center',
    justifyContent: 'space-between',

    gap: 10,
    marginBottom: 20,
    opacity: 88,
    elevation: 1,
  },

  textBg: {
    width: responsiveWidth(79),
    //  height:responsiveHeight(5),
    alignItems: 'center',
    //  justifyContent:'center',
    backgroundColor: 'white',
    borderRadius: 5,
    //  textAlign:'center',
    padding: 10,
  },

  box0: {
    // width: responsiveWidth(90),
    // paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom:15,
    // alignItems: 'center',
    // marginTop:2,
  },

  name: {
    width: responsiveWidth(45),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    // width: responsiveWidth(40),
    marginBottom: 10,
    flexWrap: 'wrap',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
    // marginLeft: -3,
    textAlign: 'justify',
  },
  row1: {
    // marginLeft: -4,

    flexDirection: 'row',
    gap: 10,
  },
  row2: {
    width: responsiveWidth(70),
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

export default FollowDetail;
