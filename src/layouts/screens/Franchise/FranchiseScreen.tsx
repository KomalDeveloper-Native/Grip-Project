/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import {getStorageData, postMethod} from '../../../utils/helper';
import colors from '../../style/colors';
import {Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBarSearch from '../../Component/AppBarSearch';
import FranchiseSearch from '../../Component/FranchiseSearch';

interface Props {}

const FranchiseScreen: FC<Props> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [franchise, setFranchise] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [results, setResults] = useState([]);
  const [franchiseId, setFranchiseid] = useState([]);
  const [userId, setUserId] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true); // Start refreshing
    setCurrentPage(1); // Reset to page 1 for fresh data
    await fetchCourses(1); // Fetch new data
    setRefreshing(false); // Stop refreshing when done
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAndProcessFranchises = async () => {
        const franchiseData = await fetchCourses(currentPage);
        if (franchiseData && franchiseData.length > 0) {
          const allIds = [...franchiseId];
          franchiseData.forEach(item => {
            allIds.push(item.id);
          });
          const uniqueIds = [...new Set(allIds)];
          console.warn(uniqueIds);
          setFranchiseid(uniqueIds);
          await franchiseImpression(uniqueIds);
        }
      };

      fetchAndProcessFranchises();
    }, []),
  );

  const fetchCourses = async page => {
    setLoading(true);
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    setUserId(login_user);
    const row = {
      current_user: login_user,
    };

    try {
      const response = await postMethod('franchise-list', row);
      if (response.status === 200) {
        setFranchise(response.data.data); // Set franchise data state
        console.error(response.data, 'j');

        setLoading(false);
        return response.data.data; // Return fetched franchise data
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return null;
    }
  };

  const franchiseImpression = async franchiseIds => {
    setLoading(true);
    try {
      const row = {
        userIP: 'jj',
        userCountry: 'jjj',
        dataArray: [
          {
            franchise: franchiseIds, // Use passed franchise IDs
          },
        ],
      };
      const response = await postMethod('tracking-site', row);
      if (response.status === 200) {
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const sendId = (data, id) => {
    console.error(data.user_id, userId);
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FranchiseDetailScreen',
        params: {
          franchiseid: id,
          loginUser: userId,
          userid: data.user_id,
        },
      }),
    );
  };

  const ApplyId = id => {
    // console.log(data)
    // FranchiseScreen
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FranchiseApply',
        params: {
          franchiseid: id,
        },
      }),
    );
  };

  const renderItem = ({item}: any) => (
    <Card
      style={styles.card}
      key={item.id}
      onPress={() => sendId(item, item.id)}>
      <Text style={styles.text}>{item.title}</Text>
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

            <Text style={styles.text1}>{item.trainer}</Text>
          </>
        ) : null}
      </View>
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <View style={styles.row}>
          <Text
            style={[
              styles.text,
              {fontFamily: 'Roboto-Medium', fontSize: responsiveFontSize(1.8),marginBottom:0},
            ]}>
            {item.services_offerings}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        {item.year_of_establishment ? (
          <>
            <Icon
              name="calendar"
              type="material-community"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>{item.year_of_establishment}</Text>
            </View>
          </>
        ) : null}
      </View>
      <View style={styles.row}>
        {item.space_required ? (
          <>
            <Icon
              name="home-map-marker"
              type="material-community"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>{item.space_required}</Text>
            </View>
          </>
        ) : null}
      </View>

      <View style={styles.row}>
        {item.investment_required ? (
          <>
            <Icon
              name="hand-coin"
              type="material-community"
              size={20}
              color="#000"
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>₹{item.investment_required}</Text>
            </View>
          </>
        ) : null}
      </View>
      {item.apply_status ? (
        <Pressable
          style={[styles.btn, {backgroundColor: 'red'}]}
          onPress={() => ApplyId(item.id)}>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(1.8),
              textAlign: 'center',
              // width: responsiveWidth(80),
            }}>
            SHOW INTEREST AGAIN
          </Text>
        </Pressable>
      ) : userId === item.user_id ? null : (
        <Pressable style={styles.btn} onPress={() => ApplyId(item.id)}>
          <Text style={styles.btnText}>SHOW INTEREST</Text>
        </Pressable>
      )}
    </Card>
  );

  let bg = 'white';

  return (
    <View style={styles.container}>
      <FranchiseSearch
        color={'white'}
        icon={'arrow-back'}
        setResults={setResults}
        setLoading={setLoading}
        navigation={navigation}
      />

      <View>
        <Text style={styles.text0}>Franchise</Text>
      </View>

      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : (
        <>
          {results.length > 0 ? (
            <FlatList
              data={results.length > 0 ? results : franchise}
              renderItem={renderItem}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={{paddingBottom: 20}}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing} // Bind the refreshing state
                  onRefresh={onRefresh} // Trigger the refresh on pull
                />
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
    width: responsiveWidth(85),
    alignSelf: 'center',

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(3),
    // marginBottom: 5,
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
    width: responsiveWidth(82),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginBottom: 5,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  row1: {
    width: responsiveWidth(70),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSpace: {
    width: 25,
    alignItems: 'center',
  },
  text: {
    width: responsiveWidth(81),
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    marginLeft: 5,
    marginBottom: 5,textAlign:'justify'
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
    // borderWidth: 2.7,
    position: 'static',
    // marginTop: 10,
    alignSelf: 'center',
    // marginLeft:20
    marginTop: 5,
    marginBottom: 5,
  },
  btnText: {
    flexWrap: 'wrap',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.8),
    marginBottom: 0,
    letterSpacing: 1,
  },
  text1: {
    width: responsiveWidth(75),
    flexWrap: 'wrap',
    textAlign: 'justify',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 5,
    letterSpacing: 1,
    marginLeft: 5,
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
  course: {
    width: responsiveWidth(85),
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    letterSpacing: 1,
    color: 'black',
    marginLeft: 5,
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
    marginBottom: 20,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: 'black',
  },
});

export default FranchiseScreen;
