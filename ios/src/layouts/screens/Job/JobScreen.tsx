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
import colors from '../../style/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArrowIcon from '../../Component/ArrowIcon';
import {getStorageData, getMethod, postMethod} from '../../../utils/helper';
import {Icon} from 'react-native-elements';
import JobSearch from '../../Component/JobSearch';

interface Props {}

const JobScreen: FC<Props> = ({navigation}) => {
  navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [retreat, setRetreat] = useState([]);
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
      const response: any = await postMethod('career-list');
      if (response.data) {
        console.log(response.data.data, 'res0');
        setRetreat(response.data.data);
      }
      setLoading(false);
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
        },
      }),
    );
  };

  const renderItem = ({item}: any) => (
    <Card style={styles.card} key={item.id}>
      <Text style={styles.text}>{item.job_title}</Text>
      <Text
        style={[styles.text, {fontFamily: 'Roboto-SemiBold', width: '100%',marginBottom:5}]}>
        {item.job_description}
        
      </Text>

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
        {item.job_type ? (
          <>
            <Icon name="laptop" type="material" size={20} color="#000" />
            <View style={styles.row1}>
              <Text style={styles.text1}>{item.job_type}</Text>
            </View>
          </>
        ) : null}
      </View>

      <Pressable style={styles.btn} onPress={() => sendId(item.id)}>
        <Text style={styles.btnText}>Apply</Text>
      </Pressable>
    </Card>
  );

  let bg = 'white';

  return (
    <View style={styles.container}>
      <JobSearch
        color={'white'}
        icon={'arrow-left'}
        setResults={setResults}
        setLoading={setLoading}
      />
      <Text style={styles.text0}>Jobs</Text>
      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : (
        <>
          <FlatList
            data={results.length > 0 ? results : retreat}
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
  card: {
    width: responsiveWidth(88),
    backgroundColor: 'white',
    padding: 20,
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
    width: responsiveWidth(55),

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.55),
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

export default JobScreen;
