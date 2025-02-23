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
import {useDispatch, useSelector} from 'react-redux';
import {setStatus} from '../../../../Redux/ListSlice ';

interface Props {}
const FollowDetail: FC<Props> = ({route, navigation}): JSX.Element => {
  const {follow, lead_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState([]);
  const [nextUpdate, setNextUpdate] = useState([]);
  const [data, setData] = useState([]);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [tempStatus, setTempStatus] = useState<number | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatch = useDispatch();
  const statusNo = useSelector(state => state.List.status);
  console.error(follow.status, 'follow');

  useFocusEffect(
    useCallback(() => {
      nextHistory();
      followHistory();
    }, [follow]),
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
        console.log(response.data, 'jk');
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
        console.log(response.data, 'uuu');
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
      if (response.status === 200) {
        // setLead(response.data.lead);
        setData(response.data.data);
        console.log(response.data.data, 'ds99 ');
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
      updatestatusFun(statusNo);
      followHistory();
    }
  }, [update, confirmVisible, statusNo]);
  console.log(statusNo, 'ffjd');

  const handleConfirm = () => {
    updatestatusFun(statusNo);
    dispatch(setStatus(0));
    followHistory();
    setConfirmVisible(false);
  };

  const handleCancel = () => {
    setConfirmVisible(false);
  };

  const confirmAction = () => {
    setConfirmVisible(true);
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
            {data.status == 0 ? null : (
              <Icon
                name="plus"
                type="material-community"
                color={'black'}
                size={30}
                onPress={() => SentFun(lead_id)}
              />
            )}
            
            {data.status !== 0 ? (
              <MenuPop
                navigation={navigation}
                lead_id={lead_id}
                CloseFun={() => confirmAction(0)}
                follow={follow}
              />
            ) : null}

            {/* <Icon name="more-vert" type="material" color="black" size={20} /> */}
          </View>
        </View>
       {
        loading ?
        <ActivityIndicator size={20 } color={'black'} />
        :
<View style={styles.row}>
          <View style={styles.row1}>
            <Avatar
              size={40}
              avatarStyle={{backgroundColor: '#D3D3D3'}}
              rounded
              source={require('../../../img/one.jpeg')}
            />
            <View style={styles.rowbox}>
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
                  <Text style={styles.date}>
                    {follow.comments.length > 100
                      ? `${follow.comments.substring(0, 100)}...`
                      : follow.comments}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Icon name="event" type="material" size={20} color="black" />
                  <Text style={styles.newDate}>{follow.follow_up_date}</Text>
                </View>
              </View>
            </View>
          </View>
          <ScrollView>
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
                  <ScrollView style={{maxHeight: responsiveHeight(150)}}>
                    <View style={styles.box0}>
                      <Icon
                        name="chatbox-ellipses"
                        type="ionicon"
                        size={20}
                        color="black"
                      />
                      <Text style={styles.course}>{item.comments}</Text>
                    </View>
                  </ScrollView>
                  <View style={styles.box0}>
                    <Icon
                      name="event"
                      type="material"
                      size={20}
                      color="black"
                    />
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

              <ScrollView style={{minHeight: responsiveHeight(50)}}>
                {update.map((item, index) => (
                  <View key={index}>
                    {/* Use index or a unique key */}
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
                      <Icon
                        name="event"
                        type="material"
                        size={20}
                        color="black"
                      />
                      <Text style={styles.course}>{item.follow_up_date}</Text>
                    </View>
                    <Divider />
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
       }
        
      </MenuProvider>
      <Modal
        transparent={true}
        visible={confirmVisible}
        animationType="slide"
        onRequestClose={handleCancel}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Would you like to proceed with closing the lead?
            </Text>
            <View style={styles.rowIcon1}>
              <Pressable style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => handleConfirm(0)}>
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MenuPop = ({navigation, lead_id, CloseFun, follow}) => {
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

      <MenuOptions
        customStyles={{
          optionWrapper: {
            paddingHorizontal: 15, // Adjust horizontal padding
            paddingVertical: 7,
            marginVertical: -4,
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
            {follow.status !== '2' && (
              <Pressable onPress={() => SentFun1(lead_id)}>
                <Text style={styles.menuText2}>Subscribe</Text>
              </Pressable>
            )}

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
                  </View>
                </View>
              </View>
            </Modal>
          </MenuOption>
          {follow.status === '0' ? null : (
            <MenuOption>
              <Pressable onPress={() => CloseFun()}>
                <Text style={styles.menuText2}>Close Lead</Text>
              </Pressable>
            </MenuOption>
          )}
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
  },
  rowbox: {
    minWidth: responsiveWidth(75),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  row: {
    flexGrow: 3,
    flex: 3,
    borderRadius: 10,
    width: responsiveWidth(95),
    backgroundColor: 'white',
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  box: {
    width: responsiveWidth(90),
    backgroundColor: '#D3D3D3',
    flexDirection: 'column',
    borderRadius: 5,
    position: 'relative',
    padding: responsiveWidth(6),
    alignSelf: 'center',
    justifyContent: 'space-between',

    gap: 10,
    marginBottom: 10,
    opacity: 88,
    elevation: 1,
  },

  // EEECEC
  box1: {
    width: responsiveWidth(90),
    backgroundColor: '#EEECEC',
    flexDirection: 'column',
    borderRadius: 5,

    padding: 20,
    alignSelf: 'center',
    // justifyContent: 'space-between',

    gap: 10,
    opacity: 88,
    elevation: 1,
  },

  textBg: {
    width: responsiveWidth(79),
    maxHeight: responsiveHeight(50),
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
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
    minWidth: responsiveWidth(20),
    maxWidth: responsiveWidth(50),
    marginBottom: 5,
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    minWidth: responsiveWidth(20),
    maxWidth: responsiveWidth(50),
    marginBottom: 10,
    flexWrap: 'wrap',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
    textAlign: 'justify',
  },
  row1: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    // width: responsiveWidth(40),
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: 10,
  },
  date: {
    minWidth: responsiveWidth(20),
    maxWidth: responsiveWidth(50),
    maxHeight: responsiveHeight(40),

    marginBottom: 5,

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
    height: responsiveHeight(18),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
  },
  cancelIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },

  rowIcon1: {
    flexDirection: 'row',
    gap: 10,
    // marginBottom:10,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

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
    marginBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  rowIcon2: {
    flexDirection: 'row',
    gap: 10,
    // marginBottom:10,
    alignItems: 'center',
    // marginBottom: 20,
  },
});

export default FollowDetail;
