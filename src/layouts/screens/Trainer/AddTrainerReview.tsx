/* eslint-disable no-sequences */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import colors from '../../style/colors';
import {getStorageData, FormPostMethod} from '../../../utils/helper';
import Snackbar from 'react-native-snackbar';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
import Toast from 'react-native-toast-message';

interface Props {}
const AddTrainerReview: FC<Props> = ({navigation, route}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [allReview, setAllReview] = useState([]);
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const {Trainer, Trainer_id} = route.params;

  const handleReviewSubmit = async () => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('user_id', login_user);
      formData.append('trainer_id', Trainer_id);
      formData.append('rating', rating.toString());
      formData.append('review', reviewText);
      formData.append('title', title);
      console.log(formData, 'forme');
      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: image.type,
          name: image.name,
        });
      }
      console.log(formData, 'row1');

      const response: any = await FormPostMethod(
        'add-trainer-review',
        formData,
      );
      console.log(response.data);
      if (response.data.success === true) {
        console.log('Review submitted successfully', response);
        navigation.navigate('TrainerScreen', {
          Trainer_id: Trainer_id,
          Trainer: Trainer,
        });
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
      } else {
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error', error.message);
    }
  };

  const selectOneFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setImage(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled from single doc picker');
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const renderStars = ratingValue => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable key={i} onPress={() => setRating(i)}>
          <Icon
            name={i <= ratingValue ? 'star' : 'star-outline'}
            type="material"
            color={i <= ratingValue ? 'orange' : '#D3D3D3'}
            size={25}
          />
        </Pressable>,
      );
    }
    return stars;
  };

  console.log(Trainer, 'trainer');

  return (
    <>
      <View style={[styles.row,]}>
        <View style={{marginLeft:5 }}>
        <Icon
          name="arrow-back"
          size={20}
          color={'black'}
          
          onPress={() => navigation.goBack()}
        />
        </View>
     
        <Text style={styles.text}>Write a review</Text>
      </View>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView enabled>
        
        <View style={styles.containerRow}>
          <Image source={{uri: Trainer['user image']}} style={styles.image} />
          <View>
            <Text style={styles.text1}>{Trainer.name}</Text>
          </View>
        </View>
        <View
          style={[
            styles.row,
            {justifyContent: 'space-between', alignItems: 'center'},
          ]}>
          <Text style={styles.text3}>Add photo and video</Text>
          <Pressable style={styles.btn} onPress={selectOneFile}>
            <Icon name="upload" size={20} color="#000" />
          </Pressable>
        </View>
        {image && (
          <View style={styles.imagePreview}>
            <Image
              source={{uri: image.uri}}
              style={styles.image1}
              
              resizeMode="contain"
            />
          </View>
        )}
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: -10,
            },
          ]}>
          <Text style={styles.text3}>Rating</Text>
          <View style={{flexDirection: 'row'}}>{renderStars(rating)}</View>
        </View>

        <Text style={styles.text3}>Title</Text>

        <TextInput
          style={styles.textInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          underlineColor={colors.white}
          textColor="black"
        />
        <Text style={styles.text3}>Write a review</Text>

        <TextInput
          style={[
            styles.textInput,
            {
              textAlignVertical: 'center',
              paddingBottom: 20,
            },
          ]}
          value={reviewText}
          multiline
          onChangeText={setReviewText}
          placeholder="Write your review here"
          underlineColor={colors.white}
          textColor="black"
        />
        <Text style={styles.text4}>
          {400 - reviewText.length} characters remaining
        </Text>
        <Pressable style={styles.tabBottom} onPress={handleReviewSubmit}>
          {loading ? (
            <ActivityIndicator size={20} color="white" />
          ) : (
            <Text style={[styles.text,{color:'white'}]}>Submit Review</Text>
          )}
        </Pressable>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 0,
  },
  row: {
    padding: 20,
    paddingHorizontal: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'white',
  },
  text: {
    color: 'white',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2.1),
  },
  containerRow: {
    width: responsiveWidth(95),

    flexDirection: 'row',
    // gap: 50,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  image: {
    width: responsiveWidth(40),
    height: responsiveHeight(10),
    resizeMode: 'contain',
    marginLeft: -20,
    borderRadius: 10,
  },
  image1: {
    width: responsiveWidth(100),
    height: responsiveHeight(40),
  },
  text1: {
    width: responsiveWidth(50),

    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.8),
  },
  text2: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.8),
  },
  text3: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2),
    marginBottom: 10,
  },
  text4: {
    color: 'gray',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.8),
    textAlign: 'right',
    marginBottom: 60,
  },
  btn: {
    width: responsiveWidth(10),
    height: responsiveHeight(5),
    backgroundColor: 'white',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  textInput: {
    width: responsiveWidth(88),
    paddingBottom: 5,
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    marginBottom: 10,
    color: colors.black,
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0,
    alignSelf: 'center',
  },
  imagePreview: {
    alignItems: 'center',
    marginVertical: 10,
  },
  tabBottom: {
    width: '90%',
    height: responsiveHeight(7),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 1,
    borderColor: 'white',
    borderWidth: 2.5,
    // position: 'static',
    marginBottom: 30,
    alignSelf: 'center',
  },
});

export default AddTrainerReview;
