/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useCallback, useEffect, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import {Card} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {getStorageData, postMethod} from '../../../../utils/helper';
import colors from '../../../style/colors';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {setId} from '../../../../Redux/ListSlice ';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from 'react-native-popup-menu';
import {id} from 'date-fns/locale';

interface Props {
  navigation: any;
}

const TrainerCourseScreen: FC<Props> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchCourses();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, []),
  );

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const storage = await getStorageData();
      const id = storage.response.user.id;
      dispatch(setId(id));
      console.log(id, 'id');
      const response: any = await postMethod(`user-course-list?id=${id}`);
      setCourses(response.data.courses);
      console.log(response.data.courses, 'val');
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          type="material"
          color={i <= rating ? 'orange' : 'orange'}
          size={15}
        />,
      );
    }
    return stars;
  };

  const sendId = (item: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TrainerDetailScreen',
        params: {
          course_id: item.id,
        },
      }),
    );
  };

  const editCouse = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'NewCourseScreen',
      }),
    );
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderItem = ({item}: any) => (
    <Card style={styles.card} key={item.id} onPress={() => sendId(item)}>
      <View style={{width: responsiveWidth(85), alignSelf: 'center'}}>
        <Image
          source={{uri: item.select_image}}
          style={styles.image}
          resizeMode="contain"
        />
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
              // marginBottom: -5,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 5,
            }}>
            <Icon
              name="meditation"
              type="material-community"
              color={'black'}
              size={25}
              style={styles.rowSpace}
            />
            <Text style={styles.text}>{item.name}</Text>
          </View>
          <View>
            <Text>{renderStars(item.fullstar)}</Text>
            <Text style={styles.review}>Reviews({item.totalreview})</Text>
          </View>
        </View>
        {item.morning_timing ? (
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <Icon
              name="wb-sunny"
              type="material"
              color="black"
              size={20}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>{item.morning_timing}</Text>
          </View>
        ) : null}

        <View style={[styles.row, {marginBottom: 5}]}>
          <View style={{width: responsiveWidth(78), flexDirection: 'row'}}>
            {item.morning_days || item.evening_days ? (
              item.morning_days ? (
                <View
                  style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                  <Icon
                    name="calendar"
                    type="font-awesome"
                    color="black"
                    size={20}
                    style={styles.rowSpace}
                  />
                  <Text style={styles.text1}>{item.morning_days}</Text>
                </View>
              ) : (
                <>
                  <Icon
                    name="wb-sunny"
                    type="material"
                    color="black"
                    size={20}
                    style={styles.rowSpace}
                  />
                  <Text style={styles.text1}>{item.evening_days}</Text>
                </>
              )
            ) : null}
          </View>

          <View style={styles.row1}>
            <Icon
              name="check-circle"
              type="material"
              color={item.status === 'Active' ? 'green' : 'red'}
              size={25}
            />
          </View>
        </View>

        <View style={[styles.row, {marginBottom: 5}]}>
          <View
            style={{
              width: responsiveWidth(78),
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            {item.price ? (
              <>
                <Icon
                  name="currency-inr"
                  type="material-community"
                  color={'black'}
                  size={20}
                  style={styles.rowSpace}
                />
                <Text style={styles.text1}>{item.price}</Text>
              </>
            ) : null}
          </View>
          <View style={styles.row1}>
            {/* <Text></Text> */}
            <Icon
              name="campaign"
              type="material"
              size={25}
              color={item.promote === 'Inactive' ? 'red' : 'green'}
            />
          </View>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.rowColumn}>
            <Icon name="groups" type="material" size={25} color="#000" />
            <Text style={styles.rowText}>Leads: {item.lead}</Text>
          </View>
          <View style={styles.rowColumn}>
            <Icon name="person-add" type="material" size={25} color="#000" />
            <Text style={styles.rowText}>
              Subscriptions: {item.suscription}
            </Text>
          </View>
          <View style={styles.rowColumn}>
            <Icon name="eye" type="font-awesome" size={25} color="#000" />
            <Text style={styles.rowText}>Impressions: {item.impression}</Text>
          </View>
          <View style={styles.rowColumn}>
            <Icon
              name="mouse-pointer"
              type="font-awesome"
              size={25}
              color="#000"
            />
            <Text style={styles.rowText}>Clicks: {item.clicks}</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <MenuProvider>
      <View style={styles.container}>
        <View style={styles.row0}>
          <View style={[styles.row, {alignItems: 'center'}]}>
            <Icon
              name="arrow-back"
              type="material"
              color="black"
              size={25}
              onPress={() => navigation.goBack()}
            />
            <Image
              source={require('../../../img/one.jpeg')}
              style={styles.logoImage}
            />
          </View>

          <View style={[styles.row, {marginBottom: 25}]}>
            <Icon
              name="plus"
              type="material-community"
              color={'black'}
              size={30}
              onPress={() => editCouse()}
            />
            {/* <Icon name="search" color={'gray'} size={30} /> */}
            <MenuPop navigation={navigation} course_id={courses.id} />
          </View>
        </View>
        <Text style={styles.text0}>Courses</Text>
        {loading ? (
          <ActivityIndicator size={25} color={colors.black} />
        ) : (
          <>
            {courses.length < 1 ? (
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Oops.. no courses yet. Add Now
                </Text>
              </View>
            ) : (
              <FlatList
                data={courses}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
                contentContainerStyle={{paddingBottom: 25}}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            )}
          </>
        )}
      </View>
    </MenuProvider>
  );
};

