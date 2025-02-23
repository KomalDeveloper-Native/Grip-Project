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
import {getStorageData, getMethod, postMethod} from '../../../utils/helper';
import {Icon} from 'react-native-elements';
import {RetreatApplyScreen} from '../Apply/RetreatApplyScreen';
import RetreatReviewScreen from './RetreatReviewScreen';

interface Props {}
const RetreatDetailsScreen: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [status, setStatus] = useState(false);
  const [results, setResults] = useState(null);
  const {retreatid, userid, loginUser} = route.params;

  useFocusEffect(
    useCallback(() => {
      RetreatDetails();
      retreatImpression()
    }, [retreatid]),
  );

  const RetreatDetails = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    const row = {
      current_user: id,
    };
    try {
      setLoading(true);

      const response: any = await postMethod(
        `retreat-detail?id=${retreatid}`,
        row,
      );
      if (response.status === 200) {
        setData(response.data.data);
        console.log(response.data.data, 'response.data');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const retreatImpression = async () => {
    setLoading(true);
    try {
      const row = {
        userIP: 'jj',
        userCountry: 'jjj',
        dataArray: [
          {
            retreat: [retreatid], // Send the entire array of IDs
          },
        ],
      };
      const response: any = await postMethod('tracking-site', row);
      if (response.status===200) {
        console.warn(response.data,row.dataArray ,'j');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false); // Ensure loading state is reset on error
    }
  };

  const renderStars = rating => {
    const stars = [];

    // Cap the rating at 5 for display purposes
    const cappedRating = Math.min(rating, 5);
    const fullStars = Math.floor(cappedRating);
    const hasHalfStar = cappedRating > fullStars;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Icon key={i} name="star" type="material" color="orange" size={15} />,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Icon
            key={i}
            name="star-half"
            type="material"
            color="orange"
            size={15}
          />,
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

  const sendId = data => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'RetreatApplyScreen',
        params: {
          retreatid: data.id,
          retreat: data,
        },
      }),
    );
  };
  console.log(loginUser, userid, 'jjj');

  if (loading) {
    return <ActivityIndicator size={20} color="black" />;
  }

  return (
    <>
      <ArrowIcon navigation={navigation} />
      <View style={styles.container}>
        <ScrollView>
          {data && (
            <>
              <Image source={{uri: data.image}} style={styles.image} />
              <View style={styles.content}>
                <Text style={styles.title}>{data.title}</Text>
                <View style={styles.review}>
                  {data.review ? (
                    <>
                      <Text >
                        {renderStars(data.review.averageRating)}
                      </Text>
                      <Text style={styles.name}>
                        Reviews ({data.review.reviewCount})
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.title}>No Reviews Available</Text>
                  )}
                </View>
              </View>

              <View style={styles.row}>
                {data.location && (
                  <>
                    <Icon name="location-pin" type="entypo" size={20} />
                    <Text style={styles.text1}>{data.location}</Text>
                  </>
                )}
              </View>
              <View style={styles.row}>
                {data.group_size && (
                  <>
                    <Icon name="groups" type="material" size={25} />
                    <Text style={styles.text1}>{data.group_size} People</Text>
                  </>
                )}
              </View>
              <View style={styles.row}>
                {data.price && (
                  <>
                    <Icon
                      name="currency-inr"
                      type="material-community"
                      color="black"
                      size={20}
                    />
                    <Text style={styles.text1}>{data.price}/Month</Text>
                  </>
                )}
              </View>
              <View style={styles.row}>
                {data.no_of_days && (
                  <>
                    <Icon
                      name="weather-night"
                      type="material-community"
                      size={25}
                    />
                    <Text style={styles.text1}>{data.no_of_days} Days</Text>
                  </>
                )}
              </View>
     
              <View style={styles.row}>
                <Icon
                  name="alert-circle" // or "alert" or "exclamation" based on your needs
                  type="material-community"
                  size={25}
                />
                  <Text style={[styles.title,{marginLeft:5}]}>Program Details</Text>
                  <Text style={[styles.text1, {marginBottom: 20}]}>
                    {data['Program Details']}
                  </Text>
              </View>
            </>
          )}
          <RetreatReviewScreen navigation={navigation} retreatid={retreatid}/>
      
        </ScrollView>
        {data.apply_status ? (
            <Pressable style={[styles.tabBottom,{backgroundColor:'red'}]}
            onPress={() => sendId(data)}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: responsiveFontSize(2),
                  // width: responsiveWidth(80),
                
                }}>
                  REBOOK
              </Text>
            </Pressable>
          ) : (
            userid === data.user_id ? null : (
              <Pressable style={styles.tabBottom} onPress={() => sendId(data)}>
                <Text style={styles.btnText}>BOOK NOW</Text>
              </Pressable>
            )
          )}

          <Pressable
            style={styles.tabBottom1}
            onPress={() =>
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'RetreatWriteReview',
                  params: {
                    retreatid: retreatid,
                    retreat: data,
                  },
                }),
              )
            }>
            <Text style={[styles.btnText,{color:'black'}]}>Write A Review</Text>
          </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 10,
    paddingHorizontal: 20,
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
    width: responsiveWidth(68),
    fontFamily: 'Roboto-Regular',
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    // marginBottom: 10,
  },
  title: {
    width: responsiveWidth(68),
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(2),
  },
  name: {
    width: responsiveWidth(68),

    fontFamily: 'Roboto-Regular',
    color: 'black',
    fontSize: responsiveFontSize(1.7),
    marginLeft:responsiveWidth(1.5)

  },
  row: {
    width: responsiveWidth(68),
    flexDirection: 'row',
    gap:10,
    // justifyContent: 'space-between',
    marginBottom: 5,
  },
  conainer1: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 20,
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
    marginBottom: 10,
    alignSelf: 'center',
  },
  tabBottom1: {
    width: '100%',
    height: responsiveHeight(7),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    elevation: 1,
    borderColor: 'white',
    borderWidth: 2.5,
    position: 'static',
    marginBottom: 20,
    alignSelf: 'center',
  },

  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  rowSpace: {
    width: 25,
    alignItems:'center'
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
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2),
    marginBottom: 0,
    // letterSpacing: 1,
  },
  text1: {
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 0,
    letterSpacing: 1,
    // marginLeft: -2,
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
