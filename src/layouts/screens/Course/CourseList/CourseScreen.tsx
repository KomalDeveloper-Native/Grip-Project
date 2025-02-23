/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useCallback, useEffect, useId, useMemo, useState} from 'react';
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
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {getStorageData, postMethod} from '../../../../utils/helper';
import colors from '../../../style/colors';
import {Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBarSearch from '../../../Component/AppBarSearch';

interface Props {}

const CourseScreen: FC<Props> = ({navigation}) => {
  navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [results, setResults] = useState([]);
  const [userid, setUserId] = useState([]);
  const [courseIds, setCourseIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (results.length > 0) {
        setRefreshing(true);
        fetchCourses();
        setRefreshing(false);
      } else {
      }
      const fetchAndProcessCourses = async () => {
        const courseData = await fetchCourses();
        if (courseData && courseData.length > 0) {
          const allIds = [...courseIds];
          courseData.forEach(item => {
            allIds.push(item.id);
          });
          const uniqueIds = [...new Set(allIds)];
          console.warn(uniqueIds);
          setCourseIds(uniqueIds);
          await courseImpression(uniqueIds);
          onRefresh();
        }
      };
      fetchAndProcessCourses();
    }, []),
  );

  useMemo(async () => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    setUserId(login_user);
  }, [userid]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await postMethod('course-list');
      if (response.status === 200) {
        console.log(response.data.courses);
        setCourses(response.data.courses);
        return response.data.courses;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const courseImpression = async courseIds => {
    try {
      const row = {
        userIP: 'jj',
        userCountry: 'jjj',
        dataArray: [{course: courseIds}], // Use passed courseIds
      };
      const response = await postMethod('tracking-site', row);
      if (response.status === 200) {
        console.warn(response.data, row.dataArray, 'j');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendId = (item, id) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseDetailScreen',
        params: {
          courseid: id,
          course: item,
          login_user: userid,
        },
      }),
    );
  };

  const optFunction = async item => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;

    try {
      const row = {
        loginuser: login_user,
        user: item.user_id,
        course_id: item.id,
      };
      console.log(row, item);
      const response: any = await postMethod('optnow', row);
      if (response.data.success === true) {
        await AsyncStorage.setItem('name', JSON.stringify(item.name));
        await AsyncStorage.setItem('opt', JSON.stringify(response.data));
        Snackbar.show({
          text: response.data.message,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        navigation.dispatch(
          CommonActions.navigate({
            name: 'ChatList',
          }),
        );
      } else {
        const emailErrors = response?.data?.errors?.email ?? [];
        const message = response?.data?.message ?? '';
        const errorMessage = [...emailErrors, message].join('\n');
        Snackbar.show({
          text: errorMessage,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
    setLoading(false);
  };

  const renderStars = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Icon key={i} name="star" type="material" color="orange" size={15} />,
        );
      } else {
        stars.push(
          <Icon
            key={i}
            name="star-outline"
            type="material"
            color="orange"
            size={15}
          />,
        );
      }
    }
    return stars;
  };

  const renderItem = ({item}: any) => (
    <Card
      style={styles.card}
      key={item.id}
      onPress={() => sendId(item, item.id)}>
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
            width: responsiveWidth(85),
            alignSelf: 'center',
          },
        ]}>
        <View>
          <Text style={styles.text}>{item.name}</Text>
        </View>

        <View style={{marginLeft: 0}}>
          <Text>{renderStars(item.review.averageRating)}</Text>
          <Text style={styles.review}>Reviews ({item.review.reviewCount})</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Icon
          name="yoga"
          type="material-community"
          color={'black'}
          size={20}
          style={styles.rowSpace}
        />
        <Text>
          <Text style={styles.text1}>With {item.trainer}</Text>
        </Text>
      </View>

      {item.created_at ? (
        <View style={styles.row}>
          <Icon
            name="calendar"
            type="font-awesome"
            color="black"
            size={15}
            style={styles.rowSpace}
          />

          <Text style={styles.text1}>{item.created_at}</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        {item.morning_days || item.evening_days ? (
          item.morning_days ? (
            <>
              <Icon
                name="wb-sunny"
                type="material"
                color="black"
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.morning_days}</Text>
            </>
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

      <View style={styles.row}>
        {item.price ? (
          <>
            <Icon
              name="currency-inr"
              type="material-community"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>{item.price}/Month</Text>
            </View>
          </>
        ) : null}
      </View>
      {userid === item.user_id ? null : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // width: responsiveWidth(81),
          }}>
          <View>
            <Text></Text>
          </View>
          <Pressable style={styles.btn} onPress={() => optFunction(item)}>
            <Text
              style={[
                styles.text1,
                {color: 'white', fontSize: responsiveFontSize(1.8)},
              ]}>
              Join Now
            </Text>
          </Pressable>
        </View>
      )}
    </Card>
  );

  let bg = 'white';

  return (
    <View style={styles.container}>
      <AppBarSearch
        color={'white'}
        icon={'arrow-back'}
        setResults={setResults}
        setLoading={setLoading}
      />
      <Text style={styles.text0}>Courses</Text>

      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : (
        <>
          {results.length > 0 ? (
            <FlatList
              data={results.length > 0 ? results : courses}
              renderItem={renderItem}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={{paddingBottom: 20}}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                No data available👎👎 Check your spelling
              </Text>
            </View>
          )}
        </>
      )}
    </View>
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
    marginBottom: 20,
  },
  logoImage: {
    width: responsiveWidth(20),
    height: responsiveHeight(5),
  },

  text0: {
    width: responsiveWidth(88),
    alignSelf: 'center',

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(3),
    // marginBottom:-0
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
    width: responsiveHeight(40),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {
    width: responsiveWidth(55),

    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 5,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowSpace: {
    width: 25,
    alignItems: 'center',
  },
  text: {
    width: responsiveWidth(50),
    marginLeft: 5,
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
  },
  text2: {
    color: 'black',
    fontFamily: 'Roboto-regular',
    fontSize: 20,
    marginBottom: 0,
  },
  review: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginLeft: 8,
  },
  btn: {
    width: '100%',

    height: responsiveHeight(6),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 1,
    borderColor: 'white',
    position: 'static',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
  },

  text1: {
    flexWrap: 'wrap',
    // textAlign: 'center',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
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

  // Model
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
  button: {
    borderRadius: 20,
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

export default CourseScreen;
