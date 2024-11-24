import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// 화면 높이를 가져옵니다.
const screenHeight = Dimensions.get('window').height;

const MainScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        await Promise.all([
          checkLoginStatus()
        ])
      }

      loadData()
    }, [nickname])
  )

  const checkLoginStatus = async () => {
    try {
      const storedNickname = await AsyncStorage.getItem('nickname');
      const storedProfileImage = await AsyncStorage.getItem('profileImage');
      setNickname(storedNickname);
      setProfileImage(storedProfileImage);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRight}>
          {nickname ? (
            <>
              <Text style={styles.nickname}>{nickname}</Text>
              <View style={styles.profileImageContainer}>
                {profileImage ? (
                  <Image 
                    source={{ uri: profileImage }} 
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.emptyProfile} />
                )}
              </View>
            </>
          ) : (
            <TouchableOpacity 
              onPress={() => navigation.navigate('LoginScreen')}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>로그인하기</Text>
              <View style={styles.emptyProfile} />
            </TouchableOpacity>
          )}
        </View>
      </View>

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
            <TouchableOpacity
              onPress={() => navigation.navigate('SearchScreen')}
              style={styles.searchButton}>
              <Ionicons name="search-outline" size={24} color="black" />
              <Text style={styles.buttonText}>약 검색</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('MapScreen')}
              style={styles.searchButton}>
              <Ionicons name="business-outline" size={24} color="black" />
              <Text style={styles.buttonText}>약국 검색</Text>
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

  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    marginRight: 8,
    fontSize: 16,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  emptyProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    marginRight: 8,
    fontSize: 16,
    color: '#007AFF',
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
    marginBlockEnd: 20
  },
  buttonText: {
    marginLeft: 10,         // 아이콘과 텍스트 간의 간격
    fontSize: 16,           // 텍스트 크기
  },
});


export default MainScreen;