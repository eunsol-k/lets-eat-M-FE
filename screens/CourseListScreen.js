// SearchScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_ROOT } from '../config/config'

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // 최근 검색어 불러오기
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const savedSearches = await AsyncStorage.getItem('recentSearches');
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  // 최근 검색어 저장
  const saveRecentSearch = async (search) => {
    try {
      let searches = [...recentSearches];
      // 중복 검색어 제거
      searches = searches.filter(item => item !== search);
      // 새 검색어 추가
      searches.unshift(search);
      // 최대 10개만 저장
      searches = searches.slice(0, 10);
      
      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
      setRecentSearches(searches);
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    setIsSearching(true);
    try {
      // 검색어 저장
      await saveRecentSearch(searchText);
      
      // API 호출
      const response = await fetch(`${SERVER_ROOT}/search/${searchText}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>검색</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          placeholder="타이레놀"
          returnKeyType="search"
        />
      </View>

      <ScrollView>
        {!searchResults && (
          <>
            <View style={styles.recentSearchHeader}>
              <Text>최근 검색어</Text>
            </View>
            <ScrollView horizontal style={styles.recentSearches}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => {
                    setSearchText(search);
                    handleSearch();
                  }}
                >
                  <Text>{search}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {searchResults && !isSearching && (
          <>
            <Text style={styles.resultCount}>
              {searchText} 검색 결과 {searchResults.totalCount}건
            </Text>
            {searchResults.items.map((item, item_id) => (
              <TouchableOpacity 
                key={item_id}
                style={styles.resultItem}
                onPress={() => navigation.navigate('MedicineDetail', { medicine: item })}
              >
                <Image 
                  source={{ uri: item.item_image }} 
                  style={styles.medicineImage}
                />
                <View style={styles.medicineInfo}>
                  <View style={styles.typeContainer}>
                    <Text style={styles.typeText}>{item.etc_otc_name}</Text>
                  </View>
                  <Text style={styles.medicineName}>{item.item_name}</Text>
                  <View style={styles.companyContainer}>
                    <Text style={styles.companyText}>{item.entp_name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  recentSearchHeader: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  recentSearches: {
    padding: 8,
  },
  recentSearchItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
  },
  resultCount: {
    padding: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  resultItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  medicineImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  medicineInfo: {
    flex: 1,
  },
  typeContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
  },
  medicineName: {
    fontSize: 16,
    marginBottom: 8,
  },
  companyContainer: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  companyText: {
    color: '#666',
    fontSize: 12,
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

export default SearchScreen;