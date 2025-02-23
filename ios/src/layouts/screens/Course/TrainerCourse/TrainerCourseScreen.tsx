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
      console.log(response.data.courses,'val');
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
            alignItems: 'flex-start',
            // marginBottom: -5,
          },
        ]}>
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="yoga"
            type="material-community"
            color={'black'}
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text}> {item.name}</Text>
        </View>
        <View>
          <Text> {renderStars(item.fullstar)}</Text>
          <Text style={styles.review}> Reviews ({item.totalreview})</Text>
        </View>
      </View>
      {item.created_at ? (
        <View style={styles.row}>
          <Icon
            name="calendar"
            type="font-awesome"
            color="#FFA500"
            size={15}
            style={styles.rowSpace}
          />
          <Text style={styles.text1}> {item.created_at}</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        {item.morning_days || item.evening_days ? (
          item.morning_days ? (
            <>
              <Icon
                name="wb-sunny"
                type="material"
                color="#FFA500"
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}> {item.morning_days}</Text>
            </>
          ) : (
            <>
              <Icon
                name="wb-sunny"
                type="material"
                color="#FFA500"
                size={15}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}> {item.evening_days}</Text>
            </>
          )
        ) : null}

        <View style={styles.row1}>
          {/* <View>
            <Text></Text>
          </View> */}
          <Icon
            name="check-circle"
            type="material"
            color={item.status === 'Active'? 'green' : 'red'}
            size={25}
          />
        </View>
      </View>

      <View style={[styles.row,{width:100}]}>
        {item.price ? (
          <>
            <Icon
              name="currency-inr"
              type="material-community"
              color={'gray'}
              size={15}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>{item.price}</Text>
          </>
        ) : null}

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
          <Icon name="groups" type="material" size={20} color="#000" />
          <Text style={styles.rowText}>Leads: {item.lead}</Text>
        </View>
        <View style={styles.rowColumn}>
          <Icon name="person-add" type="material" size={20} color="#000" />
          <Text style={styles.rowText}>Subscriptions: {item.subscription}</Text>
        </View>
        <View style={styles.rowColumn}>
          <Icon name="eye" type="font-awesome" size={20} color="#000" />
          <Text style={styles.rowText}>Impressions: {item.impression}</Text>
        </View>
        <View style={styles.rowColumn}>
          <Icon
            name="mouse-pointer"
            type="font-awesome"
            size={20}
            color="#000"
          />
          <Text style={styles.rowText}>Click: {item.clicks}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <MenuProvider>
      <View style={styles.container}>
        <View style={styles.row0}>
          <Image
            source={require('../../../img/one.jpeg')}
            style={styles.logoImage}
          />
          <View style={[styles.row, {marginBottom: 20}]}>
            <Icon
              name="plus"
              type="material-community"
              color={'black'}
              size={30}
              onPress={() => editCouse()}
            />
            <Icon name="search" color={'gray'} size={30} />
            <MenuPop navigation={navigation} course_id={courses.id} />
          </View>
        </View>
        <Text style={styles.text0}>Courses</Text>
        {loading ? (
          <ActivityIndicator size={20} color={colors.black} />
        ) : (
          <>
            {courses.length === 0 ? (
              <View style={styles.modalBackground1}>
                <View style={styles.modalContainer1}>
                  <View style={styles.rowIcon}>
                    <Text style={styles.menuText1}>
                      You don't have any course ! Please Add Course
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <FlatList
                data={courses}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
                contentContainerStyle={{paddingBottom: 20}}
                showsVerticalScrollIndicator={false}
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
  const NavFun = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TopNavigation',
        params: {
          courseid: course_id,
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
          <Pressable onPress={() => NavFun()}>
            <Text style={styles.menuText}>Subscription</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun()}>
            <Text style={styles.menuText}>Leads</Text>
          </Pressable>
        </MenuOption>
        <MenuOption>
          <Pressable onPress={() => NavFun()}>
            <Text style={styles.menuText}>Follow Ups</Text>
          </Pressable>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    padding: 20,
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
    padding: 10,
    marginBottom: 20,
  },
  text0: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginBottom: 5,
  },
  card: {
    width: responsiveWidth(88),
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  image: {
    width: responsiveHeight(40),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 1,
  },
  row1: {

    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  rowSpace: {
    width: 20,
  },
  text: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
  },
  review: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-regular',
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
    width: responsiveWidth(70),

    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.5),
    letterSpacing: 1,
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
    fontSize: responsiveFontSize(1.1),
    fontFamily: 'Roboto-Medium',
  },
  menuText1: {
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 20,
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
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default TrainerCourseScreen;
