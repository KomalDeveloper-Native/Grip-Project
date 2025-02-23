/* eslint-disable prettier/prettier */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {ActivityIndicator} from 'react-native';
import {Pressable} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {Divider, Icon} from 'react-native-paper';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {getMethod, getStorageData} from '../../../utils/helper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ArrowIcon from '../../Component/ArrowIcon';

interface Props {}
const JobDetailScreen: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const {jobid} = route.params;
  console.log(jobid, 'tr');

  useFocusEffect(
    useCallback(() => {
      TrainerDetails();
    }, [jobid]),
  );

  const TrainerDetails = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    try {
      setLoading(true);
      const response: any = await getMethod(`career-detail?id=61`);
      console.log(response.data.data.job_title, 'res0');
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  if (loading) {
    return <ActivityIndicator size={20} color="black" />;
  }

  let bg = 'white';

  return (
    <>
      <ArrowIcon iconName={'arrow-back'} navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.card} key={data.id}>
          <Text style={styles.text}>{data.job_title} </Text>

          <Text
            style={[
              styles.text,
              {fontFamily: 'Roboto-Medium', width: '100%', marginBottom: 5},
            ]}>
            {data.job_description}
          </Text>

          <Divider />
          <Text
            style={[
              styles.text,
              {fontFamily: 'Roboto-SemiBold', width: '100%', marginBottom: 5},
            ]}>
            Job Type
          </Text>
          <View style={styles.row1}>
            <View style={styles.row}>
              <Icon
                name="clock"
                type="material-community"
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text}>{data.job_type}</Text>
            </View>
          </View>

          <View style={styles.row}>
            {data.pay_range ? (
              <>
                <Icon
                  name="currency-inr"
                  type="material-community"
                  color={'black'}
                  size={20}
                  style={styles.rowSpace}
                />
                <View style={styles.row1}>
                  <Text style={styles.text1}>₹ {data.pay_range}/Month</Text>
                </View>
              </>
            ) : null}
          </View>

          <View style={styles.row}>
            {data.location ? (
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
                    {data.location_type} {data.location}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
          <View style={styles.row}>
            {data.job_type ? (
              <>
                <Icon name="laptop" type="material" size={20} color="#000" />
                <View style={styles.row1}>
                  <Text style={styles.text1}>{data.job_type}</Text>
                </View>
              </>
            ) : null}
          </View>

          <Pressable style={styles.btn}>
            <Text style={styles.btnText}>Apply</Text>
          </Pressable>
        </View>
      </View>
    </>
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
    width: responsiveWidth(85),

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.75),
    marginBottom:5
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

export default JobDetailScreen;
