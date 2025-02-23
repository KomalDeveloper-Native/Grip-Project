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
import {getStorageData, getMethod} from '../../../utils/helper';
import {Icon} from 'react-native-elements';

interface Props {}
const FranchiseDetailScreen: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState(false);
  const [results, setResults] = useState(null);
  const {franchiseid} = route.params;
  console.log(franchiseid, 'tr');

  useFocusEffect(
    useCallback(() => {
      TrainerDetails();
    }, [franchiseid]),
  );

  const TrainerDetails = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    try {
      setLoading(true);
      const response: any = await getMethod(
        `franchise-detail?id=${franchiseid}`,
      );
      if (response.status === 200) {
        setData(response.data);
        console.log(response.data, 'response.data');
      }
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
        <ScrollView>
          {data && (
            <>
              <View style={styles.content}>
                <View style={styles.row}>
                  <Icon
                    name="home-group"
                    type="material-community"
                    color={'black'}
                    size={25}
                    style={styles.rowSpace}
                  />
                  <Text style={styles.title}>Franchise</Text>
                </View>
              </View>
              <Text style={styles.text4}>{data.services_offerings}</Text>
              <View style={styles.row}>
                {data.year_of_establishment ? (
                  <>
                    <Icon
                      name="calendar"
                      type="material-community"
                      color={'black'}
                      size={15}
                      style={styles.rowSpace}
                    />
                    <View style={styles.row1}>
                      <Text style={styles.text1}>
                        {data.year_of_establishment}
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>
              <View style={styles.row}>
                {data.space_required ? (
                  <>
                    <Icon
                      name="home-map-marker"
                      type="material-community"
                      color={'black'}
                      size={15}
                      style={styles.rowSpace}
                    />
                    <View style={styles.row1}>
                      <Text style={styles.text1}>
                        {data.space_required} Sq.Ft
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>
              <View style={styles.row}>
                {data.investment_required ? (
                  <>
                    <Icon
                      name="currency-inr"
                      type="material-community"
                      color={'black'}
                      size={15}
                      style={styles.rowSpace}
                    />
                    <View style={styles.row1}>
                      <Text style={styles.text1}>{data.investment_required}/Month</Text>
                    </View>
                  </>
                ) : null}
              </View>
              <View>
                <View style={styles.row}>
                  <Icon
                    name="certificate-outline"
                    type="material-community"
                    color="black"
                    size={15}
                  />
                  <Text
                    style={[
                      styles.title,
                      {marginLeft: 0, marginBottom: 10, marginTop: 5},
                    ]}>
                    Business Details
                  </Text>
                </View>

                <Text style={[styles.text1, {marginLeft: 0, marginBottom: 20}]}>
                  {data.business_details}
                </Text>
              </View>
              <View>
                <View style={styles.row}>
                  <Icon
                    name="star-outline"
                    type="material-community"
                    color="black"
                    size={15}
                  />
                  <Text
                    style={[
                      styles.title,
                      {marginLeft: 0, marginBottom: 10, marginTop: 5},
                    ]}>
                    Benefits
                  </Text>
                </View>

                <Text style={[styles.text1, {marginLeft: 0, marginBottom: 20}]}>
                  {data.business_details}
                </Text>
              </View>
            </>
          )}
          <Pressable
            style={styles.tabBottom}
         >
            <Text
              style={{
                color: 'white',
                fontFamily: 'Roboto-Medium',
                fontSize: responsiveFontSize(2),
              }}>
              Know More
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
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(1.9),
  },
  name: {
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: responsiveFontSize(2.1),
  },
  row: {
    flexDirection: 'row',
    gap: 5,
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
    fontSize: responsiveFontSize(1.5),
  },
  text4: {
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: responsiveFontSize(1.7),
    marginBottom:5
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
    width: responsiveWidth(92),

    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-light',
    fontSize: responsiveFontSize(1.45),
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

export default FranchiseDetailScreen;

{
  /* <Icon
name="home-group"
type="material-community"
color={'black'}
size={25}
style={styles.rowSpace}
/> */
}
