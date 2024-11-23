// MainScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_ROOT } from '../config/config'
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const MypageScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [like, setLike] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        await Promise.all([
          loadUserData(),
          loadRecentSearches()
        ])
      }

      loadData()
    }, [like])
  )

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
    const storedAccessToken = await AsyncStorage.getItem('access_token');

    try {
      const response = await fetch(`${SERVER_ROOT}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedAccessToken}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        setRecentSearches(data.items);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

    const getLike = async (medicineId) => {
    const storedAccessToken = await AsyncStorage.getItem('access_token');
    
    try {
      const response = await fetch(`${SERVER_ROOT}/likes/${medicineId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedAccessToken}`
        }
      });

      if (response.status === 200) {
        console.log("like status change successed.")
        setLike(!like);
      }
    } catch (error) {
      console.error('getLike error:', error);
    }
  }

    const likeProcess = async (medicineId) => {
    const storedAccessToken = await AsyncStorage.getItem('access_token');
    
    try {
      const response = await fetch(`${SERVER_ROOT}/likes/${medicineId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedAccessToken}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        getLike(medicineId)
        console.log(data.msg);
      }
    } catch (error) {
      console.error('likeProcess error:', error);
    }
  }

  const renderItemCard = (item) => (
    <TouchableOpacity 
      key={item.history_id}
      style={styles.itemCard}
      onPress={() => navigation.navigate('MedicineDetail', { item_id: item.item_id })}
    >
      <Image 
          source={{ uri: item.item_image }} 
          style={styles.itemImage}
        />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      >
        <Text style={styles.itemName}>{item.item_name}</Text>
      </LinearGradient>
      <TouchableOpacity style={styles.likeButton}>
        <Icon 
          name={item.like ? "heart" : "heart-outline"} 
          size={24} 
          color="white"
          onPress={() => likeProcess(item.item_id)}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최근 검색</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.recentSearchContainer}
          >
            {recentSearches && recentSearches.length > 0 ? (recentSearches.map(item => renderItemCard(item))) : (
              <Text style={styles.versionText}>최근 검색한 약이 없습니다.</Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>관리</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="document-text-outline" size={24} />
            <Text style={styles.menuText}>메모 목록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="heart-outline" size={24} />
            <Text style={styles.menuText}
              onPress={() => navigation.navigate('LikeListScreen')}>관심 목록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="star-outline" size={24} />
            <Text style={styles.menuText}>즐겨찾기 목록</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기타</Text>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Notice')}
          >
            <Icon name="notifications-outline" size={24} />
            <Text style={styles.menuText}>공지사항</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Terms')}
          >
            <Icon name="document-outline" size={24} />
            <Text style={styles.menuText}>약관 및 정책</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="information-circle-outline" size={24} />
            <Text style={styles.menuText}>앱 정보</Text>
            <Text style={styles.versionText}>1.0</Text>
          </TouchableOpacity>
        </View>
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
  itemCard: {
    width: 160,
    height: 160,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  itemName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
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
    marginLeft: 12,
    flex: 1,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  }
});

export default MypageScreen;