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
import colors from '../../style/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArrowIcon from '../../Component/ArrowIcon';
import {getStorageData, getMethod, postMethod} from '../../../utils/helper';
import {Icon} from 'react-native-elements';
import JobSearch from '../../Component/JobSearch';
import {current} from '@reduxjs/toolkit';

interface Props {}

const JobScreen: FC<Props> = ({navigation}) => {
  navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [results, setResults] = useState([]);
  const [jobId, setJobId] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState([]);

  const onRefresh = async () => {
    setRefreshing(true); // Start refreshing
    setCurrentPage(1); // Reset to page 1 for fresh data
    await fetchJob(); // Fetch new data
    setRefreshing(false); // Stop refreshing when done
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAndProcessJobs = async () => {
        const jobData = await fetchJob();
        if (jobData && jobData.length > 0) {
          const allIds = [...jobId];
          jobData.forEach(item => {
            allIds.push(item.id);
          });

          const uniqueIds = [...new Set(allIds)];
          setJobId(uniqueIds);
          console.warn(uniqueIds);
          await jobImpression(uniqueIds);
        }
      };

      fetchAndProcessJobs();
    }, []),
  );

  const fetchJob = async () => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    setUserId(login_user);
    console.log(login_user, 'jjj');
    setLoading(true);
    const row = {
      current_user: login_user,
    };

    try {
      const response = await postMethod('career-list', row);
      setLoading(false);
      if (response.status === 200) {
        setJob(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return null;
    }
  };

  const jobImpression = async jobIds => {
    try {
      const row = {
        userIP: 'jj',
        userCountry: 'jjj',
        dataArray: [{job: jobIds}], // Use jobIds parameter
      };
      const response = await postMethod('tracking-site', row);
      if (response.status === 200) {
        console.warn(response.data, row.dataArray, 'j');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendId = id => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'JobDetailScreen',
        params: {
          jobid: id,
          loginUser: userId,
        },
      }),
    );
  };

  const ApplyFun = data => {
    console.log(data, 'jj');
    // jobScreen
    navigation.dispatch(
      CommonActions.navigate({
        name: 'JobApplyScreen',
        params: {
          jobid: data.id,
          apply: data.apply_status,
        },
      }),
    );
  };

  const renderItem = ({item}: any) => (
    <Card style={styles.card} key={item.id} onPress={() => sendId(item.id)}>
      <Text style={styles.text}>{item.job_title}</Text>
      <Text
        style={[
          styles.text,
          {fontFamily: 'Roboto-Medium', marginBottom: 5},
        ]}>
        {item.job_description}
      </Text>
      <View style={styles.row}>
        {item.job_type ? (
          <>
            <Icon name="laptop" type="material" size={20} color="#000" />
            <View style={styles.row1}>
              <Text style={styles.text1}>{item.job_type}</Text>
            </View>
          </>
        ) : null}
      </View>

      <View style={styles.row}>
        {item.location ? (
          <>
            <Icon
              name="location-pin"
              type="material"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>
                {item.location_type} {item.location}
              </Text>
            </View>
          </>
        ) : null}
      </View>
      <View style={styles.row}>
        {item.pay_range ? (
          <>
            <Icon
              name="currency-inr"
              type="material-community"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>{item.pay_range}/Month</Text>
            </View>
          </>
        ) : null}
      </View>

      {item.apply_status ? (
        <Pressable style={[styles.btn, {backgroundColor: 'red'}]}>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(1.8),
              textAlign: 'center',
              // width: responsiveWidth(80),
            }}>
            ALREADY APPLIED
          </Text>
        </Pressable>
      ) : userId === item.id ? null : (
        <Pressable style={styles.btn} onPress={() => ApplyFun(item)}>
          <Text style={styles.btnText}>APPLY NOW</Text>
        </Pressable>
      )}
    </Card>
  );

  let bg = 'white';

  return (
    <View style={styles.container}>
      <JobSearch
        color={'white'}
        icon={'arrow-back'}
        setResults={setResults}
        setLoading={setLoading}
      />
      <Text style={styles.text0}>Jobs</Text>
      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : (
        <>
          {results.length > 0 ? (
            <FlatList
              data={results.length > 0 ? results : job}
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
    width: responsiveWidth(78),
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    marginLeft: 5,
    textAlign:'justify',
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
    borderWidth: 2.5,
    position: 'static',
    // marginBottom: 10,
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  btnText: {
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'white',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.8),
    marginBottom: 0,
    letterSpacing: 1,
  },
  text1: {
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
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

export default JobScreen;
