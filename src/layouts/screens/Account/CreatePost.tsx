/* eslint-disable prettier/prettier */
import React from 'react';
import { FC } from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {}
const CreatePost: FC<Props> = (): JSX.Element => {
  return (<View style={styles.container}><Text>Hello World</Text></View>);
};

const styles = StyleSheet.create({
  container: {},
});

export default CreatePost;