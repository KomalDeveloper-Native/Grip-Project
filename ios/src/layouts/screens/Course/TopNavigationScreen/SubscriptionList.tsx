/* eslint-disable semi */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Pressable,
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
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import colors from '../../../style/colors';
import {Icon} from 'react-native-elements';
import {Avatar} from '@rneui/themed';
import {AirbnbRating} from '@rneui/base/dist/AirbnbRating';
import {getMethod, getStorageData, postMethod} from '../../../../utils/helper';

interface Props {
  navigation: any;
}
const SubscriptionList: FC<Props> = ({navigation}: any): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, []),
  );

  const fetchCourses = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    console.log(id);
    const row = {
      userId : id,
    };
    try {
      setLoading(true);

      const response: any = await postMethod(`suscription-all`, row);
      console.log(response.data);

      if (response.data.success === true) {
        setSubs(response.data.followUp);
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flexGrow: 1, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}>
            {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : 
          subs.map(item => (
        <Pressable style={styles.row}>
          <View style={styles.row1}>
            <Avatar
              size={40}
              avatarStyle={{backgroundColor: '#D3D3D3'}}
              rounded
              source={require('../../../img/one.jpeg')}
            />
            <View>
              <Text style={styles.name}>{item.Name}</Text>
              <Text style={styles.course}>{item.course_name}</Text>
            </View>
          </View>

          <View>
            <View style={styles.row1}>
              <Icon name="person" type="material" size={20} color="black" />
              <Text style={styles.date}>{item.type}</Text>
            </View>
            <View style={styles.row1}>
              <Icon name="event" type="material" size={20} color="black" />
              <Text style={styles.newDate}>{item.fee_date}</Text>
            </View>
          </View>
        </Pressable>
          ))}


      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 2,
    // backgroundColor: '#D3D3D3',
    alignSelf: 'center',
  },
  row: {
    backgroundColor: 'white',
    opacity: 88,
    elevation: 2,
    borderRadius: 20,
    width: responsiveWidth(95),
    height: responsiveHeight(10),
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.3),
    letterSpacing: 1,
    marginBottom: 0.5,
    color: 'black',
  },
  date: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  newDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  row1: {
    width: 110,
    flexDirection: 'row',
    gap: 10,
  },
});

export default SubscriptionList;
