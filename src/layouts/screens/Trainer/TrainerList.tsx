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
  RefreshControl,
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
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {getMethod} from '../../../utils/helper';
import TrainerSearch from '../../Component/TrainerSearch';
import colors from '../../style/colors';

interface Props {}
const TrainerList: FC<Props> = ({navigation}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(false);
  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    CourseList(); // re-fetch the data
    setRefreshing(false);

  };
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
      console.log(response.data, 'drx');

      if (response.status === 200) {
        setData(response.data.response);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
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
            <Text style={[styles.text1, {width: responsiveWidth(68),marginLeft:5}]}>
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
              name="graduation-cap"
              type="font-awesome"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>{item.course} Courses</Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="meditation"
              type="material-community"
              color={'black'}
              size={20}
              style={styles.rowSpace}
            />
            <Text style={styles.text1}>{item.Retreat} Retreat </Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="briefcase"
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
              <Text style={styles.text1}>{item.Job} Job Posted</Text>
              <View>
                <Text style={styles.text3}>
                  {renderStars(item.averageRating)}
                </Text>
                <Text style={[styles.text3,{marginLeft:responsiveWidth(1.8)}]}>Reviews ({item.review.reviewCount})</Text>
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
        icon={'arrow-back'}
        setResults={setResults}
        setLoading={setLoading}
        screenNavigate={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Trainer</Text>
        {loading ? (
          <ActivityIndicator size={20} color={colors.black} />
        ) : results.length > 0 ? (
          <FlatList
            data={results.length > 0 ? results : data}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={{paddingBottom: 20}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              No data available👎👎 Check your spelling
            </Text>
          </View>
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
    fontSize: responsiveFontSize(3),
    alignSelf: 'center',
  },
  row0: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowimage: {
    width: responsiveWidth(14),
    height: responsiveHeight(7),
    borderRadius: 100,
    marginBottom: 20,
  },

  logoImage: {
    width: responsiveWidth(14),
    height: responsiveHeight(7),
    
  },
  tittle: {
    width: responsiveWidth(68),

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
    marginLeft:5
  },
  name: {
    width: responsiveWidth(68),

    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),

    marginBottom: 5,
  },
  rowTitle: {
    width: '100%',
    marginLeft: 5,
    marginBottom: 5,
  },

  text1: {
    width: '80%',
    display: 'flex',
    flexWrap: 'wrap',
    color: 'black',
    letterSpacing: 0.5,
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
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

export default TrainerList;
