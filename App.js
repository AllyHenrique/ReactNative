import React from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from './components/Screen';

const App = () => {
  return (
    <View style={styles.container}>
      <Screen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
