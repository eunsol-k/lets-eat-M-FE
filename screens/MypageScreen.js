// MainScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const MypageScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    loadUserData();
    loadRecentSearches();
  }, []);

  const loadUserData = async () => {
    try {
      const storedNickname = await AsyncStorage.getItem('nickname');
      const storedProfileImage = await AsyncStorage.getItem('profileImage');
      setNickname(storedNickname);
      setProfileImage(storedProfileImage);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
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
          <Text style={styles.nickname}>{nickname || '로그인하기'}</Text>
        </View>
      </View>

      <ScrollView>
        <Text style={styles.sectionTitle}>최근 검색</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.recentSearchContainer}
        >
          {recentSearches.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.medicineCard}
              onPress={() => navigation.navigate('MedicineDetail', { medicineId: item.id })}
            >
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.medicineImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.medicineName}>{item.name}</Text>
                <Text style={styles.medicineCompany}>{item.manufacturer}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 나머지 메인 화면 컨텐츠 */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    marginBlockStart: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  emptyProfile: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  recentSearchContainer: {
    paddingLeft: 16,
  },
  medicineCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medicineImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  medicineCompany: {
    fontSize: 12,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
});

export default MypageScreen;