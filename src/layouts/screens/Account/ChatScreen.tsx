/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Bubble, GiftedChat, Send, InputToolbar} from 'react-native-gifted-chat';
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
import {getStorageData} from '../../../utils/helper';

const ChatScreen = ({navigation, route}) => {
  const { course_id, item } = route.params; // Receiver's ID (other user's ID)
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState(null); // Sender's data (your user data)
  const [docId, setDocId] = useState(''); // Chat document ID

  useEffect(() => {
    Keyboard.dismiss();
    getData();
  }, []);

  // Function to get the current user's data from AsyncStorage
  async function getData() {
    try {
      const storage = await getStorageData();
      setData(storage.response.user);
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  }

  // Generate a unique docId when both the current user data and the receiver's ID are available
  useEffect(() => {
    if (data) {
      const generatedDocId = `${data.id}${item.user_id}`; // Concatenate sorted IDs
      setDocId(generatedDocId);
    }
  }, [data]);

  // Listening to messages
  useEffect(() => {
    if (docId) {
      const unsubscribe = firestore()
        .collection('chats')
        .doc(docId) // Use dynamic docId
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
      console.log(item.user_id,'uu',data.id,docId)

        });

      return () => unsubscribe();
    }
  }, [docId]);

  // Sending messages
  const onSend = useCallback(
    (messages = []) => {
      if (data && docId) {
        const msg = messages[0];
        const myMsg = {
          ...msg,
          senderId: data.id, // Current user (sender)
          receiverId: course_id, // The other user (receiver)
          createdAt: new Date(),
        };

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, myMsg),
        );

        firestore()
          .collection('chats')
          .doc(`${data.id}${item.user_id}`) // Use dynamic docId
          .collection('messages')
          .add({
            ...myMsg,
            createdAt: firestore.FieldValue.serverTimestamp(), // Use Firestore's server timestamp
          });
          firestore()
          .collection('chats')
          .doc(`${item.user_id}${data.id}`) // Use dynamic docId
          .collection('messages')
          .add({
            ...myMsg,
            createdAt: firestore.FieldValue.serverTimestamp(), // Use Firestore's server timestamp
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
    [data, docId],
  );
  
  const customtInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: 'gray',
          borderTopColor: 'white',
          // borderTopWidth: 1,
          color: 'white',
          padding: 3,
        }}
      />
    );
  };

  const customSystemMessage = props => {
    return (
      <View style={styles.ChatMessageSytemMessageContainer}>
        <Icon name="lock" type="font-awesome" color="#9d9d9d" size={16} />
        <Text style={{color: 'black'}}>
          Your chat is secured. Remember to be cautious about what you share
          with others.
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor:'white'}}>
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
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Avatar
          size={40}
          avatarStyle={{backgroundColor: '#D3D3D3'}}
          rounded
          source={{uri: item.profile_image}}
        />
        <View>
          <Text style={[styles.name, {color: 'white'}]}>{item.first_name}</Text>
        </View>
      </View>

      <GiftedChat
        messages={messages}
        messagesContainerStyle={{backgroundColor: 'white'}}
        onSend={messages => onSend(messages)}
        renderInputToolbar={props => customtInputToolbar(props)}
        renderSystemMessage={props => customSystemMessage(props)}
        showUserAvatar={true}
        scrollToBottom={true}
        user={{
          _id: data ? data.id : '',
        }}
        loadEarlier={false}
        renderSend={props => (
          <Send {...props}>
            <View
              style={[
                styles.circle,
                {backgroundColor: 'black', borderColor: 'white'},
              ]}>
              <Icon
                name="send"
                type="font-awesome"
                size={20}
                color={'white'} // Adjust the color based on theme
              />
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputToolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    fontSize: 20,
    backgroundColor: 'black', // Ensure background color is applied
  },
  inputToolbarPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    color: 'white',
    fontSize: 50,
  },
  textInput: {
    flex: 1,
    height: responsiveHeight(5),
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'black', // Input field background color
  },
  name: {
    width: responsiveWidth(55),
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.9),
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
});

export default ChatScreen;
