import React, { useState, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);  // 촬영된 사진을 저장할 상태

  const cameraRef = useRef(null);  // 카메라 참조

  // 권한 상태가 로딩 중이면 화면에 아무것도 표시하지 않음
  if (permission === null) {
    return <View />;
  }

  // 권한이 허용되지 않으면 권한을 요청하는 화면 표시
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // 카메라 방향 전환 함수
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // 사진 촬영 함수
  async function takePicture() {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);  // 촬영된 사진의 URI를 상태에 저장
    }
  }

  // 다시 촬영하기 함수
  function retakePicture() {
    setPhoto(null);  // 촬영된 사진 초기화
  }

  return (
    <View style={styles.container}>
      {photo ? (
        // 사진이 촬영되었으면 카메라를 숨기고 사진을 크게 표시
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
          <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
            <Text style={styles.text}>Retake Picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 사진이 촬영되지 않으면 카메라 화면을 렌더링
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}  // 카메라 참조 연결
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',  // 사진을 화면 전체로 확대
    height: '80%',  // 화면의 80% 크기로 설정
    resizeMode: 'contain',  // 사진 비율을 유지하며 크기 조정
    borderRadius: 10,
  },
  retakeButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
});