export const MenuPop = ({navigation, course_id}: any) => {
  const trainerId = useSelector(state => state.List.id);
  const NavFun = screen => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TopNavigation',
        params: {
          courseid: course_id,
          screen: screen,
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
            <Pressable onPress={() => NavFun('SubscriptionList')}>
              <Text style={styles.menuText}>Subscription</Text>
            </Pressable>
          </MenuOption>
          <MenuOption>
            <Pressable onPress={() => NavFun('LeadList')}>
              <Text style={styles.menuText}>Leads</Text>
            </Pressable>
          </MenuOption>
          <MenuOption>
            <Pressable onPress={() => NavFun('FollowUpScreen')}>
              <Text style={styles.menuText}>Follow Ups</Text>
            </Pressable>
          </MenuOption>
        </View>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    padding: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoImage: {
    width: responsiveWidth(15),
    height: responsiveHeight(5),
  },
  text0: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 25,
    marginBottom: 5,
    marginLeft: 5,
  },
  card: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 20,
    marginTop: 5,
    alignSelf: 'center',
  },
  image: {
    width: responsiveWidth(80),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginBottom: 5,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {

    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:5

  },
  row1: {
    width: responsiveWidth(70),
    alignItems: 'flex-end',
    textAlign: 'right',
    flexDirection: 'row-reverse',
  },
  rowSpace: {
    width: 25,
    alignItems: 'center',
  },
  text: {
    width: responsiveWidth(55),
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',

    color: 'black',
    textAlign: 'justify',
  },
  review: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-regular',
    marginLeft: 8.5,
  },
  btn: {
    width: responsiveWidth(21),
    height: responsiveHeight(3.8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 5.5,
    borderRadius: 8,
    color: 'black',
  },
  text1: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  rowColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  rowText: {
    color: 'black',
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Roboto-Medium',
  },
  menuText1: {
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 25,
  },

  // Modal

  modalBackground1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  },
  modalContainer1: {
    width: responsiveWidth(60),
    height: responsiveHeight(18),
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
    alignSelf: 'center',
    textAlign: 'center',
  },

  rowIcon: {},
  rowIcon1: {
    flexDirection: 'row',
  },
  menuText: {
    color: colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(2),
  },
  // Model
  modalView: {
    margin: 25,
    backgroundColor: 'white',
    borderRadius: 25,
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
  button: {
    borderRadius: 25,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: 'black',
  },
});

export default TrainerCourseScreen;
