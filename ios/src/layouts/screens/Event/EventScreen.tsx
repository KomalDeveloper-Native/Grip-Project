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
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {getMethod, getStorageData, postMethod} from '../../../utils/helper';
import colors from '../../style/colors';
import {Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventSearch from '../../Component/EventSearch';

interface Props {}

const EventScreen: FC<Props> = ({navigation}) => {
  navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState([]);
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
      const response: any = await getMethod('event-list');
      if (response.data) {
        console.log(response.data.data, 'res0');
        setEvent(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
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

  
  const sendId = id => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EventDetailScreen',
        params: {
          eventid: id,
        },
      }),
    );
  };

  const renderItem = ({item}: any) => (
    <Card
      style={styles.card}
      key={item.id}
    >
      <Image
        source={{uri: item.image}}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <View style={styles.row}>
     
          <Text style={styles.text}>{item.title}</Text>
        </View>
        <View>
          <Text> {renderStars(item.review.averageRating)}</Text>
          <Text style={styles.review}> Reviews ({item.review.reviewCount})</Text>
        </View>
      </View>

      <View style={styles.row}>
        {item.start_date || item.end_data ? (
          <>
            <Icon
              name="clock-o"
             type="font-awesome"
            color="black"
              size={15}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>
              {item.start_date} {item.evening_days}
            </Text>
          </>
        ) : null}
      </View>
      {item.start_time || item.end_time ? (
        <View style={styles.row}>
          <Icon
            name="calendar"
            type="font-awesome"
            color="black"
            size={15}
            style={styles.rowSpace}
          />

          <Text style={styles.text1}>
            {item.start_time} {item.end_time}
          </Text>
        </View>
      ) : null}
      <View style={styles.row}>
        {item.venue ? (
          <>
            <Icon
              name="location-pin"
              type="material"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>{item.venue}</Text>
            </View>
          </>
        ) : null}
        
      <Pressable style={styles.btn} onPress={() => sendId(item.id)}>
        <Text style={styles.btnText}>Book Now</Text>
      </Pressable>
      </View>

 
    </Card>
  );

  let bg = 'white';

  return (
    <View style={styles.container}>
      <EventSearch
        color={'white'}
        icon={'arrow-left'}
        setResults={setResults}
        setLoading={setLoading}
      />
      <Text style={styles.text0}>Event</Text>
      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : (
        <>
          <FlatList
            data={results.length > 0 ? results : event}
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
    alignItems: 'center',
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
    color: 'black',
    fontFamily: 'Roboto-Bold',
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
    backgroundColor: 'black',
    elevation: 5.5,
    borderRadius: 8,
    color: 'black',
  },
  btnText: {
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'white',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 0,
    letterSpacing: 1,
  },
  text1: {
    width: responsiveWidth(52),

    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.5),
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

export default EventScreen;
