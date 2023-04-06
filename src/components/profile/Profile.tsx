import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type ProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile',
  'Home'
>;

const Profile = ({navigation}: ProfileProps) => {
  return (
    <View style={styles.view}>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home', {id: '123'})}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  view: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
