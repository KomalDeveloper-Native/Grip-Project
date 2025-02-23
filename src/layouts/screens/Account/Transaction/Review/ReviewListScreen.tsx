/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {getStorageData, postMethod} from '../../../../../utils/helper';
import {MD2LightTheme} from 'react-native-paper';

interface Props {
  navigation: any;
  courseid: string;
}
const ReviewListScreen: FC<Props> = ({navigation, courseid}): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [allReview, setAllReview] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const showDeleteModal = id => {
    setReviewToDelete(id);
    setIsModalVisible(true);
  };

  const hideDeleteModal = () => {
    setIsModalVisible(false);
    setReviewToDelete(null);
  };

  useFocusEffect(
    useCallback(() => {
      ReviewList();
    }, [data]),
  );

  const ReviewList = async () => {
    try {
      setLoading(true);
      const storage = await getStorageData();
      const id = storage.response.user.id;
      const row = {
        user_id: id,
      };
      const response: any = await postMethod('user-review-list', row);
      if (response.status === 200) {
        console.log(response.data, 'gg');
        setAllReview(response.data['all_reviews']);
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

    // Cap the rating at 5 for display purposes
    const cappedRating = Math.min(rating, 5);
    const fullStars = Math.floor(cappedRating);
    const hasHalfStar = cappedRating > fullStars;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Icon key={i} name="star" type="material" color="orange" size={15} />,
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Icon
            key={i}
            name="star-half"
            type="material"
            color="orange"
            size={15}
          />,
        );
      } else {
        stars.push(
          <Icon
            key={i}
            name="star-outline"
            type="material"
            color="orange"
            size={15}
          />,
        );
      }
    }

    return stars;
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response: any = await postMethod(
        `delete-review-user?id=${reviewToDelete}`,
      );
      if (response.status === 200) {
        console.log(response.data, 'Review deleted');
        await ReviewList(); // Refresh the review list
      }
      setLoading(false);
      hideDeleteModal(); // Close the modal after deletion
    } catch (error) {
      setLoading(false);
      console.log('Error deleting review', error);
      hideDeleteModal(); // Close the modal on error as well
    }
  };

  const sendFunction = data => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditReviewScreen',
        params: {
          Review: data,
        },
      }),
    );
  };

  const handleShowMoreReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  const reviewsToShow = showAllReviews ? data : data.slice(0, 5);

  return (
    <>
      <View style={{alignSelf: 'flex-start', margin: 10, marginLeft: 10}}>
        <Icon name="arrow-back" onPress={() => navigation.goBack()} size={25} />
      </View>
      <View style={[styles.container]}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            width: responsiveWidth(90),
            borderRadius: 10,
            marginBottom: 10,
          }}>
          <Text style={{fontFamily: 'Roboto-Bold'}}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: responsiveFontSize(2),
              }}>
              My reviews
            </Text>
          </Text>
        </View>

        <ScrollView>
          {reviewsToShow.length > 0 ? (
            reviewsToShow.map(item => (
              <View
                key={item.id}
                style={[styles.row, {flexDirection: 'column'}]}>
                <View style={styles.containerRow}>
                  <Avatar size={64} rounded source={{uri: item.image}} />
                  <View style={styles.row}>
                    <View>
                      <Text style={styles.text1}>{item.name} </Text>
                      <Text style={styles.text1}>
                        {renderStars(item.rating)}{item.rating}
                      </Text>
                      <Text style={[styles.text2]}>{item.review}</Text>
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => sendFunction(item)}>
                        <Icon name="edit" size={20} color="gray" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => showDeleteModal(item.id)}>
                        <Icon name="delete" size={20} color="gray" />
                      </TouchableOpacity>
                      <Text style={styles.text2}>{item.time}</Text>
                    </View>
                  </View>
                </View>
                {item['review Image'] ? (
                  <Image
                    source={{uri: item['review Image']}}
                    style={styles.image}
                  />
                ) : null}
                <Text style={styles.text3}>{item.title}</Text>
              </View>
            ))
          ) : (
            <View style={styles.modalView}>
              <Text style={styles.modalText1}>No reviews available</Text>
            </View>
          )}
        </ScrollView>
      </View>
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={hideDeleteModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this review?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={hideDeleteModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDelete}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {data.length > 5 && (
        <Pressable style={styles.tabBottom} onPress={handleShowMoreReviews}>
          <Text style={styles.text}>
            {showAllReviews ? 'Show Less' : 'Show All Reviews'}
          </Text>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopColor: '#d3d3d3',
    borderBottomColor: '#d3d3d3',
    paddingVertical: 20,
    alignSelf: 'center',
  },
  text: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2),
  },
  containerRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom:5
  },
  row: {
    width: responsiveWidth(68),

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
    // width: responsiveWidth(40),
    color: 'gray',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Roboto-Light',
    marginBottom: 10,
    marginLeft: 5 ,
  },
  text3: {
    width: responsiveWidth(80),
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Regular',
    marginLeft: 10,
    marginBottom:20
  },
  tabBottom: {
    width: '100%',
    height: responsiveHeight(7),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    elevation: 1,
    borderColor: 'white',
    borderWidth: 2.5,
    position: 'static',
    marginBottom: 10,
    alignSelf: 'center',
  },
  image: {
    width: responsiveWidth(80),
    height: responsiveHeight(20),
    resizeMode: 'contain',
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: responsiveFontSize(1.75),
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText1: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
  },
});

export default ReviewListScreen;
