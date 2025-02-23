/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Icon} from 'react-native-elements';
import {Avatar} from '@rneui/themed';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {getMethod, getStorageData} from '../../../../utils/helper';
import {useSelector} from 'react-redux';

interface Props {}
const RetreatFollow: FC<Props> = ({navigation, route}): JSX.Element => {
  const {retreatid} = route.params;
  const [loading, setLoading] = useState(false);
  const [RetreatFollow, setRetreatFollow] = useState([]);
  const [message, setMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    RetreatFollowLisfun(); // re-fetch the data
    setRefreshing(false);

  };
  useFocusEffect(
    useCallback(() => {
      RetreatFollowLisfun();
    }, []),
  );

  const RetreatFollowLisfun = async () => {
    const storage = await getStorageData();
    const login_id = storage.response.user.id;
    setLoading(true);
    try {
      const response: any = await getMethod(`user-retreat-lead-follow-list?user_id=${login_id}`);
      console.log(response.data, 'darj5');
      if (response.status === 200) {
        setRetreatFollow(response.data.lead_list);
        setMessage(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };

  const ListDetailFun = item => {
    console.log(item)
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ReatreatFollowDetail',
        params: {
          followid: item.lead_id,
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flexGrow: 1, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : RetreatFollow.length>0 ? (
          RetreatFollow.map(item => (
            <Pressable
              style={styles.row}
              key={item.id}
              onPress={() => ListDetailFun(item)}>
              <View style={styles.row1}>
                <Avatar
                  size={40}
                  avatarStyle={{backgroundColor: '#D3D3D3'}}
                  rounded
                  source={require('../../../img/one.jpeg')}
                />
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.course}>{item.retreat_title}</Text>
                </View>
              </View>
              <View>
                <View style={styles.row1}>
                  <Icon
                    type="font-awesome"
                    name="comment"
                    size={20}
                    color="#000"
                  />
                  <Text style={styles.date}>{item.lead_status}</Text>
                </View>
                <View style={styles.row1}>
                  <Icon name="event" type="material" size={20} color="black" />
                  <Text style={styles.newDate}>{item.created_at}</Text>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
            {message}
            </Text>
          </View>
        )}
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
    width: 80,
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
  modalView: {
    width: 200,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: 'black',
  },
});

export default RetreatFollow;
