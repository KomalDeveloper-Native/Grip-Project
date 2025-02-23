/* eslint-disable @typescript-eslint/func-call-spacing */
/* eslint-disable react/self-closing-comp */
/* eslint-disable semi */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-lone-blocks */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FC} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Props, TextInput} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../style/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Controller, useForm} from 'react-hook-form';
import {
  FormPostMethod,
  getStorageData,
  postMethod,
} from '../../../../utils/helper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import Feather from 'react-native-vector-icons/Feather';
import {Icon} from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import {Switch} from 'react-native-switch';
import CalendarPicker from 'react-native-calendar-picker';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-date-picker';
import MultiSelect from 'react-native-multiple-select';
import {ViewPropTypes, TextPropTypes} from 'deprecated-react-native-prop-types';
import {isFriday, isSaturday} from 'date-fns';
import {MouseButton} from 'react-native-gesture-handler';
import moment from 'moment';

interface IFormData {
  meta_title: string;
  meta_keywords: string;
  meta_description: string;
  fees: string;
  enter_course_title: string;
  description: string;
  batch_strength: string;
  current_availability: string;
  user_id: number;

}

const EditCourse: FC<Props> = ({navigation, route}: any): JSX.Element => {
  const {course} = route.params;
  const [loading, setLoading] = useState(false);
  const [click, setClick] = useState(false);
  const [singleFile, setSingleFile] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [morningStartTime, setMorningStartTime] = useState<Date | null>(null);
  const [morningEndTime, setMorningEndTime] = useState<Date | null>(null);
  const [eveningStartTime, setEveningStartTime] = useState<Date | null>(null);
  const [eveningEndTime, setEveningEndTime] = useState<Date | null>(null);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [isMorning, setIsMorning] = useState(true);
  const [switchesState, setSwitchesState] = useState({
    switch1: false,
    switch2: false,
  });
  const [selectedTrainingLevels, setSelectedTrainingLevels] = useState<
    string[]
  >([]);
  const [selectedClassTypes, setSelectedClassTypes] = useState<string[]>([]);
  const [selectedBodyFocuses, setSelectedBodyFocuses] = useState<string[]>([]);
  const [selectedYogaStyles, setSelectedYogaStyles] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string[]>([]);
  const [selectedWeek1, setSelectedWeek1] = useState<string[]>([]);
  const multiSelectRef = useRef(null);
  const multiSelectRef2 = useRef(null);
  const multiSelectRef3 = useRef(null);
  const multiSelectRef4 = useRef(null);
  const multiSelectRef5 = useRef(null);
  const multiSelectRef6 = useRef(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTimeType, setSelectedTimeType] = useState('');

  const training = ['Basic', 'Practice', 'Intense'];
  const yogaClass = ['In-Person Class', 'Virtual Class'];

  const categories = [
    'Abs',
    'Ankle',
    'Arms',
    'Buttock',
    'Calves',
    'Chest',
    'Elbows',
    'Eyes',
    'Feet',
    'Hamstrings',
    'Legs',
    'Hands',
    'Head',
    'Lower Back',
    'Hips',
    'Core',
    'Immune System',
    'Stomach',
    'IT Band',
    'Back',
    'Bone',
    'Knee',
    'Heart',
    'Neck',
    'Psoas',
    'Quadriceps',
    'Shoulders',
    'Side Body',
    'Spine',
    'Thighs',
    'Upper Back',
    'Wrists',
  ];

  const yoga = [
    'Vinyasa',
    'Kundalini',
    'Yin',
    'Hatha',
    'Meditation',
    'Power',
    'Aerial Yoga',
    'Tai Chi/QiGong',
    'Restorative',
    'Yoga Fusion',
    'Acro Yoga',
    'Bhakti',
    'Chair Yoga',
  ];

  const weakDay = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

  const data = training.map((category: any) => ({
    name: category,
    id: category,
  }));

  const data1 = yogaClass.map(category => ({
    name: category,
    id: category,
  }));

  const data2 = categories.map(category => ({
    name: category,
    id: category,
  }));

  const Weak = weakDay.map(day => ({
    name: day,
    id: day,
  }));

  const data3 = yoga.map(style => ({
    name: style,
    id: style,
  }));

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isValid},
    reset,
    getValues,
  } = useForm<IFormData>({
    defaultValues: {
      meta_title: '',
      meta_keywords: '',
      meta_description: '',
      fees: '',
      enter_course_title: '',
      description: '',
      batch_strength: '',
      current_availability: '',
 
    },
  });

  const selectOneFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setSingleFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Canceled from single doc picker');
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const toggleSwitch = (switchName: 'switch1' | 'switch2') => {
    setSwitchesState(prevState => ({
      ...prevState,
      [switchName]: !prevState[switchName],
    }));
  };

  const useMemoFun = useMemo(() => {
    let [startTime, endTime] = course.morning_timing
      .split('to')
      .map(time => time.trim());

    let [startTime1, endTime1] = course.evening_timing
      .split('to')
      .map(time => time.trim());

    startTime = startTime;
    endTime = endTime;
    startTime1 = startTime1;
    endTime1 = endTime1;
    console.log(course.meta_title, 'coiur');
    if (course) {
      setValue('fees', course.price);
      setValue('enter_course_title', course.name);
      setValue('description', course.description);
      setValue('batch_strength', course.batch_strength);
      setValue('current_availability', course.current_availability);
      setSelectedBodyFocuses(course.body_focus.split(','));
      setSelectedClassTypes(course.class_type.split(','));
      setSelectedTrainingLevels(course.training_level.split(','));
      setSelectedYogaStyles(course.yoga_style.split(','));
      setSelectedWeek(
        course.morning_days ? course.morning_days.split(',') : [],
      );
      setSelectedWeek1(
        course.evening_days ? course.evening_days.split(',') : [],
      );
      setMorningStartTime(startTime);
      setMorningEndTime(endTime);

      console.log('start', course, 'tarr');

      setEveningStartTime(startTime1);
      setEveningEndTime(endTime1);

      if (course.morning_timing) {
        setSwitchesState(prevState => ({
          ...prevState,
          ['switch1']: !prevState['switch1'],
        }));
      }
    }

    if (course.evening_timing) {
      setSwitchesState(prevState => ({
        ...prevState,
        ['switch2']: !prevState['switch2'],
      }));
    }
  }, []);

  const openTimePickerHandler = type => {
    setSelectedTimeType(type);
    setTimePickerVisible(true);
  };

  const handleTimeConfirm = time => {
    const formattedTime = moment(time).format('hh:mm ');

    switch (selectedTimeType) {
      case 'morning_start':
        setMorningStartTime(formattedTime + 'Am');
        break;
      case 'morning_end':
        setMorningEndTime(formattedTime + 'Am');
        break;
      case 'evening_start':
        setEveningStartTime(formattedTime + 'Pm');
        break;
      case 'evening_end':
        setEveningEndTime(formattedTime + 'Pm');
        break;
      default:
        break;
    }

    setTimePickerVisible(false);
  };

  const renderTimePicker = () => {
    return (
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        locale="en_GB"
        cancelTextIOS="Cancel"
        confirmTextIOS="Confirm"
        is24Hour={true}
        date={new Date()}
        themeVariant="light"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisible(false)}
      />
    );
  };

  const onSubmit = async (data: IFormData) => {
    Keyboard.dismiss();
    setClick(true);
    createCourse(data);
  };

  const createCourse = async (data: IFormData) => {
    const storage = await getStorageData();
    const id = storage.response.user.id;
    try {
      setLoading(true);
      const switchValue = switchesState.switch1 ? 1 : 0;
      const switchValue1 = switchesState.switch2 ? 1 : 0;
      const formData = new FormData();
      formData.append('enter_course_title', data.enter_course_title);
      formData.append('training_level', selectedTrainingLevels.join(','));
      formData.append('body_focus', selectedBodyFocuses.join(','));
      formData.append('yoga_style', selectedYogaStyles.join(','));
      formData.append('class_type', selectedClassTypes.join(','));
      formData.append('description', data.description);
      formData.append('morning_timing', String(switchValue));
      formData.append('morning_days', selectedWeek.join(','));
      formData.append('morning_start_time', morningStartTime);
      formData.append('morning_end_time', morningEndTime);
      formData.append('evening_timing', String(switchValue1));
      formData.append('evening_days', selectedWeek1.join(','));
      formData.append('start_evening_time', eveningStartTime);
      formData.append('end_evening_time', eveningEndTime);
      formData.append('batch_strength', data.batch_strength);
      formData.append('current_availability', data.current_availability);
      formData.append('user_id', id);
      formData.append('fees', data.fees);
      if (data.meta_title) {
        formData.append('meta_title', data.meta_title);
      }
      if (data.meta_keywords) {
        formData.append('meta_keywords', data.meta_keywords);
      }
      if (data.meta_description) {
        formData.append('meta_description', data.meta_description);
      }
      console.log(formData, 'form');
      if (singleFile) {
        formData.append('select_image', {
          uri: singleFile.uri,
          type: singleFile.type,
          name: singleFile.name,
        });
      } else {
        console.log('file not selected');
      }

      const response: any = await FormPostMethod(
        `updatecourse?id=${course.id}`,
        formData,
      );
      if (response.data.success === true) {
        setClick(true);
        console.log(eveningStartTime, formData, 'ifmm');

        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: '#7CA942',
        });
        navigation.dispatch(
          CommonActions.navigate({
            name: 'TrainerCourseScreen',
          }),
        );
      } else {
        Snackbar.show({
          text: response.data.message,
          duration: 1000,
          textColor: colors.white,
          backgroundColor: 'red',
        });
      }
      setLoading(false);
    } catch (error) {
      setClick(false);
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.row0}>
        <Icon
          name="arrow-back"
          size={20}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.text0}>Edit Course</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView enabled>
          <View style={styles.container}>
            <Text style={styles.title}>Enter course tittle </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholderTextColor={colors.text_secondary}
                  underlineColor={colors.white}
                  textColor="black"
                  value={value}
                  onChangeText={value => onChange(value)}
                  style={[styles.textInput, {marginBottom: 30, paddingLeft: 3}]}
                />
              )}
              name="enter_course_title"
            />
            {errors.enter_course_title &&
              errors.enter_course_title.type === 'required' && (
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

            <View
              style={{
                width: responsiveWidth(89),
                alignSelf: 'center',
                marginBottom: 20,
              }}>
              <Text style={styles.title}>Morning Timing</Text>
              <Switch
                value={switchesState.switch1}
                onValueChange={() => toggleSwitch('switch1')}
                circleSize={30}
                barHeight={30}
                activeText={''}
                inActiveText={''}
                outerCircleStyle={{marginLeft: 7}}
                innerCircleStyle={{marginLeft: -20, width: 20, height: 20}}
                circleBorderWidth={0.5}
                backgroundActive={'green'}
                backgroundInactive={'gray'}
                circleActiveColor={'white'}
                circleInActiveColor={'white'}
                renderInsideCircle={() => <View />}
                changeValueImmediately={true}
                innerCircleStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                outerCircleStyle={{}}
                renderActiveText={false}
                renderInActiveText={false}
                switchLeftPx={2.5}
                switchRightPx={2.5}
                switchWidthMultiplier={2}
                switchBorderRadius={30}
              />
              {switchesState.switch1 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                      alignSelf: 'center',
                      gap: 80,
                      // alignSelf:'center',
                    }}>
                    <Pressable
                      style={styles.btn0}
                      onPress={() => openTimePickerHandler('morning_start')}>
                      <Text style={{color: 'black'}}>
                        {morningStartTime ? morningStartTime : '--:--'}
                      </Text>
                      <Icon name="clock-o" type="font-awesome" size={20} />
                    </Pressable>

                    {/* Morning End Time */}
                    <Pressable
                      style={styles.btn0}
                      onPress={() => openTimePickerHandler('morning_end')}>
                      <Text style={{color: 'black'}}>
                        {morningEndTime ? morningEndTime : '--:--'}
                      </Text>
                      <Icon name="clock-o" type="font-awesome" size={20} />
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignSelf: 'center',
                      justifyContent: 'space-between',
                      width: responsiveWidth(89),
                      // marginVertical: 10,
                    }}>
                    <View>
                      <Text style={styles.title}>Morning Days</Text>
                      <MultiSelect
                        hideTags
                        hideDropdown
                        styleListContainer={{
                          width: 250,
                          alignSelf: 'center',
                        }}
                        styleDropdownMenu={styles.textInput}
                        items={Weak}
                        uniqueKey="id"
                        ref={multiSelectRef}
                        selectedItems={selectedWeek}
                        onSelectedItemsChange={setSelectedWeek}
                        selectText={selectedWeek}
                        searchInputPlaceholderText="Search Items..."
                        onChangeInput={text => console.log(text)}
                        altFontFamily="Roboto-Bold"
                        tagRemoveIconColor="black"
                        tagBorderColor="black"
                        tagTextColor="black"
                        selectedItemTextColor="black"
                        selectedItemIconColor="green"
                        selectedItemFontFamily="Roboto-Bold"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{color: 'black'}}
                        hideSubmitButton
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                          width: responsiveWidth(89),
                          marginBottom: 10,
                        }}>
                        {multiSelectRef.current &&
                          multiSelectRef.current.getSelectedItemsExt(
                            selectedWeek,
                          )}
                      </View>
                    </View>
                  </View>
                </>
              ) : null}
            </View>

            <View
              style={{
                marginBottom: 20,
                alignSelf: 'center',
              }}>
              <Text style={styles.title}>Evening Timing</Text>
              <Switch
                value={switchesState.switch2}
                onValueChange={() => toggleSwitch('switch2')}
                circleSize={30}
                barHeight={30}
                activeText={''}
                inActiveText={''}
                outerCircleStyle={{marginLeft: 7}}
                innerCircleStyle={{marginLeft: -20, width: 20, height: 20}}
                circleBorderWidth={0.5}
                backgroundActive={'green'}
                backgroundInactive={'gray'}
                circleActiveColor={'white'}
                circleInActiveColor={'white'}
                renderInsideCircle={() => <View />}
                changeValueImmediately={true}
                innerCircleStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                outerCircleStyle={{}}
                renderActiveText={false}
                renderInActiveText={false}
                switchLeftPx={2.5}
                switchRightPx={2.5}
                switchWidthMultiplier={2}
                switchBorderRadius={30}
              />
              {switchesState.switch2 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                      alignSelf: 'center',
                      gap: 80,
                    }}>
                    <Pressable
                      style={styles.btn0}
                      onPress={() => openTimePickerHandler('evening_start')}>
                      <Text style={{color: 'black'}}>
                        {eveningStartTime ? eveningStartTime : '--:--'}
                      </Text>
                      <Icon name="clock-o" type="font-awesome" size={20} />
                    </Pressable>
                    <Pressable
                      style={styles.btn0}
                      onPress={() => openTimePickerHandler('evening_end')}>
                      <Text style={{color: 'black'}}>
                        {eveningEndTime ? eveningEndTime : '--:--'}
                      </Text>
                      <Icon name="clock-o" type="font-awesome" size={20} />
                    </Pressable>
                    {renderTimePicker()}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignSelf: 'center',
                      justifyContent: 'space-between',
                      width: responsiveWidth(89),
                      // marginVertical: 10,
                    }}>
                    <View>
                      <Text style={styles.title}>Evening Days</Text>
                      <MultiSelect
                        hideTags
                        hideDropdown
                        styleListContainer={{
                          width: 250,
                          alignSelf: 'center',
                        }}
                        styleDropdownMenu={styles.textInput}
                        items={Weak}
                        uniqueKey="id"
                        ref={multiSelectRef2}
                        selectedItems={selectedWeek1}
                        onSelectedItemsChange={setSelectedWeek1}
                        selectText={selectedWeek1}
                        searchInputPlaceholderText="Search Items..."
                        onChangeInput={text => console.log(text)}
                        altFontFamily="Roboto-Bold"
                        tagRemoveIconColor="black"
                        tagBorderColor="black"
                        tagTextColor="black"
                        selectedItemTextColor="black"
                        selectedItemIconColor="green"
                        selectedItemFontFamily="Roboto-Bold"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{color: 'black'}}
                        hideSubmitButton
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                          width: responsiveWidth(89),
                          marginBottom: 0,
                        }}>
                        {multiSelectRef2.current &&
                          multiSelectRef2.current.getSelectedItemsExt(
                            selectedWeek1,
                          )}
                      </View>
                    </View>
                  </View>
                </>
              ) : null}
            </View>

            <Text style={styles.title}>Training Level</Text>
            <MultiSelect
              hideTags
              hideDropdown
              styleListContainer={{
                width: 250,
                alignSelf: 'center',
              }}
              styleDropdownMenu={styles.textInput}
              styleSelectorContainer={{
                width: responsiveWidth(89),
                alignSelf: 'center',
              }}
              // styleItemsContainer={{width:responsiveWidth(100)}}
              items={data}
              uniqueKey="id"
              ref={multiSelectRef3}
              selectedItems={selectedTrainingLevels}
              onSelectedItemsChange={setSelectedTrainingLevels}
              selectText={selectedTrainingLevels}
              searchInputPlaceholderText="Search Items..."
              onChangeInput={text => console.log(text)}
              altFontFamily="Roboto-Bold"
              tagRemoveIconColor="black"
              tagBorderColor="black"
              tagTextColor="black"
              selectedItemTextColor="black"
              selectedItemIconColor="green"
              selectedItemFontFamily="Roboto-Bold"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{color: 'black'}}
              hideSubmitButton
            />

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignSelf: 'center',
                justifyContent: 'space-between',
                width: responsiveWidth(89),
                marginBottom: 20,
              }}>
              {multiSelectRef3.current &&
                multiSelectRef3.current.getSelectedItemsExt(
                  selectedTrainingLevels,
                )}
            </View>
            {selectedTrainingLevels.length < 1 && click && (
              <View style={styles.row}>
                <Feather
                  name="alert-circle"
                  size={9}
                  color="red"
                  style={styles.icon}
                />
                <Text style={styles.error}>This Field is required</Text>
              </View>
            )}

            <Text style={styles.title}>Class Type</Text>
            <MultiSelect
              hideTags
              hideDropdown
              styleListContainer={{
                width: 250,
                alignSelf: 'center',
                marginBottom: 2,
              }}
              styleDropdownMenu={styles.textInput}
              styleSelectorContainer={{
                width: responsiveWidth(89),
                alignSelf: 'center',
              }}
              items={data1}
              uniqueKey="id"
              ref={multiSelectRef4}
              selectedItems={selectedClassTypes}
              onSelectedItemsChange={setSelectedClassTypes}
              selectText={selectedClassTypes}
              searchInputPlaceholderText="Search Items..."
              onChangeInput={text => console.log(text)}
              altFontFamily="Roboto-Bold"
              tagRemoveIconColor="black"
              tagBorderColor="black"
              tagTextColor="black"
              selectedItemTextColor="black"
              selectedItemIconColor="green"
              selectedItemFontFamily="Roboto-Bold"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{color: 'black'}}
              hideSubmitButton
            />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignSelf: 'center',
                width: responsiveWidth(89),
                marginBottom: 20,
              }}>
              {multiSelectRef4.current &&
                multiSelectRef4.current.getSelectedItemsExt(selectedClassTypes)}
            </View>
            {selectedClassTypes.length < 1 && click && (
              <View style={styles.row}>
                <Feather
                  name="alert-circle"
                  size={9}
                  color="red"
                  style={styles.icon}
                />
                <Text style={styles.error}>This Field is required</Text>
              </View>
            )}

            <Text style={styles.title}>Body Focus</Text>
            <MultiSelect
              hideTags
              hideDropdown
              styleListContainer={{
                width: 250,
                alignSelf: 'center',
                marginBottom: 2,
              }}
              styleDropdownMenu={styles.textInput}
              styleSelectorContainer={{
                width: responsiveWidth(89),
                alignSelf: 'center',
              }}
              items={data2}
              uniqueKey="id"
              ref={multiSelectRef5}
              selectedItems={selectedBodyFocuses}
              onSelectedItemsChange={setSelectedBodyFocuses}
              selectText={selectedBodyFocuses}
              searchInputPlaceholderText="Search Items..."
              onChangeInput={text => console.log(text)}
              altFontFamily="Roboto-Bold"
              tagRemoveIconColor="black"
              tagBorderColor="black"
              tagTextColor="black"
              selectedItemTextColor="black"
              selectedItemIconColor="green"
              selectedItemFontFamily="Roboto-Bold"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{color: 'black'}}
              hideSubmitButton
            />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignSelf: 'center',
                width: responsiveWidth(89),
                marginBottom: 20,
              }}>
              {multiSelectRef5.current &&
                multiSelectRef5.current.getSelectedItemsExt(
                  selectedBodyFocuses,
                )}
            </View>
            {selectedBodyFocuses.length < 1 && click && (
              <View style={styles.row}>
                <Feather
                  name="alert-circle"
                  size={9}
                  color="red"
                  style={styles.icon}
                />
                <Text style={styles.error}>This Field is required</Text>
              </View>
            )}

            <Text style={styles.title}>Yoga Style</Text>
            <MultiSelect
              hideTags
              hideDropdown
              styleListContainer={{
                width: 250,
                alignSelf: 'center',
                marginBottom: 2,
              }}
              styleDropdownMenu={styles.textInput}
              styleSelectorContainer={{
                width: responsiveWidth(89),
                alignSelf: 'center',
              }}
              items={data3}
              uniqueKey="id"
              ref={multiSelectRef6}
              selectedItems={selectedYogaStyles}
              onSelectedItemsChange={setSelectedYogaStyles}
              selectText={selectedYogaStyles}
              searchInputPlaceholderText="Search Items..."
              onChangeInput={text => console.log(text)}
              altFontFamily="Roboto-Bold"
              tagRemoveIconColor="black"
              tagBorderColor="black"
              tagTextColor="black"
              selectedItemTextColor="black"
              selectedItemIconColor="green"
              selectedItemFontFamily="Roboto-Bold"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{color: 'black'}}
              hideSubmitButton
            />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignSelf: 'center',
                width: responsiveWidth(89),
                marginBottom: 20,
              }}>
              {multiSelectRef6.current &&
                multiSelectRef6.current.getSelectedItemsExt(selectedYogaStyles)}
            </View>
            {selectedYogaStyles.length < 1 && click && (
              <View style={styles.row}>
                <Feather
                  name="alert-circle"
                  size={9}
                  color="red"
                  style={styles.icon}
                />
                <Text style={styles.error}>This Field is required</Text>
              </View>
            )}

            <Text style={styles.title}>Batch Strength</Text>
            <Controller
              control={control}
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholderTextColor={colors.text_secondary}
                  underlineColor={colors.white}
                  textColor="black"
                  style={[styles.textInput, {marginBottom: 18, paddingLeft: 3}]}
                  value={value}
                  onChangeText={value => onChange(value)}
                />
              )}
              name="batch_strength"
            />

            <Text style={styles.title}>Current Availability</Text>

            <Controller
              control={control}
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholderTextColor={colors.text_secondary}
                  underlineColor={colors.white}
                  textColor="black"
                  style={[styles.textInput, {marginBottom: 18, paddingLeft: 3}]}
                  value={value}
                  onChangeText={value => onChange(value)}
                />
              )}
              name="current_availability"
            />
            <Text style={styles.title}>Fees</Text>
            <Controller
              control={control}
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholderTextColor={colors.text_secondary}
                  underlineColor={colors.white}
                  textColor="black"
                  style={[styles.textInput, {marginBottom: 18, paddingLeft: 3}]}
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={value => onChange(value)}
                />
              )}
              name="fees"
            />

            <Text style={styles.title}>Choose File</Text>

            <View style={styles.textInput0}>
              <View>
                <Text style={{color: 'black'}}>
                  {singleFile
                    ? singleFile.name
                    : course.select_image.split('/').splice(-1)}
                </Text>
              </View>

              <Icon
                name="camera"
                size={20}
                color="black"
                onPress={selectOneFile}
              />
            </View>
            {!singleFile ||
              (!course.select_image && (
                <View style={styles.row}>
                  <Feather
                    name="alert-circle"
                    size={9}
                    color="red"
                    style={styles.icon}
                  />
                  <Text style={styles.error}>This Field is required</Text>
                </View>
              ))}

            <Text style={styles.title}>Enter Descripition</Text>
            <Controller
              control={control}
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholderTextColor={colors.text_secondary}
                  underlineColor={colors.white}
                  textColor="black"
                  value={value}
                  onChangeText={value => onChange(value)}
                  style={styles.textInput1}
                />
              )}
              name="description"
            />
            <Text style={styles.title}>Meta Title</Text>
            <Controller
              control={control}
         
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholderTextColor={colors.text_secondary}
                  underlineColor={colors.white}
                  textColor="black"
                  value={value}
                  onChangeText={value => onChange(value)}
                  style={[styles.textInput, {marginBottom: 30, paddingLeft: 3}]}
                />
              )}
              name="meta_title"
            />
            <Text style={styles.title}>Meta Keywords</Text>
            <Controller
              control={control}
         
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholderTextColor={colors.text_secondary}
                  underlineColor={colors.white}
                  textColor="black"
                  value={value}
                  onChangeText={value => onChange(value)}
                  style={[styles.textInput, {marginBottom: 30, paddingLeft: 3}]}
                />
              )}
              name="meta_keywords"
            />
            <Text style={styles.title}>Meta Description</Text>
            <Controller
              control={control}
         
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  placeholderTextColor={colors.text_secondary}
                  underlineColor={colors.white}
                  textColor="black"
                  value={value}
                  onChangeText={value => onChange(value)}
                  style={[styles.textInput1]}
                />
              )}
              name="meta_description"
            />

            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={styles.btn}
              android_ripple={{color: 'white'}}>
              {loading ? (
                <ActivityIndicator size={20} color={colors.white} />
              ) : (
                <Text style={styles.btnText}>Save</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  row0: {
    width: responsiveWidth(100),
    alignSelf: 'center',
    paddingVertical: 15,
    marginBottom: -12,
    flexDirection: 'row',
    paddingHorizontal: 5,
    gap: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    alignSelf: 'center',

    marginBottom: 20,
  },
  text0: {
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: responsiveFontSize(2.6),
    marginBottom: 15,
  },
  title: {
    width: responsiveWidth(89),
    color: 'black',
    fontSize: responsiveFontSize(1.8),
    alignSelf: 'center',
    fontFamily: 'Roboto-Medium',
    marginBottom: 7,
  },
  textInput: {
    width: responsiveWidth(89),
    height: responsiveHeight(6.7),
    backgroundColor: colors.white,
    paddingLeft: 15,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    marginBottom: 0,
    color: colors.black,
    fontSize: responsiveFontSize(2),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  textInput1: {
    width: responsiveWidth(89),
    paddingBottom: 75,
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
    marginBottom: 10,
    color: colors.black,
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Roboto-Bold',
    borderWidth: 0,
    alignSelf: 'center',
  },
  textInput0: {
    width: responsiveWidth(89),
    height: responsiveHeight(6.7),
    backgroundColor: colors.white,
    elevation: 1.5,
    borderBottomStartRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopEndRadius: 15,
    opacity: 55.15,
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
  selectBtn: {
    backgroundColor: 'white',
    width: responsiveWidth(25),
    height: responsiveHeight(5),
    borderWidth: 0.02,
    elevation: 0.03,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 55,
  },
  selectText: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
  },

  row: {
    flexDirection: 'row',
    marginLeft: 25,
    marginTop: -15,
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
    backgroundColor: colors.black,
    width: responsiveWidth(85),
    height: responsiveHeight(6),
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 20,
    borderRadius: 8,
    elevation: 0.05,
    marginBottom: 0,
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
  btn0: {
    width: responsiveWidth(30),
    height: responsiveHeight(6),
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1.5,
    padding: 5,
    marginVertical: 10,
  },

  selectedItemsContainer: {
    width: 20,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignItems: 'flex-start',
    // justifyContent: 'space-between',
    // marginTop: 10,
    // marginBottom:20
  },
});

export default EditCourse;
