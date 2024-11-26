import React, { useState, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);  // 촬영된 사진을 저장할 상태
  const [predictedPhoto, setPredictedPhoto] = useState<string | null>(null);  // 예측된 이미지를 저장할 상태
  const [photoData, setPhotoData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const cameraRef = useRef<any>(null);  // 카메라 참조

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
      const Data = await cameraRef.current.takePictureAsync();
      setPhoto(Data.uri);  // 촬영된 사진의 URI를 상태에 저장
      setPhotoData(Data);
    }
  }

  async function Detect() {
    if (photoData) {
      // 서버로 이미지 전송 후 예측된 Blob 데이터 받기
      const blob = await sendToServer(photoData.uri);
      const base64Image = await blobToBase64(blob);
      setPredictedPhoto(base64Image);
    }
  }

  // Blob 데이터를 Base64로 변환하는 함수
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
    });
  }

// 서버로 이미지 전송 후 예측된 이미지 받기
async function sendToServer(uri: string): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      setLoading(true);
      console.log('여기서 uri란: ', uri);

      // 촬영된 이미지 URI를 Blob으로 변환
      const response = await fetch(uri);
      const blob = await response.blob();

      // Blob 데이터를 Base64로 변환
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = async function () {
        const base64data = reader.result as string;

        // 서버로 요청 보내기
        const serverResponse = await fetch('http://192.168.0.20:5001/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ image: base64data }),
        });

        console.log('Server response:', serverResponse);

        if (!serverResponse.ok) {
          throw new Error(`HTTP error! status: ${serverResponse.status}`);
        }

        const resultBlob = await serverResponse.blob();
        console.log('resultBlob란?: ', resultBlob);

        setLoading(false);
        resolve(resultBlob);
      };

      reader.onerror = reject;
    } catch (error) {
      console.error('Error sending image to server:', error);
      setLoading(false);
      reject(error);
    }
  });
}


  // 다시 촬영하기 함수
  function retakePicture() {
    setPhoto(null);  // 촬영된 사진 초기화
    setPredictedPhoto(null);  // 예측된 이미지 초기화
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Detecting pills...</Text>
        </View>
      ) : predictedPhoto ? (
        // 예측된 이미지가 있으면 이를 화면에 표시
        <View style={styles.photoContainer}>
          <Image source={{ uri: predictedPhoto }} style={styles.photo} />
          <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
            <Text style={styles.text}>Retake Picture</Text>
          </TouchableOpacity>
        </View>
      ) : photo ? (
        // 사진이 촬영되었으면 카메라를 숨기고 사진을 크게 표시
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
              <Text style={styles.text}>Retake Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detectButton} onPress={Detect}>
              <Text style={styles.text}>Detect</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // 사진이 촬영되지 않으면 카메라 화면을 렌더링
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}  // 카메라 참조 연결
        >
        {/* 중앙 정사각형 */}
          <View style={styles.overlay}>
            <View style={styles.square} />
            <Text style={styles.centerText}>중앙으로 물체가 들어오게 해주세요</Text>
          </View>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  retakeButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  detectButton: {
    marginTop: 20,
    backgroundColor: 'rgba(0, 255, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',  // 투명도 70%
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  square: {
    width: 250, // 정사각형의 너비와 높이
    height: 250,
    borderColor: 'white',
    borderWidth: 2,
    borderStyle: 'solid',
  },
  
  centerText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },  
});
