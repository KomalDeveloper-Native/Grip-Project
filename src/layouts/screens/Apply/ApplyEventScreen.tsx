/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, Icon} from 'react-native-elements';
import {getStorageData, postMethod} from '../../../utils/helper';
import {Controller, useForm} from 'react-hook-form';
import {TextInput} from 'react-native-paper';
import {Pressable} from 'react-native';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import ArrowIcon from '../../Component/ArrowIcon';
import Snackbar from 'react-native-snackbar';

interface Props {}
export const ApplyEventScreen: FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [franchise, setFranchise] = useState([]);
  const [userData, setUserData] = useState([]);

  const [isFocus, setIsFocus] = useState(false);
  const {eventid} = route.params;
  useMemo(async () => {
    const storage = await getStorageData();
    console.log(storage.response.user, 'ste', eventid);
    setUserData(storage.response.user);
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      loginuser: '',
      event_id: '',
      message: '',
    },
  });
  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    fetchFrachise(data);
  };

  const fetchFrachise = async data => {
    setLoading(true);
    try {
      const row = {
        loginuser: userData.id,
        event_id: eventid,
        message: data.message,
      };
      const response: any = await postMethod('event-apply', row);
      if (response.status === 200) {
        console.log(response.data, 'res1');

        if (eventid) {
          navigation.navigate('EventScreen');
        } else {
          console.log('courseid or course is undefined');
        }
        Snackbar.show({
          text: response.data.message,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
      } else {
        Snackbar.show({
          text: response.data.message,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ArrowIcon navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>
          Interested in participating in International Day Of Yoga 2024 All
          India Seven
        </Text>

        <Text style={styles.title1}>
          {userData.first_name} {userData.last_name}
        </Text>
        <Text style={styles.title1}>{userData.email}</Text>
        <Text style={styles.title1}>{userData.phone_number}</Text>

        <Controller
          control={control}
          rules={{required: true}}
          render={({field: {onChange, value}}) => (
            <TextInput
              placeholder="Message"
              style={styles.textInput0}
              underlineColor="white"
              outlineColor="white"
              textColor="black"
              value={value}
              onChangeText={onChange}
              placeholderTextColor={'black'}
            />
          )}
          name="message"
        />
        {errors.message && (
          <View style={styles.row}>
            <Feather
              name="alert-circle"
              size={9}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.error}>This field is required.</Text>
          </View>
        )}
        <Pressable style={styles.btn} onPress={handleSubmit(onSubmit)}>
          {loading ? (
            <ActivityIndicator size={20} color="black" />
          ) : (
            <Text style={styles.btnText}>Submit</Text>
          )}
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    // alignItems: 'flex-start',
  },
  title: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Black',
    fontSize: responsiveFontSize(2.5),
    color: colors.black,
    marginTop: 0,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  title1: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2.2),
    color: colors.black,
    marginBottom: 10,
    alignSelf: 'center',
  },
  textInput: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 1,
    marginBottom: 15,
    borderRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: 0,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  textInput0: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    elevation: 2,
    marginBottom: 15,
    borderRadius: 10,
    paddingBottom: 50,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  dropdown: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    marginBottom: 15,
    alignSelf: 'center',
    color: 'black',
  },
  dropdownButtonText: {
    textAlign: 'left',
    color: 'black',
  },
  dropdownRowText: {
    textAlign: 'left',
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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
    width: responsiveWidth(35),
    height: responsiveHeight(6.5),
    backgroundColor: 'white',
    elevation: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  btnText: {
    color: 'black',
    fontSize: 18,
  },
});
