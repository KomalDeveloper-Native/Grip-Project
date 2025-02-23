/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {FC} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Avatar, Icon, Image} from 'react-native-elements';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {postMethod} from '../../../utils/helper';

interface Props {}
const TrainerReview: FC<Props> = ({navigation, Trainer_id}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [allReview, setAllReview] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useFocusEffect(
    useCallback(() => {
      ReviewList();
    }, []),
  );

  const ReviewList = async () => {
    try {
      setLoading(true);
      const row = {
        trainer_id: Trainer_id,
      };
      const response: any = await postMethod('trainer-review-list', row);
      console.log(response);
      if (response.status === 200) {
        setAllReview(response.data['All reviews']);
        setData(response.data.review);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const renderStars = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          type="material"
          color="orange"
          size={15}
        />
      );
    }
    return stars;
  };

  const reviewsToShow = showAllReviews ? data : data.slice(0, 5);

  return (
    <>
      <View style={[styles.container, {marginBottom: -5}]}>
        <Text style={styles.text}>  {
          allReview.reviewCount>1?'Customer reviews':'Customer review'
          }</Text>
        <Text style={[styles.text, {fontSize: 28, fontFamily: 'Roboto-Medium'}]}>
          {allReview.reviewCount}
        </Text>
        <Text>{renderStars(allReview.averageRating)}</Text>
      </View>
      <ScrollView>
        {reviewsToShow.map(item => (
          <View style={[styles.container]} key={item.id}>
            <View style={styles.containerRow}>
              <Avatar size={64} rounded source={{uri: item.image}} />
              <View style={styles.row}>
                <View style={{width:'75%'}}>
                  <Text style={styles.text1}>{item.name}</Text>
                  <Text style={styles.text1}>
                    {renderStars(item.rating)} {item.rating}
                  </Text>
                  <Text style={[styles.text2, {width: responsiveWidth(60)}]}>
                    {item.review}
                  </Text>
                </View>
                <Text style={styles.text2}>{item.time}</Text>
              </View>
            </View>
            {item['review Image'] && (
              <Image source={{uri: item['review Image']}} style={styles.image} />
            )}
            <Text style={styles.text3}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
      {data.length > 5 && (
        <Pressable
          style={styles.tabBottom}
          onPress={() => setShowAllReviews(!showAllReviews)}>
          <Text style={styles.text}>
            {showAllReviews ? "Show Less" : "Show All Reviews"}
          </Text>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderTopColor: '#d3d3d3',
    borderBottomColor: '#d3d3d3',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  text: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2),
  },
  containerRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 20,
  },
  row: {
    width: responsiveWidth(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text1: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Black',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text2: {
    // width: responsiveWidth(10),

    color: 'gray',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Roboto-Light',
    marginBottom: 10,
    // marginLeft: 5 ,
  },
  text3: {
    width: responsiveWidth(80),
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Regular',
    marginLeft: 10,
  },
  tabBottom: {
    width: '100%',
    height: responsiveHeight(7),
    borderRadius:50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    elevation: 1,
    borderColor:'white',
    borderWidth:2.5,
    position: 'static',
    marginBottom:10,
    alignSelf:'center'
  },
  image: {
    width: responsiveWidth(80),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default TrainerReview;
