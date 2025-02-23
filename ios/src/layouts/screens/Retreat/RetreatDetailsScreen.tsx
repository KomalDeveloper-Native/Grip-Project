/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Card} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ArrowIcon from '../../Component/ArrowIcon';
import {getStorageData, getMethod } from '../../../utils/helper';
import {Icon} from 'react-native-elements';

interface Props {}
const RetreatDetailsScreen: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState(false);
  const [results, setResults] = useState(null);
  const {retreatid} = route.params;
  console.log(retreatid, 'tr');

  useFocusEffect(
    useCallback(() => {
      TrainerDetails();
    }, [retreatid]),
  );

  const TrainerDetails = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    try {
      setLoading(true);
      const response: any = await getMethod(`retreat-detail?id=${retreatid}`);
      if (response.status === 200) {
        setData(response.data.data);
        console.log(response.data, 'response.data');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
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

  const handlePress = ({data}) => {
    const url = data;
    console.log('URL:', data); // Debugging

    // Linking.openURL(url).catch(err =>
    //   Alert.alert('Error', "Couldn't load page"),
    // );
  };

  if (loading) {
    return <ActivityIndicator size={20} color="black" />;
  }

  let bg = 'white';
  return (
    <>
      <ArrowIcon iconName={'arrow-back'} navigation={navigation} />
      <View style={styles.container}>
        <ScrollView>
          {data && (
            <>
              <Image source={{uri: data.image}} style={styles.image} />
              <View style={styles.content}>
                <View>
                  {/* <Text style={styles.name}>{data.trainer.name}</Text> */}
                  <Text style={styles.title}>{data.title}</Text>
                </View>
                <View style={{width: 80}}>
                  <Text style={styles.name}>
                    {renderStars(data.review.averageRating)}
                  </Text>
                  <Text style={styles.title}>
                    Reviews ({data.review.reviewCount})
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                {data.location ? (
                  <>
                    <Icon name="location-pin" type="entypo" size={20} />

                    <View style={styles.row1}>
                      <Text style={styles.text1}> {data.location}</Text>
                    </View>
                  </>
                ) : null}
              </View>
              <View style={styles.row}>
                {data.group_size ? (
                  <>
                    <Icon
                      name="groups"
                      type="material"
                      size={25}
                      color="#000"
                    />
                    <View style={styles.row1}>
                      <Text style={styles.text1}>{data.group_size} People</Text>
                    </View>
                  </>
                ) : null}
              </View>
              <View style={styles.row}>
                {data.no_of_days ? (
                  <>
                    <Icon
                      name="weather-night"
                      type="material-community"
                      size={25}
                      color="#000"
                    />
                    <View style={styles.row1}>
                      <Text style={styles.text1}>
                        {data.no_of_days} Days{' '}
                        {data.No_of_nights
                          ? ` ${data.No_of_nights} & Night`
                          : null}{' '}
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>

              <View style={styles.row}>
                {data.price ? (
                  <>
                    <Icon
                      name="currency-inr"
                      type="material-community"
                      color={'gray'}
                      size={15}
                      style={styles.rowSpace}
                    />
                    <View style={styles.row1}>
                      <Text style={styles.text1}>{data.price}/Month</Text>
                    </View>
                  </>
                ) : null}
              </View>
              <View>
                <View style={styles.row}>
                  <Icon
                    name="exclamation-circle"
                    type="font-awesome"
                    color="black"
                    size={20}
                  />
                  <Text
                    style={[
                      styles.title,
                      {marginLeft: 0, marginBottom: 10, marginTop: 5},
                    ]}>
                    Program Details
                  </Text>
                </View> 

                <Text style={[styles.text1, {marginLeft: 0, marginBottom: 20}]}>
                  {data['Program Details']}
                </Text>
              </View>
            </>
          )}
          <Pressable
            style={styles.tabBottom}
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
                color: 'white',
                fontFamily: 'Roboto-Medium',
                fontSize: responsiveFontSize(2),
              }}>
              Join Now
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
              Write A Review
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 10,
    paddingHorizontal: 15,
    // alignItems: 'flex-start',
  },
  image: {
    width: responsiveWidth(100),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  image0: {
    width: responsiveWidth(70),
    height: responsiveHeight(20),
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  content: {
    width: responsiveWidth(90),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  text: {
    width: 337,
    fontFamily: 'Roboto-Regular',
    color: 'black',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 10,
  },
  title: {
    width: responsiveWidth(65),
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(1.8),
  },
  name: {
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(2.1),
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  conainer1: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 15,
  },
  conainer2: {
    marginHorizontal: 0,
  },
  scrollSlide: {
    width: responsiveWidth(75),
    backgroundColor: 'white',
    marginBottom: 20,
    marginTop: 10,
    padding: 10,

    marginRight: 10,
    marginLeft: 5,
  },
  image3: {
    width: responsiveWidth(70),
    height: responsiveHeight(20),
    resizeMode: 'cover',
    borderRadius: 20,
    marginBottom: 10,
  },

  row3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  text2: {
    width: responsiveWidth(88),
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: responsiveFontSize(2.1),
    alignSelf: 'center',
  },
  text3: {
    fontFamily: 'Roboto-Regular',
    color: 'black',
    fontSize: responsiveFontSize(1.55),
  },
  text4: {
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: responsiveFontSize(1.9),
  },
  review: {
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Regular',
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

  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  rowSpace: {
    width: 25,
  },

  btn: {
    width: responsiveWidth(21),
    height: responsiveHeight(3.8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 5.5,
    borderRadius: 8,
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
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.55),
    marginBottom: 0,
    letterSpacing: 1,
    marginLeft: 10,
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

export default RetreatDetailsScreen;
