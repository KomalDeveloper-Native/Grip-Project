/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Appbar from '../../Component/Appbar';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Avatar} from '@rneui/themed';
import {SearchBar} from 'react-native-elements';
import {Alert} from 'react-native';
import {getStorageData, postMethod} from '../../../utils/helper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import ChatAppbar from '../../Component/ChatAppbar';

const ChatList: FC<Props> = ({navigation}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, []),
  );

  const fetchCourses = async () => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    console.log(id, 'id');
    setLoading(true);
    try {
      const row = {
        userId: id,
      };
      const response: any = await postMethod('chat-user-list', row);
      console.log(response.data, 'hh');
      // setCurrentList(response.data.current_user);
      //  console.log(response.data.current_user,'data')
      setChatList(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onSend = (id: number, item: Object) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ChatScreen',
        params: {
          course_id: id,
          item: item,
        },
      }),
    );
  };

  return (
    <>
      <ChatAppbar navigation={navigation} />
      <View style={styles.container}>
        <SearchBar
          fontColor="white"
          iconColor="white"
          shadowColor="#282828"
          cancelIconColor="white"
          backgroundColor="white"
          placeholder="Search here"
          onChangeText={text => console.log(text)}
          onSearchPress={() => console.log('Search Icon is pressed')}
          onClearPress={() => this.filterList('')}
          onPress={() => alert('onPress')}
          inputContainerStyle={{
            backgroundColor: 'white',
            height: 30,
          }}
          containerStyle={{
            backgroundColor: 'white',
            borderRadius: 50,
            borderWidth: 1,
            borderColor: 'white',
            marginBottom: 20,
          }}
        />
        <ScrollView scrollEnabled={true}>
          {/* <Pressable style={styles.row} onPress={() => onSend(currentList.id)}>
            <View style={styles.row1}>
              <Avatar
                size={40}
                avatarStyle={{backgroundColor: '#D3D3D3'}}
                rounded
                source={{uri: currentList.profile_image}}
              />
              <View style={styles.row2}>
                <View>
                  <Text style={styles.name}>{currentList.first_name}</Text>
                  <Text style={styles.course}>{currentList.last_message}</Text>
                </View>
                <View></View>
              </View>
            </View>
            <View></View>
          </Pressable> */}
          {chatList ? (
            chatList.map((item, index) => (
              <Pressable
                style={styles.row}
                key={index}
                onPress={() => onSend(item.id, item)}>
                <View style={styles.row1}>
                  <Avatar
                    size={40}
                    avatarStyle={{backgroundColor: '#D3D3D3'}}
                    rounded
                    source={{uri: item.profile_image}}
                  />
                  <View style={styles.row2}>
                    <View>
                      <Text style={styles.name}>{item.first_name}</Text>
                      <Text style={styles.course}>{item.last_message}</Text>
                    </View>
                    <View>
                      <Text style={styles.course}>{item.relative_time}</Text>
                    </View>
                  </View>
                </View>
                <View>{/* You can add any other components here */}</View>
              </Pressable>
            ))
          ) : (
          
              <View style={styles.modalView}>
                <Text style={styles.modalText}>No chats available 👎👎
                  Please opt now
                </Text>
              
              </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 2,
    alignSelf: 'center',
    marginBottom: 50,
  },
  row: {
    backgroundColor: 'white',
    opacity: 88,
    elevation: 2,
    borderRadius: 5,
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
    width: responsiveWidth(55),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'black',
  },
  course: {
    width: responsiveWidth(55),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.3),
    letterSpacing: 1,
    marginBottom: 0.5,
    color: 'black',
  },
  row1: {
    flexDirection: 'row',
    gap: 10,
  },
  row2: {
    width: responsiveWidth(70),
    flexDirection: 'row',
    // alignItems:'center',
    justifyContent: 'space-between',
  },
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
    color:'black'
  },
});

export default ChatList;
