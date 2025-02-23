/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {FC} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  Button,
  Modal,
  PaperProvider,
  Portal,
  TextInput,
} from 'react-native-paper';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import colors from '../../../style/colors';
import {Dropdown} from 'react-native-element-dropdown';
import {useFocusContext} from 'react-day-picker';
import {useFocusEffect} from '@react-navigation/native';
import {getStorageData, postMethod} from '../../../../utils/helper';

interface Props {}
const TrainingDetail: FC<Props> = ({
  navigation,
  item,
  Coursedata,
}: any): JSX.Element => {
  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [loading, setLoading] = useState(false);
  const [data1, setData1] = useState([]);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  const data = [
    {label: 'Basic', value: '1'},
    {label: 'Practice', value: '2'},
    {label: 'Intense', value: '3'},
  ];

  return (
    <View style={styles.container}>
      <View style={{width: responsiveWidth(95), alignSelf: 'center'}}>
        <View style={styles.textInput}>
          <Text style={[styles.text, {fontFamily: 'Roboto-Bold'}]}>
            Trainer Level -
            <Text style={styles.text}>{item.training_level}</Text>
          </Text>
          {/* <Icon
          name="arrow-downward"
          type="MaterialIcons"
          color={'black'}
          size={20}
        /> */}
        </View>
        <View style={styles.textInput}>
          <Text style={[styles.text, {fontFamily: 'Roboto-Bold'}]}>
            Class Type - <Text style={styles.text}>{item.class_type}</Text>
          </Text>
        </View>
        <View style={styles.textInput}>
          <Text style={[styles.text, {fontFamily: 'Roboto-Bold'}]}>
            Body Focus - <Text style={styles.text}>{item.body_focus}</Text>
          </Text>
        </View>
        <View style={styles.textInput}>
          <Text style={[styles.text, {fontFamily: 'Roboto-Bold'}]}>
            Yoga Style - <Text style={styles.text}>{item.yoga_style}</Text>
          </Text>
        </View>
      </View>

      {Coursedata === true ? (
        <View style={styles.row}>
          <View style={styles.row_container}>
            <View style={styles.icon}>
              <Icon
                name="check-circle"
                type="material"
                color={item.status === 2 ? 'red' : 'green'}
                size={35}
              />
            </View>
            <Text style={styles.Active}>{item.status === 2 ? 'Inactive' : 'Active'}</Text>
          </View>
          <View style={styles.row_container}>
            <View style={styles.icon}>
              <Icon
                name="campaign" // 'campaign' icon resembles a loudspeaker in Material Icons
                type="material"
                size={35}
                color={item.promote === 'Inactive' ? 'red' : 'green'}
              />
            </View>

            <Text style={styles.Active}>{item.promote === 'Inactive' ? 'Promote' : 'Demote'}</Text>
          </View>
          <View style={styles.row_container}>
            <View style={styles.icon}>
              <Icon name="groups" type="material" size={25} color="#000" />
            </View>

            <Text style={styles.Active}>Leads : {item.lead}</Text>
          </View>
          <View style={styles.row_container}>
            <View style={styles.icon}>
              <Icon name="person-add" type="material" size={25} color="#000" />
            </View>

            <Text style={styles.Active}>Suscriptions : {item.suscription}</Text>
          </View>
          <View style={styles.row_container}>
            <View style={styles.icon}>
              <Icon name="eye" type="font-awesome" size={25} color="#000" />
            </View>

            <Text style={styles.Active}>Impressions : {item.impression}</Text>
          </View>
          <View style={styles.row_container}>
            <View style={styles.icon}>
              <Icon
                name="mouse-pointer"
                type="font-awesome"
                size={25}
                color="#000"
              />
            </View>

            <Text style={styles.Active}> Clicks : {item.clicks}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    // alignItems: 'flex-start',
    // marginBottom:20,
  },
  title: {
    fontFamily: 'Roboto-Black',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.5),
    color: 'black',
    marginBottom: 20,
  },
  textInput: {
    width: responsiveWidth(88),
    minHeight: responsiveHeight(7),
    backgroundColor: 'white',
    opacity: 658,
    elevation: 3,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
    // borderStartWidth:0.1,
    borderTopRightRadius: 10,
    alignSelf: 'center',
    borderTopLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    marginBottom: 5,
    color: 'black',
    fontFamily: 'Roboto-Regular',
    fontSize: responsiveFontSize(1.8),

  },
  row: {
    // height: responsiveHeight(80),
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  row_container: {
    width: responsiveWidth(40),
    height: responsiveHeight(16),
    // padding:20,
    opacity: 958,
    elevation: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 20,
    borderLeftWidth: 0.1,
    // borderStartWidth:0.1,
    borderRightWidth: 0.1,
  },
  icon: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    opacity: 555,
    elevation: 2,
    borderRadius: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  Active: {
    color: 'black',
    fontFamily: 'Roboto-Black',
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

export default TrainingDetail;
