/* eslint-disable jsx-quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {FC} from 'react';
import {Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon, colors} from 'react-native-elements';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {postMethod} from '../../../../utils/helper';
import {CommonActions} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSelector} from 'react-redux';
import Snackbar from 'react-native-snackbar';

interface Props {}
const FollowUpScreen: FC<Props> = ({navigation, route}): JSX.Element => {
  const {lead_id} = route.params;
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const trainerId = useSelector(state => state.List.id);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      lead_id: '',
      comments: '',
      follow_up_date: '',
    },
  });

  const handleConfirm = date => {
    setDatePickerVisible(false);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setValue('follow_up_date', formattedDate); // Use the formatted date for the form value
  };

  const onSubmit = async data => {
    Keyboard.dismiss();
    updatestatusFun(data);
  };

  const updatestatusFun = async data => {
    setLoading(true);

    try {
      const row = {
        lead_id: lead_id,
        comments: data.comments,
        follow_up_date: data.follow_up_date,
      };
      console.log(row);
      const response = await postMethod('lead-followup', row);
      if (response.data.success === true) {
        setUpdate(response.data.data);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'TopNavigation',
            params: {
              courseid: null,
              screen: 'FollowUpScreen',
            },
          }),
        );
      }
      Snackbar.show({
        text: response.data.message,
        duration: 2000,
        textColor: colors.white,
        backgroundColor: 'green',
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Icon
        name="arrow-back"
        size={25}
        type="material"
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>Follow Up</Text>

      <Controller
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <>
            <TextInput
              placeholder="Enter your comment here"
              style={styles.textInput}
              underlineColor="white"
              outlineColor="white"
              textColor="black"
              value={value}
              onChangeText={onChange}
              placeholderTextColor={'black'}
            />
          </>
        )}
        name="comments"
      />
      {errors.comments && errors.comments.type === 'required' && (
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
      <Controller
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <>
            <TextInput
              placeholder="Select Date"
              style={styles.textInput0}
              textColor="black"
              underlineColor="white"
              outlineColor="white"
              value={selectedDate}
              editable={false}
              onChangeText={date => {
                onChange(date);
                setSelectedDate(date); // Update selectedDate when text input changes
              }}
              placeholderTextColor={'black'}
              right={
                <TextInput.Icon
                  icon="calendar"
                  size={20}
                  onPress={() => setDatePickerVisible(true)}
                />
              }
            />
          </>
        )}
        name="follow_up_date"
      />
      {errors.follow_up_date && errors.follow_up_date.type === 'required' && (
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
      <Pressable style={styles.btn} onPress={handleSubmit(onSubmit)}>
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : (
          <Text style={styles.btnText}>Submit</Text>
        )}
      </Pressable>

      <DateTimePickerModal
        minimumDate={new Date()}
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'flex-start',
  },
  title: {
    width: responsiveWidth(90),
    fontFamily: 'Roboto-Black',
    fontSize: responsiveFontSize(2.5),
    color: colors.black,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  textInput: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    color: 'black',
    elevation: 2,
    marginBottom: 15,
    borderRadius: 10,
    paddingBottom: 100,
    alignSelf: 'center',
  },
  textInput0: {
    width: responsiveWidth(90),
    backgroundColor: 'white',
    color: 'black',
    elevation: 2,
    marginBottom: 15,
    borderRadius: 10,
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

export default FollowUpScreen;
