/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
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
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';

interface Props {}
export const RetreatApplyScreen: FC<Props> = ({
  navigation,
  route,
}): JSX.Element => {
  navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [franchise, setFranchise] = useState([]);
  const [userData, setUserData] = useState([]);

  const [isFocus, setIsFocus] = useState(false);
  const {retreatid} = route.params;
  useMemo(async () => {
    const storage = await getStorageData();
    console.log(storage.response.user, 'ste', retreatid);
    setUserData(storage.response.user);
  }, []);

  const roomTypeData = [
    {label: 'Double Room(Private)', value: 'Double Room(Private)'},
    {label: 'Double Room(Sharing)', value: 'Double Room(Sharing)'},
    {label: 'Triple Room(Private)', value: 'Triple Room(Private)'},
    {label: 'Triple Room(Sharing)', value: 'Triple Room(Sharing)'},
  ];

  const groupSizeData = [
    {label: '1-5', value: '1-5'},
    {label: '6-10', value: '6-10'},
    {label: '11-20', value: '11-20'},
    {label: '21-30', value: '21-30'},
  ];

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      loginuser: '',
      retreat_id: '',
      message: '',
      room_preference: '',
      group_size: '',
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
        retreat_id: retreatid,
        message: data.message,
        room_preference: data.room_preference.join(''),
        group_size: data.group_size,
      };
      const response: any = await postMethod('retreat-apply', row);
      if (response.status === 200) {
        console.log(response.data, 'res0');
        Snackbar.show({
          text: response.data.message,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'RetreatScreen'}],
          }),
        );

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
  const [selected, setSelected] = useState([]);

  return (
    <>
      <ArrowIcon navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>
          Apply for retreat 4 Day Transformational Yoga Retreat in Rishikesh
        </Text>

        <Text style={styles.title1}>
          {userData.first_name} {userData.last_name}
        </Text>
        <Text style={styles.title1}>{userData.email}</Text>
        <Text style={styles.title1}>{userData.phone_number}</Text>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View>
            <KeyboardAvoidingView enabled>
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <>
                    <Text style={styles.title}>Add Booking</Text>
                
                    <MultiSelect
                      style={[styles.dropdown]}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.textInput}
                      selectedStyle={{
                        marginLeft: 10,
                        marginBottom: 15,
                        borderRadius: 15,
                      }}
                      iconStyle={styles.iconStyle}
                      data={roomTypeData}
                      search={false}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      itemTextStyle={{
                        color: 'black',
                      }}
                      placeholder={!isFocus ? 'Room Type' : 'Room Type'}
                      value={selected} // Bind value to react-hook-form's field value
                      onChange={item => {
                        setSelected(item);
                        onChange(item); // Update react-hook-form state
                      }}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                    />
                  </>
                )}
                name="room_preference"
              />
              {errors.room_preference && (
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
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <Dropdown
                    style={[styles.dropdown, isFocus]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={groupSizeData}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Group Size' : 'Group Size'}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      onChange(item.value);
                      setIsFocus(false);
                    }}
                  />
                )}
                name="group_size"
              />
              {errors.group_size && (
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
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    placeholder="Message"
                    style={styles.textInput0}
                    // multiline
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
            </KeyboardAvoidingView>
          </View>
          <Pressable style={styles.btn} onPress={handleSubmit(onSubmit)}>
            {loading ? (
              <ActivityIndicator size={20} color="black" />
            ) : (
              <Text style={styles.btnText}>Submit</Text>
            )}
          </Pressable>
        </ScrollView>
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
    marginBottom: 5,
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
