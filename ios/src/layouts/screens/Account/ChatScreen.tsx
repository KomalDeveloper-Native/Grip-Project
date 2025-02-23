/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Keyboard, StyleSheet, Text, View} from 'react-native';
import {
  Bubble,
  GiftedChat,
  Send,
  InputToolbar,
  Actions,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import {Avatar} from '@rneui/themed';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import colors from '../../style/colors';
import {getStorageData} from '../../../utils/helper';

const ChatScreen = ({navigation, route}) => {
  const {course_id, item} = route.params;
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    Keyboard.dismiss();
    getData();
  }, []);

  useEffect(() => {
    if (data) {
      const docId =
        course_id > data.id
          ? `${data.id}-${course_id}`
          : `${course_id}-${data.id}`;
      console.log('Document ID:', docId);

      const unsubscribe = firestore()
        .collection('chats')
        .doc(docId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const allMessages = snapshot.docs.map(doc => {
            const firebaseData = doc.data();
            const data = {
              _id: doc.id,
              text: firebaseData.text,
              createdAt: firebaseData.createdAt
                ? new Date(firebaseData.createdAt.toMillis())
                : new Date(),
              user: {
                _id: firebaseData.senderId,
                name: firebaseData.senderName,
              },
            };
            return data;
          });
          setMessages(allMessages);
        });

      return () => unsubscribe();
    }
  }, [data, course_id]);

  async function getData() {
    try {
      const storage = await getStorageData();
      console.log('User data:', storage.response.user);
      setData(storage.response.user);
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  }

  const onSend = useCallback(
    (messages = []) => {
      if (data) {
        const msg = messages[0];
        const myMsg = {
          ...msg,
          senderId: data.id,
          receiverId: course_id,
          createdAt: new Date(),
        };
        console.log('Message to send:', myMsg);

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, myMsg),
        );

        const docId =
          course_id > data.id
            ? `${data.id}-${course_id}`
            : `${course_id}-${data.id}`;
        firestore()
          .collection('chats')
          .doc(docId)
          .collection('messages')
          .add({
            ...myMsg,
            createdAt: firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            console.log('Message sent successfully');
          })
          .catch(error => {
            Alert.alert('Failed to send message', error);
            console.error('Failed to send message:', error);
          });
      }
    },
    [data, course_id],
  );

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
          backgroundColor: 'black',
          width: '100%',
          padding: 10,
        }}>
        <Icon
          name="arrow-back"
          size={20}
          color={'white'}
          onPress={() => navigation.goBack()}
        />
        <Avatar
          size={40}
          avatarStyle={{backgroundColor: '#D3D3D3'}}
          rounded
          source={{uri: item.profile_image}}
        />
        <View>
          <Text style={styles.name}>{item.first_name}</Text>
        </View>
      </View>

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        showUserAvatar={true}
        scrollToBottom={true}
        textInputProps={{
          colors: 'white',
        }}
        user={{
          _id: data ? data.id : '',
        }}
        loadEarlier={false}
        renderSend={props => (
          <Send {...props}>
            <View style={styles.circle}>
              <Icon name="send" type="font-awesome" size={20} color={'black'} />
            </View>
          </Send>
        )}
        renderBubble={props => (
          <Bubble
            {...props}
            textStyle={{
              right: {
                color: 'white',
              },
              left: {
                color: 'black',
              },
            }}
            wrapperStyle={{
              right: {
                marginRight: -30,
                backgroundColor: 'black',
                marginBottom: 10,
              },
              left: {
                marginLeft: -30,
                marginBottom: 10,
              },
            }}
          />
        )}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={styles.inputToolbarContainer}
            primaryStyle={styles.inputToolbarPrimary}>
            <Actions
              {...props}
              icon={() => (
                <Icon
                  name="emoji-emotions"
                  type="material"
                  size={25}
                  color="white"
                />
              )}
              containerStyle={styles.actionIcon}
              options={{
                'Choose From Library': () => {},
                Cancel: () => {},
              }}
              optionTintColor="#222B45"
            />
            <Actions
              {...props}
              icon={() => (
                <Icon name="link" type="material" size={25} color="white" />
              )}
              containerStyle={styles.actionIcon}
              options={{
                'Attach Link': () => {},
                Cancel: () => {},
              }}
              optionTintColor="#222B45"
            />
            <Actions
              {...props}
              icon={() => (
                <Icon name="camera" type="material" size={25} color="black" />
              )}
              containerStyle={styles.actionIcon}
              options={{
                'Take Photo': () => {},
                Cancel: () => {},
              }}
              optionTintColor="#222B45"
            />
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="gray"
              underlineColor="transparent"
              style={styles.textInput}
              textColor={'white'}
              value={props.text}
              onChangeText={props.onTextChanged}
            />
            <Icon
              name="send"
              type="material"
              size={25}
              color={'black'}
              containerStyle={styles.sendIcon}
            />
          </InputToolbar>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputToolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'black',
    color: 'white',
    fontSize: 20,
  },
  inputToolbarPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    color: 'white',
    fontSize: 20,
  },
  actionIcon: {
    marginHorizontal: 5,
  },
  textInput: {
    flex: 1,
    height: responsiveHeight(5),
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 20,
    color: 'white',
  },
  name: {
    width: responsiveWidth(55),

    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
    color: 'white',
  },
  course: {
    width: responsiveWidth(55),

    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.3),
    letterSpacing: 1,
    marginBottom: 0.5,
    color: 'white',
  },
  sendIcon: {
    width: responsiveWidth(0),
    marginHorizontal: 5,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default ChatScreen;
