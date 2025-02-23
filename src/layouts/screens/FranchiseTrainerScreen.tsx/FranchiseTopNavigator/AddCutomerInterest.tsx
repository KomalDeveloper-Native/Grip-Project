/* eslint-disable quotes */
/* eslint-disable jsx-quotes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
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
const AddCutomerInterest: FC<Props> = ({navigation, route}): JSX.Element => {
  const {franchise_id, franchiseData} = route.params;
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState([]);
  const trainerId = useSelector(state => state.List.id);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      id: '',
      area_available: '',
      investment_amount: '',
    },
  });

  const onSubmit = async data => {
    Keyboard.dismiss();
    updatestatusFun(data);
  };

  useEffect(() => {
    console.log(franchiseData, 'kk');
    setValue('area_available', franchiseData.area_available);
    setValue('investment_amount', franchiseData.investment_amount);
  }, []);

  const updatestatusFun = async data => {
    setLoading(true);
    try {
      const row = {
        id:franchiseData.lead_id,
        area_available: data.area_available,
        investment_amount: data.investment_amount,
      };
      console.log(row, franchise_id);
      const response = await postMethod(
        `franchise-lead-add-interest`,
        row,
      );
      console.log(response.data, 'fd');
      if (response.status === 200) {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'FranchiseTopNavigation',
            params: {
              franchise_id: trainerId,
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
      Snackbar.show({
        text: response.data.message,
        duration: 2000,
        textColor: colors.white,
        backgroundColor: 'red',
      });
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
      <Text style={styles.title}>Add Customer Interest</Text>

      <Controller
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <>
            <TextInput
              placeholder="Total Area"
              style={styles.textInput0}
              underlineColor="white"
              outlineColor="white"
              textColor="black"
              value={value}
              onChangeText={onChange}
              placeholderTextColor={'black'}
            />
          </>
        )}
        name="area_available"
      />
      {errors.area_available && errors.area_available.type === 'required' && (
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
              placeholder="Investment Amount"
              style={styles.textInput0}
              underlineColor="white"
              outlineColor="white"
              textColor="black"
              value={value}
              onChangeText={onChange}
              placeholderTextColor={'black'}
            />
          </>
        )}
        name="investment_amount"
      />
      {errors.investment_amount &&
        errors.investment_amount.type === 'required' && (
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

export default AddCutomerInterest;
