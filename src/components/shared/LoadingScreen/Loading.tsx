import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const Loading = () => {
  return (
    <View style={styles.loadingButtonContainer}>
      <ActivityIndicator size="large" color={'#2196F3'} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loadingButtonContainer: {
    padding: 30,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
