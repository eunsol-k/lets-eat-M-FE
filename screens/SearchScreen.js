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
  Image,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_ROOT } from '../config/config'

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

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

  const saveRecentSearch = async (search) => {
    try {
      let searches = [...recentSearches];
      searches = searches.filter(item => item !== search);
      searches.unshift(search);
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
      await saveRecentSearch(searchText);
      const response = await fetch(`${SERVER_ROOT}/search/${searchText}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecentSearchClick = (searchTerm) => {
    setSearchText(searchTerm);
    // 검색어를 설정한 후 바로 검색 실행
    handleSearch();
  };

  const renderMedicineItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.medicineCard}
      onPress={() => navigation.navigate('MedicineDetail', { 
        item_id: item.item_id
      })}
    >
      <Image 
        source={{ uri: item.item_image }} 
        style={styles.medicineImage}
      />
      <View style={styles.medicineInfo}>
        <View style={styles.titleContainer}>
          <View style={styles.typeBox}>
            <Text style={styles.typeText}>{item.etc_otc_name}</Text>
          </View>
          <Text style={styles.medicineName} numberOfLines={1}>{item.item_name}</Text>
        </View>
        <View style={styles.companyContainer}>
          {item.class_name_list.map((class_name) => (
            class_name.split(',').map((item, index) => (
              <View key={index} style={styles.companyBox}>
                <Text style={styles.companyText}>{item.trim()}</Text>
              </View>
            ))
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

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

      <View style={styles.recentSearchContainer}>
        <Text style={styles.recentSearchTitle}>최근 검색어</Text>
        <ScrollView 
          horizontal 
          style={styles.recentSearchScroll}
          showsHorizontalScrollIndicator={false}
        >
          {recentSearches.map((search, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.recentSearchItem}
              onPress={() => handleRecentSearchClick(search)}
            >
              <Text>{search}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {searchResults && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultCount}>
            {searchText} 검색 결과 {searchResults.totalCount}건
          </Text>
          <FlatList
            data={searchResults.items}
            renderItem={renderMedicineItem}
            keyExtractor={(item) => item.code}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginBlockStart: 30,
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
  recentSearchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentSearchTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  recentSearchScroll: {
    flexGrow: 0,
  },
  recentSearchItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  resultsContainer: {
    flex: 1,
  },
  resultCount: {
    padding: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  medicineCard: {
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBox: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
  },
  medicineName: {
    fontSize: 16,
    flex: 1,
  },
  companyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  companyBox: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
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