/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useCallback, useState} from 'react';
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
import {CommonActions, useFocusEffect, useNavigation} from '@react-navigation/native';
import {getStorageData, postMethod} from '../../../../utils/helper';
import colors from '../../../style/colors';
import {Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBarSearch from '../../../Component/AppBarSearch';

interface Props {
}

const CourseScreen: FC<Props> = ({navigation}) => {
  navigation=useNavigation()
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [results, setResults] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchCourses(currentPage);
    }, [currentPage]),
  );

  const fetchCourses = async (page: number) => {
    setLoading(true);
    try {
      const response: any = await postMethod('course-list');
      if (response.data) {
        console.log(response.data.courses, 'res0');
        setCourses(response.data.courses);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  
  };

  const sendId = (item,id) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseDetailScreen',
        params: {
          courseid: id,
          course: item,

        },
      }),
    );
  };

  const optFunction = async item => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    console.log(login_user);
    setLoading(true);
    try {
      const row = {
        loginuser: login_user,
        user: item.user_id,
        course_id: item.id,
      };
      console.log(row, item);
      const response: any = await postMethod('optnow', row);
      console.log(response.data, 'res');
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

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
    setLoading(false);
  };

  const renderStars = rating => {
    console.log(rating, 'rate');
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Icon key={i} name="star" type="material" color="orange" size={15} />,
        );
      }  else {
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
    <Card style={styles.card} key={item.id} onPress={() => sendId(item,item.id)}>
      <Image
        source={{uri: item.select_image}}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={[styles.row,{justifyContent:'space-between',}]}>
        <View style={styles.row}>
        <Icon
          name="yoga"
          type="material-community"
          color={'black'}
          size={15}
          style={styles.rowSpace}
        />
        <Text style={styles.text}>{item.name}</Text>
        </View>

        <View style={{marginLeft:5}}>
          <Text> {renderStars(item.review.averageRating)}</Text>
          <Text style={styles.review}> Reviews ({item.review.reviewCount})</Text>
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
      </View>

      <View style={styles.row}>
        {item.price ? (
          <>
            <Icon
              name="currency-inr"
              type="material-community"
              color={'gray'}
              size={15}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>{item.price}/Month</Text>
            </View>
          </>
        ) : null}
        <Pressable style={styles.btn} onPress={() => optFunction(item)}>
          <Text style={styles.text1}>Opt Now</Text>
        </Pressable>
      </View>
    </Card>
  );

  let bg = 'white';

  return (
    <View style={styles.container}>
      <AppBarSearch
       color={'white'}
       icon={'arrow-left'}
        setResults={setResults}
        setLoading={setLoading}
      />
      <Text style={styles.text0}>Courses</Text>
      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : (
        <>
          <FlatList
            data={results.length > 0 ? results : courses }
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={{paddingBottom: 20}}
            showsVerticalScrollIndicator={false}
          />
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

    backgroundColor: 'white',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: responsiveWidth(95),
    alignSelf: 'center',
  },
  logoImage: {
    width: responsiveWidth(15),
    height: responsiveHeight(5),
    padding: 10,
    marginBottom: 20,
  },
  text0: {
    width: responsiveWidth(88),
    alignSelf: 'center',

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginBottom: 5,
  },
  card: {
    width: responsiveWidth(88),
    backgroundColor: 'white',
    padding: 15,
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
    width: responsiveWidth(55),

    flexDirection: 'row',
    alignItems: 'flex-start',
    // gap:5,
    marginBottom: 5,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
  },
  rowSpace: {
    width: 25,
  },
  text: {
    width: responsiveWidth(51),

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.65),

  },
  review: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
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
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 0,
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
});

export default CourseScreen;
