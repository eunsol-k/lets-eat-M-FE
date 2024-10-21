import { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  StyleSheet, 
  StatusBar, 
  FlatList, 
  Text 
} from 'react-native';

const MainScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <View>사진을 찍어 알아봐요!</View>
        <View style={styles.card}>
          <Text style={styles.bodyText}>알약 촬영하기</Text>
        </View>
        <View>검색을 통해 알아봐요!</View>
        <View style={styles.card}>
          <Text style={styles.bodyText}>약 검색</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.bodyText}>약국 검색</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.bodyText}>약 모양으로 검색</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: StatusBar.currentHeight,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default MainScreen;