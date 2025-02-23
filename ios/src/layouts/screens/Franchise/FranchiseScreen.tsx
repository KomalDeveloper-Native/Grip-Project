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
import {getStorageData, postMethod} from '../../../utils/helper';
import colors from '../../style/colors';
import {Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBarSearch from '../../Component/AppBarSearch';
import FranchiseSearch from '../../Component/FranchiseSearch';

interface Props {}

const FranchiseScreen: FC<Props> = ({navigation}) => {
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
      const response: any = await postMethod('franchise-list');
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
        name: 'FranchiseDetailScreen',
        params: {
          franchiseid: id,
        },
      }),
    );
  };

  const renderItem = ({item}: any) => (
    <Card style={styles.card} key={item.id}>
   
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <View style={styles.row}>
          <Text style={styles.text}>{item.services_offerings}</Text>
        </View>
      </View>

      <View style={styles.row}>
        {item.year_of_establishment ? (
          <>
            <Icon
              name="calendar"
              type="material-community"
              color={'black'}
              size={15}
              
              style={styles.rowSpace}
            />
            <View style={styles.row1}>
              <Text style={styles.text1}> {item.year_of_establishment}</Text>
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
              size={15}
              
            />
            <View style={styles.row1}>
              <Text style={styles.text1}> {item.space_required} Sq.Ft</Text>
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
              size={15}
              color="#000"
            />
            <View style={styles.row1}>
              <Text style={styles.text1}>₹{item.investment_required}</Text>
            </View>
          </>
        ) : null}
        <Pressable style={styles.btn} onPress={() => sendId(item.id)}>
          <Text style={styles.btnText}>Show Interest</Text>
        </Pressable>
      </View>
    </Card>
  );

  let bg = 'white';

  return (
    <View style={styles.container}>
      <FranchiseSearch
        color={'white'}
        icon={'arrow-left'}
        setResults={setResults}
        setLoading={setLoading}
      />

      <View>
        <Text style={styles.text0}>Franchise</Text>
      </View>

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
    // marginBottom: 5,
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
    width: responsiveWidth(48),

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
    width: 15,
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
    width: responsiveWidth(28),
    height: responsiveHeight(4),
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
    marginLeft: 5,
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

export default FranchiseScreen;
