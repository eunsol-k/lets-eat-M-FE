// InterestListScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_ROOT } from '../config/config'

const LikeListScreen = ({ navigation }) => {
  const [interestItems, setInterestItems] = useState([]);

  useEffect(() => {
    fetchInterestItems();
  }, []);

  const fetchInterestItems = async () => {
    try {
      const storedAccessToken = await AsyncStorage.getItem('access_token');
      const response = await fetch(`${SERVER_ROOT}/likes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedAccessToken}`
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        setInterestItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching interest items:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => navigation.navigate('MedicineDetail', { item_id: item.item_id })}
    >
      <Image 
        source={{ uri: item.item_image }} 
        style={styles.itemImage}
      />
      <Text style={styles.itemName}>{item.item_name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>관심 목록</Text>
      </View>

      <FlatList
        data={interestItems}
        renderItem={renderItem}
        keyExtractor={item => item.item_id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />
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
  gridContainer: {
    padding: 8,
  },
  itemCard: {
    flex: 1,
    margin: 8,
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
  itemImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  itemName: {
    padding: 12,
    fontSize: 14,
    fontWeight: '500',
  }
});

export default LikeListScreen;