import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';  // 네비게이션 훅 임포트


// 화면 높이를 가져옵니다.
const screenHeight = Dimensions.get('window').height;

const MainScreen = () => {

  const navigation = useNavigation();  // 네비게이션 훅 사용
  

  // 카메라 화면으로 이동하는 함수
  const goToCamera = () => {
    navigation.navigate('Camera');  // 'Camera' 화면으로 이동
  };

  return (
    <View style={styles.container}>
      {/* Section for taking a photo */}
      <View style={styles.section}>
      <Text style={styles.sectionText}>사진을 찍어 알아봐요!</Text>
      <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('Camera')}>
          <Ionicons name="camera-outline" size={24} color="black" />
          <Text style={styles.buttonText}>알약 촬영하기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {/* Section for search options */}
      <View style={styles.section}>
      <Text style={styles.sectionText}>검색을 통해 알아봐요!</Text>
        <View style={styles.searchOptions}>
        <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color="black" />
          <Text style={styles.buttonText}>약 검색</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="business-outline" size={24} color="black" />
          <Text style={styles.buttonText}>약국 검색</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.searchButton}>
      <FontAwesome name="medkit" size={24} color="black" />
        <Text style={styles.buttonText}>약 모양으로 검색</Text>
      </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    
  },
  separator: {
    borderBottomWidth: 1,  // 구분선의 두께
    borderBottomColor: '#eee',  // 구분선의 색상
    width: '100%',  // 전체 너비로 확장
    marginVertical: 10,  // 위 아래 간격 설정
  },
  rowContainer: {
    flexDirection: 'row',      // 버튼들을 가로로 배치
    justifyContent: 'space-between',  // 두 버튼 사이에 일정 간격을 띄우며 가운데 정렬
    width: '80%',             // 버튼들이 전체 화면의 80%만큼 차지하도록 설정
    marginBottom: screenHeight * 0.02,          // 아래 버튼과 간격을 띄움
    // width: '45%',              // 가로 크기는 45%로 설정 (각 버튼이 2개라면 적절함)
  },
  section: {
    marginBottom: screenHeight * 0.05,  // 화면 높이의 5%만큼 아래쪽 마진 설정
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  sectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.03,
  },
  searchButton: {
    flexDirection: 'row',  // 아이콘과 텍스트를 가로로 배치
    alignItems: 'center',  // 세로로 가운데 정렬
    justifyContent: 'center',  // 가로로 가운데 정렬
    height: screenHeight * 0.075,            // 버튼의 높이를 화면의 10%로 설정
    padding: 10,           // 버튼 안의 여백
    backgroundColor: 'white', // 배경 색상
    borderRadius: 15,

    // iOS에서 그림자 효과
    shadowColor: '#000',           // 그림자 색상
    shadowOffset: { width: 0, height: 2 },  // 그림자의 위치 (수평, 수직)
    shadowOpacity: 0.2,            // 그림자의 투명도
    shadowRadius: 3,               // 그림자의 크기

    // Android에서 그림자 효과
    elevation: 5,                  // 그림자 크기
  },
  buttonText: {
    marginLeft: 10,         // 아이콘과 텍스트 간의 간격
    fontSize: 16,           // 텍스트 크기
  },
});


export default MainScreen;