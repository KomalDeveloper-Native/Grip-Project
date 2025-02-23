/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {useMemo, useState} from 'react';
import {FC} from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon, Image} from 'react-native-elements';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {BarChart} from 'react-native-chart-kit';
import {opacity} from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import Appbar from '../../Component/Appbar';
import {getStorageData} from '../../../utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
const screenWidth = Dimensions.get('window').width;

interface Props {}
const AccountScreen: FC<Props> = ({navigation}: any): JSX.Element => {
  const kyc = useSelector(state => state.List.kyc);
  const [store, setStore] = useState(null);
  const [store1, setStore1] = useState(null);
  const memoFun = useMemo(async () => {
    const storage = await getStorageData();
    console.log(storage, 'memo');
    if (storage.response.kyc === 1) {
      setStore(storage.response.kyc);
    }
    const getKyc = await AsyncStorage.getItem('kyc');
    setStore1(getKyc);

    console.log(storage.response.kyc, store1, 'kkd');
  }, []);
  const data = {
    // labels: ['', '', '', ''],
    datasets: [
      {
        data: [40, 30, 20, 50],
        colors: [
          (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
          (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
          (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
          (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    // decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label and axis color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label text color
    style: {
      elevation: 5,
      opacity: 20,
      borderRadius: 55,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // Remove the dash from background lines
      strokeLine: '',
    },
  };

  return (
    <>
      <Appbar iconName={'settings'} />
      <View style={styles.container}>
        <ScrollView zoomScale={5} scrollToOverflowEnabled>
          <BarChart
            style={styles.graphStyle}
            data={data}
            width={screenWidth - responsiveWidth(7.5)}
            height={250}
            horizontalLabelRotation={0}
            withCustomBarColorFromData
            chartConfig={chartConfig}
            verticalLabelRotation={2}
            fromZero // Optional: starts the y-axis from zero
            showBarTops // Optional: shows rounded tops of the bars
          />
          <View style={styles.row}>
            {kyc || store ? (
              <Pressable
                style={styles.row_container}
                onPress={() => navigation.navigate('TrainerCourseScreen')}>
                <View style={styles.icon}>
                  <Image
                    source={require('../../img/MyCourse.png')}
                    style={{width: 35, height: 35}}
                  />
                </View>
                <Text style={styles.Active}>My Course</Text>
              </Pressable>
            ) : null}

            <View style={styles.row_container}>
              <View style={styles.icon}>
                <Icon
                  name="campaign" // 'campaign' icon resembles a loudspeaker in Material Icons
                  type="material"
                  size={35}
                  color="#87ceeb"
                />
              </View>

              <Text style={styles.Active}>Franchies</Text>
            </View>
            <View style={styles.row_container}>
              <View style={styles.icon}>
                <Icon name="groups" type="material" size={25} color="#000" />
              </View>

              <Text style={styles.Active}>Career</Text>
            </View>
            <View style={styles.row_container}>
              <View style={styles.icon}>
                <Icon
                  name="person-add"
                  type="material"
                  size={25}
                  color="#000"
                />
              </View>

              <Text style={styles.Active}>Retreat</Text>
            </View>
            <View style={styles.row_container}>
              <View style={styles.icon}>
                <Icon name="eye" type="font-awesome" size={25} color="#000" />
              </View>

              <Text style={styles.Active}>Events </Text>
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

              <Text style={styles.Active}> Reviews </Text>
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
              <Text style={styles.Active}>Transaction</Text>
            </View>
            {kyc || store ? (
              <Pressable
                style={styles.row_container}
                onPress={() => navigation.navigate('Profile')}>
                <View style={styles.icon}>
                  <Icon name="person" type="material" size={25} color="#000" />
                </View>
                <Text style={styles.Active}>Profile</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    paddingBottom:0,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    // overflow: 'hidden',
  },
  row_container: {
    width: responsiveWidth(28),
    height: responsiveHeight(13),
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
    alignSelf: 'center',
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
    fontFamily: 'Roboto-Medium',
    fontSize: 10,
  },
  graphStyle: {
    elevation: 1.5,
    opacity: 35,
    borderRadius: 15,
    marginBottom: 20,
  },
});

export default AccountScreen;
