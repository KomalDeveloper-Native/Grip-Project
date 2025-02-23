/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {getStorageData, getMethod} from '../../../utils/helper';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ArrowIcon from '../../Component/ArrowIcon';
import {ScrollView} from 'react-native-gesture-handler';

interface Props {}
const EventDetailScreen: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const {eventid} = route.params;
  console.log(eventid, 'tr');

  useFocusEffect(
    useCallback(() => {
      TrainerDetails();
    }, [eventid]),
  );

  const TrainerDetails = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    try {
      setLoading(true);
      const response: any = await getMethod(`event-detail?id=${eventid}`);
      setData(response.data.data);

      console.log(response.data.data.image, data.review.averageRating, 'res0');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
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
          size={20}
        />,
      );
    }
    return stars;
  };

  if (loading) {
    return <ActivityIndicator size={20} color="black" />;
  }

  let bg = 'white';

  return (
    <>
      <ArrowIcon iconName={'arrow-back'} navigation={navigation} />
      {data && (
        <ScrollView style={styles.container}>
          <Image
            source={{uri: data.image}}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <View style={styles.row}>
              <Text style={styles.text}>{data.title}</Text>
            </View>
            <View>
              <Text>{renderStars(data.review.averageRating)}</Text>
              <Text style={styles.review}>
                Reviews ({data.review.reviewCount})
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            {data.start_date || data.end_data ? (
              <>
                <Icon
                  name="clock-o"
                  type="font-awesome"
                  color="black"
                  size={20}
                  style={styles.rowSpace}
                />
                <Text style={styles.text1}>
                  {data.start_date} {data.evening_days}
                </Text>
              </>
            ) : null}
          </View>
          {data.start_time || data.end_time ? (
            <View style={styles.row}>
              <Icon
                name="calendar"
                type="font-awesome"
                color="black"
                size={20}
                style={styles.rowSpace}
              />

              <Text style={styles.text1}>
                {data.start_time} {data.end_time}
              </Text>
            </View>
          ) : null}
          <View style={styles.row}>
            {data.venue ? (
              <>
                <Icon
                  name="location-pin"
                  type="material"
                  color={'black'}
                  size={20}
                  style={styles.rowSpace}
                />
                <View style={styles.row1}>
                  <Text style={styles.text1}>{data.venue}</Text>
                </View>
              </>
            ) : null}
          </View>
          <View>
            <Text
              style={[
                styles.text,
                {marginLeft: 5, marginBottom: 10, marginTop: 5},
              ]}>
              Program Details
            </Text>

            <Text
              style={[
                styles.text1,
                {marginLeft: 0, marginBottom: 20, alignSelf: 'center'},
              ]}>
              {data.description}
            </Text>
          </View>
          <Pressable style={styles.tabBottom}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Roboto-Medium',
                fontSize: responsiveFontSize(2),
              }}>
              Know More
            </Text>
          </Pressable>
          <Pressable
            style={styles.tabBottom1}
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'AddTrainerReview',
                  params: {
                    Trainer_id: Trainer_id,
                    Trainer: data.trainer,
                  },
                }),
              )
            }>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Roboto-Medium',
                fontSize: responsiveFontSize(2),
              }}>
              Write a review
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,

    backgroundColor: 'white',
  },
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: responsiveWidth(95),
    alignSelf: 'center',
  },
  logoImage: {
    width: responsiveWidth(20),
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
    width: responsiveWidth(60),
    flexDirection: 'row',
    alignItems: 'center',
    // gap:5,
    marginBottom: 10,
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
    width: responsiveWidth(61),

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
    width: responsiveWidth(82),
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-black',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 0,
    letterSpacing: 1,
  },

  tabBottom: {
    width: '100%',
    height: responsiveHeight(7),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 1,
    borderColor: 'white',
    borderWidth: 2.5,
    position: 'static',
    // marginBottom: 10,
    alignSelf: 'center',
  },

  tabBottom1: {
    width: '100%',
    height: responsiveHeight(7),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 1,
    borderColor: 'black',
    borderWidth: 2.5,
    position: 'static',
    marginBottom: 10,
    alignSelf: 'center',
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

export default EventDetailScreen;
