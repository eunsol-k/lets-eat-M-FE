// MedicineDetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_ROOT } from '../config/config'

const MedicineDetail = ({ navigation }) => {
  const route = useRoute();
  const medicineId = route.params?.item_id;

  const [basicInfo, setBasicInfo] = useState(null);
  const [cautionInfo, setCautionInfo] = useState(null);
  const [memoInfo, setMemoInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (medicineId) {
      fetchAllData();
      addViewHistory();
    }
  }, [medicineId]);

  const fetchAllData = async () => {
    try {
      // 병렬로 모든 API 호출
      const [basicResponse, cautionResponse, memoResponse] = await Promise.all([
        fetch(`${SERVER_ROOT}/medicines/${medicineId}`),
        fetch(`${SERVER_ROOT}/medicines/${medicineId}/warning`),
        // fetch(`${SERVER_ROOT}/medicines/195900043/memo`)
      ]);

      const basicData = await basicResponse.json();
      const cautionData = await cautionResponse.json();
      // const memoData = await memoResponse.json();

      setBasicInfo(basicData);
      setCautionInfo(cautionData);
      // setMemoInfo(memoData);
    } catch (error) {
      console.error('Data fetching error:', error);
    }
  };

  const addViewHistory = async () => {
    const storedAccessToken = await AsyncStorage.getItem('access_token');
    
    try {
      const response = await fetch(`${SERVER_ROOT}/history/${medicineId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedAccessToken}`
        }
      });

      if (response.status === 201) {
        console.log('History add successed.');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'basic':
        return (
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>품목기준코드</Text>
              <Text style={styles.value}>{basicInfo?.item_id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>판매사</Text>
              <Text style={styles.value}>{basicInfo?.entp_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>효능효과</Text>
              <Text style={styles.value}>{cautionInfo?.efcyQesitm}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>용법용량</Text>
              <Text style={styles.value}>{cautionInfo?.useMethodQesitm}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>분류번호</Text>
              <Text style={styles.value}>{basicInfo?.class_id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>분류명</Text>
              <Text style={styles.value}>{basicInfo?.class_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>일반/전문</Text>
              <Text style={styles.value}>{basicInfo?.etc_otc_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>보관방법</Text>
              <Text style={styles.value}>{cautionInfo?.depositMethodQesitm}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>보험코드</Text>
              <Text style={styles.value}>{cautionInfo?.bizrno}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>정</Text>
              <Text style={styles.value}>{basicInfo?.form_code_name}</Text>
            </View>
          </View>
        );
      case 'caution':
        return (
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>주의사항</Text>
              <Text style={styles.value}>{cautionInfo?.atpnQesitm}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>상호작용</Text>
              <Text style={styles.value}>{cautionInfo?.intrcQesitm}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>부작용</Text>
              <Text style={styles.value}>{cautionInfo?.seQesitm}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>보관법</Text>
              <Text style={styles.value}>{cautionInfo?.depositMethodQesitm}</Text>
            </View>
          </View>
        );
      // case 'momo':
        return (
          <View style={styles.infoContainer}>
            {memoInfo.map((warning, index) => (
              <Text key={index} style={styles.cautionText}>{warning}</Text>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{basicInfo?.item_name}</Text>
        <TouchableOpacity>
          <Icon name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: basicInfo?.item_image }}
          style={styles.medicineImage}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'basic' && styles.activeTab]}
          onPress={() => setActiveTab('basic')}>
          <Text style={styles.tabText}>기본 정보</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'caution' && styles.activeTab]}
          onPress={() => setActiveTab('caution')}>
          <Text style={styles.tabText}>주의사항</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderContent()}
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
    marginBlockStart: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 16,
  },
  imageContainer: {
    backgroundColor: '#f0f6ff',
    width: '100%',
    height: 170, // 원하는 높이 설정
    justifyContent: 'center',
    alignItems: 'center'
  },
  medicineImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  infoContainer: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    width: 100,
    color: '#666',
  },
  value: {
    flex: 1,
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
  cautionText: {
    marginBottom: 12,
    lineHeight: 20,
  },
  reviewContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  }
});

export default MedicineDetail;