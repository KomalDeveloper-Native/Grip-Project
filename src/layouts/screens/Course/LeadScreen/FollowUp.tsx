/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Pressable,
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
import {getStorageData, postMethod} from '../../../../utils/helper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';

interface Props {}
const FollowUP: FC<Props> = ({navigation}: any): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [follow, setFollow] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, []),
  );

  const fetchCourses = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    console.log(id);
    setLoading(true);

    const row = {
      userId: id,
    };
    try {
      const response: any = await postMethod(`followup-all`, row);

      if (response.data.success === true) {
        setFollow(response.data.followUp);
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };

  const sentFun = item => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FollowDetail',
        params: {
          follow: item,
          lead_id: item.lead_id,
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flexGrow: 1, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : follow.length > 0 ? (
          follow.map(item => (
            <Pressable style={styles.row} onPress={() => sentFun(item)}>
              <View style={styles.row1}>
                <Avatar
                  size={40}
                  avatarStyle={{backgroundColor: '#D3D3D3'}}
                  rounded
                  source={require('../../../img/one.jpeg')}
                />
                <View>
                  <Text style={styles.name}>{item.Name}</Text>
                  <Text style={styles.course}>{item.course_name} </Text>
                </View>
              </View>

              <View>
                <View style={styles.row1}>
                  <Icon
                    name="chatbox-ellipses"
                    type="ionicon"
                    size={20}
                    color="black"
                    onPress={() => navigation.goBack()}
                  />
                  <Text style={styles.date}>
                    {item.comments.length > 100
                      ? `${item.comments.substring(0, 100)}...`
                      : item.comments}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Icon name="event" type="material" size={20} color="black" />
                  <Text style={styles.newDate}>{item.follow_up_date}</Text>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.modalView}>
            <Text style={styles.modalText}>No Follow up found</Text>
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
    padding: 10,
    alignItems: 'flex-start',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  name: {
    width: responsiveWidth(20),
    minHeight: 20,
    maxHeight: responsiveHeight(40),
    marginBottom: 10,
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    maxWidth: responsiveWidth(35),

    minHeight: 20,
    maxHeight: responsiveHeight(40),
    marginBottom: 10,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.3),
    letterSpacing: 1,
    color: 'black',
  },
  date: {
    maxWidth: responsiveWidth(35),
    minHeight: 20,
    maxHeight: responsiveHeight(40),
    marginBottom: 10,

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  newDate: {
    width: responsiveWidth(20),
    minHeight: 20,
    maxHeight: responsiveHeight(40),
    marginBottom: 10,
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  row1: {
    flexDirection: 'row',
    gap: 10,
  },
  modalView: {
    width: responsiveWidth(80),
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
    width:responsiveWidth(60),
    marginBottom: 15,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: 'black',
  },
});

export default FollowUP;
