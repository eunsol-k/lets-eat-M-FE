import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('위치 권한이 필요합니다.');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setLoading(false);

      // 구글 장소 API로 약국 검색 (근처 약국 정보 가져오기)
      fetchNearbyPharmacies(userLocation.coords);
    })();
  }, []);

  const fetchNearbyPharmacies = async ({ latitude, longitude }) => {
    const API_KEY = 'AIzaSyAzn9H8nZCaLrAM14HzK0Boe3sf7kTdy8g'; // 구글 API 키 입력
    const radius = 2000; // 검색 반경 (2km)
    const type = 'pharmacy';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results) {
      setPharmacies(data.results);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>현재 위치를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {/* 현재 위치 마커 */}
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title="현재 위치"
        pinColor="blue" // 현재 위치 마커 색상 설정
      >
        {/* 또는 커스텀 이미지로 현재 위치 표시 */}
        {/* <Image
          source={require('./assets/current-location-icon.png')}
          style={{ width: 40, height: 40 }}
        /> */}
      </Marker>

      {/* 약국 마커들 */}
      {pharmacies.map((pharmacy, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: pharmacy.geometry.location.lat,
            longitude: pharmacy.geometry.location.lng,
          }}
          title={pharmacy.name}
          description={pharmacy.vicinity}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
