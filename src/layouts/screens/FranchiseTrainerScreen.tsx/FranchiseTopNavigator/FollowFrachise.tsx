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

import {useSelector} from 'react-redux';
import {getMethod, getStorageData} from '../../../../utils/helper';

interface Props {}
const FollowFrachise: FC<Props> = ({navigation, route}): JSX.Element => {
  const {franchise_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    leadLisfun(); // re-fetch the data
    setRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      leadLisfun();
    }, []),
  );

  const leadLisfun = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    setLoading(true);
    try {
      const response: any = await getMethod(
        `franchise-lead-list-followup-user?user_id=${id}`,
      );
      console.log(response.data, 'darl');
      if (response.status === 200) {
        setLead(response.data.leads);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };

  const ListDetailFun = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FranchiseFollowDetail',
        params: {
          followid: item.id,
          followDate: item.Date,
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
        }>
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : (
          lead.map(item => (
            <Pressable
              style={styles.row}
              key={item.id}
              onPress={() => ListDetailFun(item)}>
              <View style={styles.row1}>
                <Avatar size={40} rounded source={{uri: item.image}} />
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.course}>{item.franchise_name}</Text>
                </View>
              </View>
              <View>
                <View style={styles.row1}>
                  <Icon
                    name="chatbox-ellipses"
                    type="ionicon"
                    size={20}
                    color="black"
                  />
                  <Text style={styles.date}>
                    {item.status.substring(0, 10) + '...'}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Icon name="event" type="material" size={20} color="black" />
                  <Text style={styles.newDate}>{item.Date}</Text>
                </View>
              </View>
            </Pressable>
          ))
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

export default FollowFrachise;
