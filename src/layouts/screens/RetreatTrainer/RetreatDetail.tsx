/* eslint-disable prettier/prettier */
import React from 'react';
import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

interface Props {}
const RetreatDetail: FC<Props> = ({navigation, item}): JSX.Element => {
  return (
    <View style={styles.row}>
      <View style={styles.row_container}>
        <View style={styles.icon}>
          <Icon
            name="check-circle"
            type="material"
            color={item.status === 'Active' ? 'green' : 'red'}
            size={35}
          />
        </View>
        <Text style={styles.Active}>{item.status === 'Active' ? 'Active' : 'InActive'}</Text>
      </View>
      <View style={styles.row_container}>
        <View style={styles.icon}>
          <Icon
            name="campaign" // 'campaign' icon resembles a loudspeaker in Material Icons
            type="material"
            size={35}
            color={item.promation !== true ? 'red' : 'green'}
          />
        </View>

        <Text style={styles.Active}>Promoted</Text>
      </View>
      <View style={styles.row_container}>
        <View style={styles.icon}>
          <Icon name="groups" type="material" size={25} color="#000" />
        </View>

        <Text style={styles.Active}>Leads : {item.Lead}</Text>
      </View>
      <View style={styles.row_container}>
        <View style={styles.icon}>
          <Icon name="person-add" type="material" size={25} color="#000" />
        </View>

        <Text style={styles.Active}>Suscriptions : {item.Suscription}</Text>
      </View>
      <View style={styles.row_container}>
        <View style={styles.icon}>
          <Icon name="eye" type="font-awesome" size={25} color="#000" />
        </View>

        <Text style={styles.Active}>
          Impressions :{item.impresssion}
        </Text>
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

        <Text style={styles.Active}> Clicks : {item.click}</Text>
      </View>
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
    height: responsiveHeight(7),
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
    fontSize: 13,
    fontFamily: 'Roboto-SemiBold',
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

export default RetreatDetail;
