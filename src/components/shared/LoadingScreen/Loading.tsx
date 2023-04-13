import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme, ActivityIndicator} from 'react-native-paper';

const Loading = () => {
  const theme = useTheme();

  return (
    <View style={styles.loadingButtonContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
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
