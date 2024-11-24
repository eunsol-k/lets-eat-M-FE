// SettingsScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Switch,
  Alert,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_ROOT } from '../config/config'
import { useFocusEffect } from '@react-navigation/native';

const SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLicenseModalVisible, setLicenseModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        await Promise.all([
          checkLoginStatus()
        ])
      }

      loadData()
    }, [isLoggedIn])
  )

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Login check error:', error);
    }
  };

  const handleLogout = async () => {
    if (!isLoggedIn) return;

    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('nickname');
      navigation.navigate('MainScreen');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleWithdrawal = async () => {
    if (!isLoggedIn) return;
    
    Alert.alert(
      '회원 탈퇴',
      '정말로 탈퇴하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('access_token');
              const response = await fetch(`${SERVER_ROOT}/auth/users`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              if (response.status === 200) {
                await AsyncStorage.removeItem('access_token');
                await AsyncStorage.removeItem('refresh_token');
                await AsyncStorage.removeItem('nickname');
                navigation.navigate('MainScreen');
              }
            } catch (error) {
              console.error('Withdrawal error:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>환경 설정</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>로그인 관리</Text>
        <TouchableOpacity 
          style={[styles.menuItem, !isLoggedIn && styles.disabledMenuItem]} 
          onPress={handleLogout}
        >
          <Text style={[styles.menuText, !isLoggedIn && styles.disabledText]}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuItem, !isLoggedIn && styles.disabledMenuItem]} 
          onPress={handleWithdrawal}
        >
          <Text style={[styles.menuText, styles.dangerText, !isLoggedIn && styles.disabledText]}>회원 탈퇴</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>사용자 정의</Text>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>화면 스타일 설정</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기타</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setLicenseModalVisible(true)}
        >
          <Text style={styles.menuText}>오픈소스 라이선스 확인</Text>
          <Icon name="help-circle-outline" size={24} color="#666" />
        </TouchableOpacity>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>라이선스 버전</Text>
          <Text style={styles.versionText}>2.0</Text>
        </View>
      </View>

      <Modal
        visible={isLicenseModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>오픈소스 라이선스</Text>
            <Text style={styles.licenseText}>
              "Copyright [2024] [Let's eat M]

              Licensed under the Apache License, Version 2.0 (the "License");
              you may not use this file except in compliance with the License.
              You may obtain a copy of the License at
              http://www.apache.org/licenses/LICENSE-2.0

              Unless required by applicable law or agreed to in writing, software
              distributed under the License is distributed on an "AS IS" BASIS,
              WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
              See the License for the specific language governing permissions and
              limitations under the License."
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setLicenseModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBlockStart: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  dangerText: {
    color: 'red',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  disabledMenuItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  licenseText: {
    fontSize: 14,
    marginBottom: 16,
  },
  closeButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  }
});

export default SettingsScreen;