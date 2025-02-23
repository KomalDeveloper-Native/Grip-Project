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
import colors from '../../style/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArrowIcon from '../../Component/ArrowIcon';
import {getStorageData, getMethod, postMethod} from '../../../utils/helper';
import {Icon} from 'react-native-elements';
import RetreatSearch from '../../Component/RetreatSearch';

interface Props {}

const RetreatScreen: FC<Props> = ({navigation}) => {
  // navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [retreat, setRetreat] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [results, setResults] = useState([]);
  const [retreatId, setReatreatId] = useState([]);
  const [userId, setUserId] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true); // Start refreshing
    setCurrentPage(1); // Reset to page 1 for fresh data
    await fetchretreat(1); // Fetch new data
    setRefreshing(false); // Stop refreshing when done
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAndProcessRetreats = async () => {
        const retreatData = await fetchretreat(currentPage);
        if (retreatData && retreatData.length > 0) {
          // Start with existing IDs
          const allIds = [...retreatId];

          // Add current retreat IDs
          retreatData.forEach(item => {
            allIds.push(item.id);
          });

          // Remove duplicates
          const uniqueIds = [...new Set(allIds)];
          console.warn(uniqueIds);
          setReatreatId(uniqueIds);

          // Call retreatImpression with updated retreatId state
          await retreatImpression(uniqueIds);
        }
      };

      fetchAndProcessRetreats();
    }, []),
  );

  useMemo(async () => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    setUserId(login_user);
  }, [userId]);

  const fetchretreat = async (page: number) => {
    setLoading(true);
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    const row = {
      current_user: login_user,
    };
    try {
      const response: any = await postMethod('retreat-list', row);
      setLoading(false);
      if (response.status === 200) {
        console.log(response.data.data, 'res5');
        setRetreat(response.data.data); // Set the retreat state
        return response.data.data; // Return retreat data
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return null;
    }
  };

  const retreatImpression = async retreatIds => {
    setLoading(true);
    try {
      const row = {
        userIP: 'jj',
        userCountry: 'jjj',
        dataArray: [{retreat: retreatIds}], // Use passed retreatIds
      };
      const response: any = await postMethod('tracking-site', row);
      setLoading(false);
      if (response.status === 200) {
        console.warn(response.data, row.dataArray, 'j');
      }
    } catch (error) {
      console.error(error);
      setLoading(false); // Ensure loading state is reset on error
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

  const sendId = (id, item) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'RetreatDetailsScreen',
        params: {
          retreatid: item.id,
          userid: item.user_id,
          loginUser: userId,
        },
      }),
    );
  };

  const AppplyFun = data => {
    navigation.navigate('RetreatApplyScreen', {
      retreatid: data.id,
      retreat: data,
    });
  };

  const renderItem = ({item}: any) => (
    <Card
      style={styles.card}
      key={item.id}
      onPress={() => sendId(item.id, item)}>
      <Image
        source={{uri: item.image}}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <View>
          <Text style={styles.text}>{item.title}</Text>
        </View>

        <View
          style={{
            // marginLeft: 20,
            width: responsiveWidth(80),
            justifyContent: 'center',
          }}>
          <Text>{renderStars(item.review.averageRating)}</Text>
          <Text style={styles.review}>Reviews ({item.review.reviewCount})</Text>
        </View>
      </View>
      <View style={styles.row}>
        {item.trainer ? (
          <>
            <Icon
              name="yoga"
              type="material-community"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <View>
              <Text style={styles.text1}>{item.trainer}</Text>
            </View>
          </>
        ) : null}
      </View>

      <View style={styles.row}>
        {item.location ? (
          <>
            <Icon
              name="location-on"
              type="material"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <View>
              <Text style={styles.text1}>{item.location}</Text>
            </View>
          </>
        ) : null}
      </View>
      <View style={styles.row}>
        {item.group_size ? (
          <>
            <Icon name="groups" type="material" size={25} color="#000" />
            <View>
              <Text style={styles.text1}>{item.group_size}</Text>
            </View>
          </>
        ) : null}
      </View>
      <View style={styles.row}>
        {item.no_of_days ? (
          <>
            <Icon
              name="weather-night"
              type="material-community"
              size={25}
              color="#000"
            />
            <View>
              <Text style={styles.text1}>
                {item.no_of_days} Days
                {item.No_of_nights
                  ? ` ${item.No_of_nights} & Night`
                  : null}{' '}
              </Text>
            </View>
          </>
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
            <View>
              <Text style={styles.text1}>{item.price}/Month</Text>
            </View>
          </>
        ) : null}
      </View>
      {item.apply_status ? (
        <Pressable
          style={[styles.btn, {backgroundColor: 'red'}]}
          onPress={() => AppplyFun(item)}>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(1.8),
              // marginLeft: 10,
            }}>
            REBOOK
          </Text>
        </Pressable>
      ) : userId === item.user_id ? null : (
        <Pressable style={styles.btn} onPress={() => AppplyFun(item)}>
          <Text style={styles.btnText}>BOOK NOW</Text>
        </Pressable>
      )}
    </Card>
  );

  let bg = 'white';

  return (
    <View style={styles.container}>
      <RetreatSearch
        color={bg}
        icon={'arrow-back'}
        setResults={setResults}
        setLoading={setLoading}
      />
      <Text style={styles.text0}>Retreat</Text>
      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : results.length > 0 ? (
        <FlatList
          data={results.length > 0 ? results : retreat}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{paddingBottom: 20}}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh} // Add this to trigger the refresh
          refreshing={refreshing}
        />
      ) : (
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            No data available👎👎 Check your spelling
          </Text>
        </View>
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
    alignItems: 'center',
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
    width: responsiveWidth(58),
    marginLeft: 5,
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    // marginBottom:5
  },
  text2: {
    width: responsiveWidth(68),
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
  btnText: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
    // marginLeft: 10,
  },

  text1: {
    flexWrap: 'wrap',
    // textAlign: 'center',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
    letterSpacing: 1,
    // marginBottom:5
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

export default RetreatScreen;
