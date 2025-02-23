/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {baseURL} from './config';
import NetInfo from '@react-native-community/netinfo';

export const storeData = async data => {
  try {
    await AsyncStorage.setItem('user_data', JSON.stringify(data));
  } catch (error) {
    console.log('storeData err', error);
  }
};

export const getStorageData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user_data');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('getStorageData err', e);
  }
};

const setHeader = (token) => {
  return token ? `Bearer ${token}` : '';
};

export const postMethod = async (url, body) => {
  try {
    let internet = await NetInfo.fetch();
    let StoredData = await getStorageData();
    const token = StoredData?.response?.token;

    if (internet.isInternetReachable) {
      return await axios.post(baseURL + url, body, {
        headers: {
          Authorization: setHeader(token),
          Accept: 'application/json',
        },
      });
    } else {
      console.log('postMethod error reason is internet =>', internet);
      return internet.isInternetReachable;
    }
  } catch (e) {
    console.log('postMethod error reason is =>', e);
    return e;
  }
};

export const getMethod = async (url) => {
  try {
    let internet = await NetInfo.fetch();
    let StoredData = await getStorageData();
    const token = StoredData?.response?.token;

    if (internet.isInternetReachable) {
      return await axios.get(baseURL + url, {
        headers: {
          Authorization: setHeader(token),
          Accept: 'application/json',
        },
      });
    } else {
      console.log('getMethod error reason is internet =>', internet);
      return internet.isInternetReachable;
    }
  } catch (e) {
    console.log('getMethod error reason is =>', e);
    return e;
  }
};

export const FormPostMethod = async (url, formData) => {
  try {
    let internet = await NetInfo.fetch();
    let StoredData = await getStorageData();
    const token = StoredData?.response?.token;

    if (internet.isInternetReachable) {
      return await axios.post(baseURL + url, formData, {
        maxBodyLength: 'infinity',
        headers: {
          Authorization: setHeader(token),
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data; charset=utf-8;',
        },
      });
    } else {
      console.log('FormPostMethod error reason is internet =>', internet);
      return internet.isInternetReachable;
    }
  } catch (e) {
    console.log('FormPostMethod error reason is =>', e);
    return e;
  }
};