/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-quotes */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Modal,
  Button,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Card, TextInput} from 'react-native-paper';
import {Avatar} from 'react-native-elements';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  CommonActions,
  useFocusEffect,
  validatePathConfig,
} from '@react-navigation/native';
import {
  FormPostMethod,
  getMethod,
  getStorageData,
  postMethod,
} from '../../../utils/helper';
import colors from '../../style/colors';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';
import {CommentSection} from 'react-comments-section';
import {Controller, useForm} from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker';

interface Props {
  navigation: any;
}
const UpDateScreen: FC<Props> = ({navigation}: any): JSX.Element => {
  const kyc = useSelector(state => state.List.kyc);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [showComments, setShowComments] = useState<{}>({});
  const [like, setLike] = useState({});
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<{}>({});
  const [refreshing, setRefreshing] = useState(false);
  const [singleFile, setSingleFile] = useState<any>(null);
  const [subscriptionModalVisible, setSubscriptionModalVisible] =
    useState(false);
  const [activeCommentId, setActiveCommentId] = useState<any>(null);
  const [commentsInput, setCommentsInput] = useState({});
  const [likeCount, setLikeCount] = useState({});

  const capitalizeFirstLetter = string => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [likeCount]),
  );
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await UpdateList();
    setRefreshing(false);
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async data => {
    Keyboard.dismiss();
    createPost(data);
    setSubscriptionModalVisible(false);
  };

  const selectOneFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setSingleFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const createPost = async data => {
    setLoading(true);
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    const formData = new FormData();

    formData.append('user_id', login_user);
    formData.append('content', data.content);
    if (singleFile) {
      formData.append('image', {
        uri: singleFile.uri,
        type: singleFile.type,
        name: singleFile.name,
      });
    } else {
      console.error('No file selected');
    }
    try {
      const response = await FormPostMethod('add-posts', formData);
      if (response.data.success === true) {
        console.log(response.data);
        reset();
        setSingleFile(null);
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
      }
    } catch (error) {
      console.error('Failed to update subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const UpdateList = useCallback(async () => {
    // setLoading(true);
    const storage = await getStorageData();
    setStore(storage.response.kyc);
    setUser(storage.response.user.id);

    try {
      const response = await getMethod('updates');
      if (response.status === 200) {
        console.log(response.data);
        const updatedData = response.data.data.map(item => ({
          ...item,
          uniqueId: Math.random(), // Use a more reliable unique ID generator in production
        }));
        setData(updatedData);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const optFunction = async item => {
    const storage = await getStorageData();
    const login_user = storage.response.user.id;
    console.log(login_user);
    setLoading(true);
    try {
      const row = {
        loginuser: login_user,
        user: item.user_id,
        course_id: item.id,
      };
      console.log(row, item);
      const response: any = await postMethod('optnow', row);
      console.log(response.data, 'res');
      if (response.data.success === true) {
        await AsyncStorage.setItem('name', JSON.stringify(item.name));
        await AsyncStorage.setItem('opt', JSON.stringify(response.data));

        Snackbar.show({
          text: response.data.message,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'green',
        });
        navigation.dispatch(
          CommonActions.navigate({
            name: 'ChatList',
          }),
        );
      } else {
        const emailErrors = response?.data?.errors?.email ?? [];
        const message = response?.data?.message ?? '';
        const errorMessage = [...emailErrors, message].join('\n');
        Snackbar.show({
          text: errorMessage,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
    setLoading(false);
  };

  const commentList = useCallback(
    async item => {
      setShowComments(prev => ({
        ...prev,
        [item.uniqueId]: !prev?.[item.uniqueId],
      }));
      try {
        const row = {
          post_id: item.id,
        };
        const response = await postMethod(
          `${item.table}-comments-and-likes`,
          row,
        );

        if (response.data.success === true) {
          setComments(prev => {
            const commentsList = response.data.response.comments_list;
            return {
              ...prev,
              [item.uniqueId]: {
                comments: commentsList,
                count: response.data.response.list_count,
              },
            };
          });
        }
        console.error(
          comments[item.uniqueId]?.count,
          response.data.response,
          'res',
        );
      } catch (error) {
        setLoading(false);
        console.log('error');
      }
      return comments[item.uniqueId];
    },
    [comment],
  );

  const handleCommentSubmit = useCallback(
    async item => {
      const currentComment = commentsInput[item.uniqueId] || '';
      const storage = await getStorageData();
      const id = storage.response.user.id;
      Keyboard.dismiss();
      try {
        const response = await postMethod(`add-${item.table}-comment`, {
          postId: item.id,
          comment: currentComment,
          user_id: id,
        });

        if (response.data.success === true) {
          commentList(item);
          setShowComments(prev => ({
            ...prev,
            [item.uniqueId]: !prev?.[item.uniqueId],
          }));
          setData(prevData =>
            prevData.map(dataItem =>
              dataItem.id === item.id
                ? {...dataItem, commentcount: dataItem.commentcount + 1} // Increment count
                : dataItem,
            ),
          );

          // Clear the input
          setCommentsInput(prev => ({...prev, [item.uniqueId]: ''}));
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    },
    [commentsInput],
  );

  const handleFocus = item => {
    setActiveCommentId(item.id);
  };

  const handleCancel = () => {
    setSubscriptionModalVisible(false);
  };

  const addLike = async item => {
    const storage = await getStorageData();
    const userId = storage.response.user.id;

    const row = {postId: item.id, user_id: userId};

    try {
      const response = await postMethod(`add-${item.table}-like`, row);
      if (response.data.success) {
        setLike(prev => ({
          ...prev,
          [item.uniqueId]: !prev[item.uniqueId], // Toggle like state
        }));
        setLikeCount(prev => ({
          ...prev,
          [item.id]: response.data.like_count, // Update directly based on the item ID
        }));
      } else {
        Snackbar.show({
          text: response.data.message,
          duration: 2000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
    } catch (error) {
      console.error('Error adding like:', error);
      Snackbar.show({
        text: 'Failed to add like. Please try again.',
        duration: 2000,
        textColor: colors.white,
        backgroundColor: 'red',
      });
    }
  };

  const sendId = (item, id) => {
    console.error(item.table);
    let screen;
    if (item.table === 'course') {
      if (store) {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'TrainerDetailScreen',
            params: {
              course_id: item.id,
            },
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'CourseDetailScreen',
            params: {
              courseid: id,
              course: item,
              login_user: user,
            },
          }),
        );
      }
    } else if (item.table === 'franchise') {
      if (store) {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'FranchiseTrainerDetailScreen',
            params: {
              franchiseid: id,
            },
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'FranchiseDetailScreen',
            params: {
              franchiseid: id,
              loginUser: user,
              userid: item.user_id,
            },
          }),
        );
      }
    } else if (item.table === 'retreat') {
      if (store) {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'RetreatUserDetailScreen',
            params: {
              retreatid: id,
            },
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'RetreatDetailsScreen',
            params: {
              retreatid: item.id,
              userid: item.user_id,
              loginUser: user,
            },
          }),
        );
      }
    } else if (item.table === 'career') {
      if (store) {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'TrainerJobDetail',
            params: {
              jobid: id,
            },
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'JobDetailScreen',
            params: {
              jobid: id,
              loginUser: user,
            },
          }),
        );
      }
    }
  };

  const sendFranchiseFun = id => {
    // console.log(data)
    // FranchiseScreen
    navigation.dispatch(
      CommonActions.navigate({
        name: 'FranchiseApply',
        params: {
          franchiseid: id,
        },
      }),
    );
  };

  const sendJobFun = data => {
    console.log(data, 'jj');
    // jobScreen
    navigation.dispatch(
      CommonActions.navigate({
        name: 'JobApplyScreen',
        params: {
          jobid: data.id,
          apply: data.apply_status,
        },
      }),
    );
  };

  const sendRetreatFun = data => {
    navigation.navigate('RetreatApplyScreen', {
      retreatid: data.id,
      retreat: data,
    });
  };

  const renderItem = ({item}) => (
    <>
      <Card
        style={styles.card}
        key={item.id}
        elevation={0.2}
        onPress={() => sendId(item, item.id)}>
        <Pressable
          style={{flexDirection: 'row', gap: 5}}
          onPress={() => sendId(item, item.id)}>
          {item['user image'] ? (
            <Image source={{uri: item['user image']}} style={styles.rowimage} />
          ) : null}
          <View>
            <View style={styles.rowTitle}>
              {item.Screen === 'post' ? (
                <Text
                  style={[
                    styles.text0,
                    {
                      width: responsiveWidth(70),
                      fontSize: responsiveFontSize(2),
                    },
                  ]}>
                  {item.user_message}
                </Text>
              ) : (
                <Text style={[styles.tittle, {fontFamily: 'Roboto-Bold'}]}>
                  {capitalizeFirstLetter(item.name)}
                </Text>
              )}

              <Text
                style={[
                  {
                    fontSize: responsiveFontSize(1.7),
                    width: responsiveWidth(100),
                    color: 'gray',
                    opacity: 55,
                  },
                ]}>
                {item.agotime}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon
                name="location-pin"
                type="entypo"
                color={'red'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={[styles.text1, {marginLeft: -1}]}>
                {item.location}
              </Text>
            </View>
          </View>
        </Pressable>
        {item.title ? <Text style={styles.tittle}>{item.title}</Text> : null}

        {item.table === 'event' ? (
          <>
            <View style={styles.row}>
              <Icon
                name="calendar"
                type="font-awesome"
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.created_at}</Text>
            </View>
            <View style={styles.row}>
              <Icon
                name="clock-o"
                type="font-awesome"
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.morning_days}</Text>
            </View>
          </>
        ) : null}
        {item.table === 'retreat' ? (
          <>
            <View style={styles.row}>
              <Icon
                name="groups"
                type="material"
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.created_at}</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="weather-night" // Icon representing a half moon with a sun
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>
                {item.days <= 1 ? ` ${item.days}Day ` : `${item.days}Days `}
                {item.Nights <= 1 ? `${item.days}Night` : `${item.days}Nights`}
              </Text>
              {/* {item.nights} Nights */}
            </View>
            <View style={styles.row}>
              <Icon
                name="currency-inr"
                type="material-community"
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.fees}</Text>
            </View>
          </>
        ) : null}

        {item.table === 'franchise' ? (
          <>
            <View style={styles.row}>
              <Icon
                name="map"
                type="material"
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.area}</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="chart-line" // Icon representing a half moon with a sun
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item['investment start']}</Text>
            </View>
          </>
        ) : null}

        {item.table === 'career' ? (
          <>
            <View style={styles.row}>
              <Icon
                name="currency-inr"
                type="material-community"
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>Salary {item.salery} Per Month</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="clock-check"
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.job_type}</Text>
            </View>
            <View style={styles.row}>
              <Icon
                name="sunny"
                type="material"
                color={'black'}
                size={20}
                style={styles.rowSpace}
              />
              <Text style={styles.text1}>{item.created_at}</Text>
            </View>
          </>
        ) : null}
        {item.table === 'post' ? (
          <Text style={[styles.tittle, {fontFamily: 'Roboto-medium'}]}>
            {capitalizeFirstLetter(item.name)}
          </Text>
        ) : null}

        {item['banner image'] ? (
          <Image source={{uri: item['banner image']}} style={styles.image} />
        ) : null}
        <View style={styles.row1}>
          <Pressable
            style={[styles.row0, {marginBottom: 0, alignItems: 'center'}]}
            onPress={() => addLike(item)}>
            {item.likecount ? (
              <MaterialCommunityIcons
                name={
                  likeCount[item.id] === 1 ? 'thumb-up' : 'thumb-up-outline'
                }
                color="black"
                size={25}
              />
            ) : (
              <MaterialCommunityIcons
                name={'thumb-up-outline'}
                color="black"
                size={25}
              />
            )}

            <Text style={styles.text}>{item.likecount}</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              console.log('Chat icon clicked'); // Debugging log
              Keyboard.dismiss();
              commentList(item);
            }}
            style={[styles.row0, {marginBottom: 0, alignItems: 'center'}]}>
            <Icon
              name="chatbox-ellipses-outline"
              type="ionicon"
              color="black"
              size={30}
            />
            <Text style={styles.text0}>{item.commentcount}</Text>
          </Pressable>
          {item.table === 'course' ? (
            <Pressable style={styles.btn} onPress={() => optFunction(item)}>
              <Text
                style={[
                  styles.text0,
                  {
                    color: 'white',
                    fontFamily: 'Roboto-Bold',
                    fontSize: responsiveFontSize(1.7),

                    margin: 0,
                  },
                ]}>
                Join Now
              </Text>
            </Pressable>
          ) : null}
          {item.table === 'retreat' && (
            <Pressable style={styles.btn} onPress={() => sendRetreatFun(item)}>
              <Text
                style={[
                  styles.text0,
                  {
                    color: 'white',
                    fontFamily: 'Roboto-Bold',
                    fontSize: responsiveFontSize(1.7),

                    margin: 0,
                  },
                ]}>
                Book Now
              </Text>
            </Pressable>
          )}

          {item.table === 'franchise' && (
            <Pressable
              style={styles.btn}
              onPress={() => sendFranchiseFun(item)}>
              <Text
                style={[
                  styles.text0,
                  {
                    color: 'white',
                    fontFamily: 'Roboto-Bold',
                    fontSize: responsiveFontSize(1.7),

                    margin: 0,
                  },
                ]}>
                Show Interest
              </Text>
            </Pressable>
          )}
          {item.table === 'career' && (
            <Pressable style={styles.btn} onPress={() => sendJobFun(item)}>
              <Text
                style={[
                  styles.text0,
                  {
                    color: 'white',
                    fontFamily: 'Roboto-Bold',
                    fontSize: responsiveFontSize(1.7),

                    margin: 0,
                  },
                ]}>
                Apply Now
              </Text>
            </Pressable>
          )}
        </View>
        {showComments[item.uniqueId] ? (
          <View style={styles.commentSection}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={'Add Comment here'}
                textAlignVertical={'top'}
                multiline={true}
                autoCorrect={true}
                style={styles.commentInput}
                value={commentsInput[item.uniqueId] || ''}
                onChangeText={text => {
                  console.warn('erro');

                  setCommentsInput(prev => ({
                    ...prev,
                    [item.uniqueId]: text,
                  }));
                }}
                // onFocus={() => handleFocus(item)}
                activeOutlineColor="white"
                activeUnderlineColor="white"
                underlineColor={colors.white}
                outlineColor="white"
                textColor="black"
                right={
                  <TextInput.Icon
                    icon="send"
                    size={30}
                    color="green"
                    onPress={() => {
                      Keyboard.dismiss(); // Dismiss the keyboard
                      handleCommentSubmit(item); // Submit the comment
                    }}
                  />
                }
              />
            </View>
            {comments[item.uniqueId] &&
              comments[item.uniqueId].comments &&
              comments[item.uniqueId].comments.map(c => (
                <View
                  key={c.id} // Use a unique identifier for the key
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 5,
                    alignSelf: 'center',
                  }}>
                  <Avatar size={40} rounded source={{uri: c.user_id}} />
                  <View style={styles.commentContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.commentText0}>{c.name}</Text>
                      <Text
                        style={[
                          styles.commentText0,
                          {
                            fontFamily: 'Roboto-Medium',
                            width: responsiveWidth(25),
                            fontSize: responsiveFontSize(1.2),
                          },
                        ]}>
                        {c.created_at}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{c.content}</Text>
                  </View>
                </View>
              ))}
          </View>
        ) : null}
      </Card>
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row0}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="arrow-back"
            size={25}
            color={'black'}
            onPress={() => navigation.goBack()}
          />
          <Image
            source={require('../../img/one.jpeg')}
            style={styles.logoImage}
          />
        </Pressable>

        <View style={styles.row}>
          {kyc || store ? (
            <Icon
              name="plus"
              type="entypo"
              color={'black'}
              size={30}
              onPress={() => setSubscriptionModalVisible(true)}
            />
          ) : null}
        </View>

        <Modal
          transparent={true}
          visible={subscriptionModalVisible}
          animationType="slide"
          onRequestClose={handleCancel}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.cancelIcon}
                onPress={() => handleCancel()}>
                <Icon type="material" name="close" size={30} color="#000" />
              </Pressable>
              <View style={styles.rowIcon}>
                <Text style={styles.name}>Create Post</Text>
              </View>
              <Text style={styles.text}>What's on Your Mind</Text>
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    placeholder=""
                    style={styles.textInput}
                    textColor="black"
                    underlineColor="white"
                    outlineColor="white"
                    value={value}
                    onChangeText={value => onChange(value)}
                    placeholderTextColor="black"
                  />
                )}
                name="content"
              />
              {errors.content && (
                <View style={[styles.rowText, {marginLeft: 0}]}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>This field is required.</Text>
                </View>
              )}

              <Text style={styles.text}>Choose File</Text>

              <View style={styles.textInput0}>
                <View>
                  <Text style={{color: 'black'}}>
                    {singleFile ? singleFile.name : ''}
                  </Text>
                </View>

                <Icon
                  name="camera"
                  size={20}
                  color="black"
                  onPress={selectOneFile}
                />
              </View>

              <Pressable
                style={styles.btnItem}
                onPress={handleSubmit(onSubmit)}>
                <Text style={styles.btnItemText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      {loading ? (
        <ActivityIndicator size={20} color={colors.black} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.uniqueId.toString()}
          contentContainerStyle={{paddingBottom: 20}}
          keyboardShouldPersistTaps={'always'}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),

    padding: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    overflow: 'hidden',
  },

  row0: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowimage: {
    width: responsiveWidth(10),
    height: responsiveHeight(5),
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
  },

  logoImage: {
    width: responsiveWidth(14),
    height: responsiveHeight(7),
  },
  tittle: {
    width: responsiveWidth(75),

    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(2),
    marginBottom: 10,
  },
  name: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginBottom: 5,
  },
  rowTitle: {
    width: responsiveWidth(55),

    marginLeft: 5,
    marginBottom: 5,
  },
  text0: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2),
  },
  text1: {
    width: responsiveWidth(68),
    display: 'flex',
    flexWrap: 'wrap',
    color: 'black',
    letterSpacing: 1,
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.7),
    marginBottom: 5,
    marginLeft: 5,
  },
  card: {
    width: responsiveWidth(90),
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    alignSelf: 'center',
    elevation: 5,
    opacity: 88,
  },
  image: {
    width: responsiveWidth(85),
    height: responsiveHeight(25),
    padding: 20,
    alignSelf: 'center',
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowSpace: {
    width: 25,
    alignItems: 'center',
  },

  text: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
  },
  btn: {
    width: responsiveWidth(28),
    height: responsiveHeight(5),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 1,
    borderColor: 'white',
    borderWidth: 2.5,
    position: 'static',
    marginBottom: 0,
    alignSelf: 'center',
  },
  text2: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    marginBottom: 0,
  },
  commentSection: {
    marginTop: 10,
  },
  commentText0: {
    width: responsiveWidth(47.5),

    // flex: 1,

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(1.7),
    marginVertical: 0,
  },
  commentText: {
    width: responsiveWidth(65),

    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: responsiveFontSize(1.5),
    marginVertical: 5,
  },
  commentContainer: {
    width: responsiveWidth(70),
    //  minHeight:responsiveHeight(20),
    elevation: 1,
    opacity: 0.75,
    // borderWidth:1,
    marginBottom: 30,
    borderRadius: 10,
    padding: 10,
  },
  inputContainer: {
    width: responsiveWidth(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    // gap: 4,
  },
  commentInput: {
    width: responsiveWidth(81),
    backgroundColor: 'white',
    color: 'black',
    opacity: 188,
    // borderWidth:0.2,
    elevation: 1,
    borderRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: 0,
    alignSelf: 'center',
  },

  title: {
    width: responsiveWidth(89),
    color: 'black',
    fontSize: responsiveFontSize(1.7),
    alignSelf: 'center',
    fontFamily: 'Roboto-Medium',
    marginBottom: 7,
  },
  textInput: {
    width: responsiveWidth(85),
    height: responsiveHeight(6.7),
    backgroundColor: colors.white,
    // paddingLeft: 20,
    elevation: 1.5,
    borderBottomStartRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopEndRadius: 20,
    opacity: 55.2,
    marginTop: 5,
    marginBottom: 20,
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0,
    overflow: 'hidden',
    alignSelf: 'center',
  },

  textInput0: {
    width: responsiveWidth(85),
    height: responsiveHeight(6.7),
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopEndRadius: 20,
    opacity: 55.2,
    marginTop: 5,

    marginBottom: 20,
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0,
    overflow: 'hidden',
    padding: 12,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Modal
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: responsiveWidth(90),
    // height: responsiveHeight(18),
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 20,
  },
  cancelIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  modalText: {
    // marginTop: 20,
    // fontSize: 18,
    // textAlign: 'center',
  },
  rowIcon: {},
  rowIcon1: {
    flexDirection: 'row',
    gap: 10,
    // marginBottom:10,
    alignItems: 'center',
    marginBottom: 20,
  },

  btnItem: {
    width: responsiveWidth(30),
    height: responsiveHeight(5),
    backgroundColor: 'white',
    elevation: 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
    marginBottom: 40,
  },
  btnItemText: {
    color: 'black',
    fontSize: responsiveFontSize(1.96),
    fontFamily: 'Roboto-Medium',
  },
  rowText: {
    flexDirection: 'row',
    marginLeft: 12,
    marginBottom: 5,
  },
  icon: {
    marginRight: 4,
    marginTop: -8,
  },
  error: {
    width: 330,
    color: 'red',
    fontSize: 10,
    marginTop: -10,
  },
});

export default UpDateScreen;
