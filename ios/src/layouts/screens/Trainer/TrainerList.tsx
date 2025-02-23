/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {bg} from 'date-fns/locale';
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppBarSearch from '../../Component/AppBarSearch';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {ActivityIndicator, Card} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import {CommonActions, useFocusEffect, useNavigation} from '@react-navigation/native';
import {getMethod} from '../../../utils/helper';
import TrainerSearch from '../../Component/TrainerSearch';

interface Props {}
const TrainerList: FC<Props> = ({navigation}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(false);
  const [results, setResults] = useState([]);
   navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      CourseList();
    }, []),
  );

  const CourseList = async () => {
    try {
      setLoading(true);
      const response: any = await getMethod('trainer-list');
      if (response.status === 200) {
        setData(response.data.response);
        console.log(response.data, 'drx');
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
      }  else {
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

  const sendId = (item, id) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'TrainerScreen',
        params: {
          Trainer_id: id,
          Trainer: item,
        },
      }),
    );
  };

  const renderItem = ({item}: any) => (
    <Pressable onPress={() => sendId(item, item.id)}>
      <Card style={styles.card} key={item.id}>
        <View style={{flexDirection: 'row', gap: 5}}>
          <Image source={{uri: item['user image']}} style={styles.rowimage} />
          <View>
            <Text style={styles.tittle}>{item.name}</Text>
            <Text style={[styles.text1, {width: responsiveWidth(70)}]}>
              {item['studio name']}
            </Text>
          </View>
        </View>

        <View>
          <View style={styles.row}>
            <Icon
              name="location-pin"
              type="entypo"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>{item.Address}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="location-pin"
              type="entypo"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>{item.course}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="location-pin"
              type="entypo"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>{item.Retreat}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="location-pin"
              type="entypo"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />

            <View
              style={{
                width: responsiveWidth(60),
                flexDirection: 'row',
                gap: 10,
              }}>
              <Text style={styles.text1}>{item.Job}</Text>
              <View>
                <Text style={styles.text3}>
                  {renderStars(item.averageRating)}
                </Text>
                <Text style={styles.text3}>Reviews {item.reviewCount}</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <>
      <TrainerSearch
        color={'white'}
        icon={'arrow-left'}
        setResults={setResults}
        setLoading={setLoading}
        screenNavigate={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Trainer</Text>
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : (
            <FlatList
              data={results.length > 0 ? results : data}
              renderItem={renderItem}
              
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={{paddingBottom: 20}}
              showsVerticalScrollIndicator={false}
            />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    padding: 10,
    paddingBottom: 0,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  text: {
    width: responsiveWidth(90),

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2.2),
    marginBottom: 10,
    alignSelf: 'center',
  },
  row0: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowimage: {
    width: responsiveWidth(15),
    height: responsiveHeight(5),
    borderRadius: 50,
    // padding: 10,
    marginBottom: 20,
  },

  logoImage: {
    width: responsiveWidth(14),
    height: responsiveHeight(7),
    padding: 0,
    marginBottom: 0,
  },
  tittle: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2),
    marginBottom: 10,
  },
  name: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginBottom: 5,
  },
  rowTitle: {
    width: '100%',
    marginLeft: 5,
    marginBottom: 5,
  },
  text0: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    // marginBottom: 5,
  },
  text1: {
    width: '80%',
    display: 'flex',
    flexWrap: 'wrap',
    color: 'black',
    letterSpacing: 0.5,
    fontFamily: 'Roboto-regular',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 0,
    marginLeft: 5,
  },
  card: {
    width: responsiveWidth(88),
    paddingBottom: 5,
    padding: 10,

    marginBottom: 20,
    // borderStartWidth:0.1,
    backgroundColor: 'white',
    marginTop: 10,
    alignSelf: 'center',
  },
  image: {
    width: responsiveWidth(85),
    height: responsiveHeight(25),
    padding: 15,
    alignSelf: 'center',
    resizeMode: 'cover',
    marginBottom: 5,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowSpace: {},
  text3: {
    width: responsiveWidth(95),

    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Regular',
    // marginBottom: 10,
  },
});

export default TrainerList;
