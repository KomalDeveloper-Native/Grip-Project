/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../style/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Controller, useForm} from 'react-hook-form';
import {
  FormPostMethod,
  getStorageData,
  postMethod,
  storeData,
} from '../../../../utils/helper';
import {CommonActions, useFocusEffect, useRoute} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {}
const NewSeoDetails: FC<Props> = ({navigation,id}: any): JSX.Element => {

  const [loading, setLoading] = useState(false);
  const [singleFile, setSingleFile] = useState<any>(null); // Updated to accept any type

  console.log(id, 'edit');
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      meta_title: '',
      meta_keywords: '',
      meta_description: '',
    },
  });

  useFocusEffect(
    useCallback(()=>{
      handleSubmit(onSubmit)
    },[])
  )

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    updateProfile(data);
    console.log('komal');
  };

  const updateProfile = async (data: {
    meta_title: string;
    meta_keywords: string;
    meta_description: string;
  }) => {
    try {
      setLoading(true);
      const row = {
        meta_title: data.meta_title,
        meta_keywords: data.meta_keywords,
        meta_description: data.meta_description,
      };
      const response: any = await postMethod(`add-course-seo?${id}`, row);
      console.log(response.data,'rree');
      if (response.data.success === true) {
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: '#7CA942',
        });
        navigation.dispatch(
          CommonActions.navigate({
            name: 'CourseScreen',
          }),
        );
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
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false} // Hide vertical scrollbar
      showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Meta Tittle</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              placeholderTextColor={colors.text_secondary}
              underlineColor={colors.white}
              textColor="black"
              value={value}
              onChangeText={value => onChange(value)}
              style={styles.textInput}
            />
          )}
          name="meta_title"
        />
        {errors.meta_title && errors.meta_title.type === 'required' && (
          <View style={styles.row}>
            <Feather
              name="alert-circle"
              size={9}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.error}>This Field is required.</Text>
          </View>
        )}

        <Text style={styles.title}>Meta Keywords</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              placeholderTextColor={colors.text_secondary}
              underlineColor={colors.white}
              textColor="black"
              value={value}
              onChangeText={value => onChange(value)}
              style={styles.textInput}
            />
          )}
          name="meta_keywords"
        />
        {errors.meta_keywords && errors.meta_keywords.type === 'required' && (
          <View style={styles.row}>
            <Feather
              name="alert-circle"
              size={9}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.error}>This Field is required.</Text>
          </View>
        )}

        <Text style={styles.title}>Meta Description</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              placeholderTextColor={colors.text_secondary}
              underlineColor={colors.white}
              textColor="black"
              value={value}
              onChangeText={value => onChange(value)}
              style={styles.textInput1}
            />
          )}
          name="meta_description"
        />
        {errors.meta_description &&
          errors.meta_description.type === 'required' && (
            <View style={styles.row}>
              <Feather
                name="alert-circle"
                size={9}
                color="red"
                style={styles.icon}
              />
              <Text style={styles.error}>This Field is required.</Text>
            </View>
          )}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignSelf: 'center',

    marginBottom: 20,
  },
  text0: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2.6),
    marginBottom: 15,
  },
  title: {
    width: responsiveWidth(89),
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    alignSelf: 'center',
    fontFamily: 'Roboto-Medium',
    marginBottom: 7,
  },
  textInput: {
    width: responsiveWidth(89),
    height: responsiveHeight(6.7),
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    marginBottom: 20,
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  textInput1: {
    width: responsiveWidth(89),
    paddingBottom: 75,
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

  row: {
    flexDirection: 'row',
    marginLeft: 12,
    marginBottom: 10,
  },
  icon: {
    marginRight: 4,
    marginTop: -3,
  },
  error: {
    width: 330,
    color: 'red',
    fontSize: 10,
    marginTop: -5,
  },
  btn: {
    backgroundColor: colors.black,
    width: responsiveWidth(85),
    height: responsiveHeight(6),
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 20,
    borderRadius: 8,
    elevation: 0.05,
    marginBottom: 0,
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
});

export default NewSeoDetails;
