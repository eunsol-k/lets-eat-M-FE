from flask import Flask, request, jsonify, send_file
from PIL import Image
import torch
import io
import numpy as np
from ultralytics import YOLO
from flask_cors import CORS
import base64
import cv2

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

CORS(app)  # 모든 출처에서 요청을 허용
# YOLOv8 모델 로드 (best.pt을 사용할 경우 path='./best.pt'로 설정)
model = YOLO('./best.pt')  # YOLO 클래스를 사용하여 모델 로드

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if 'image' not in data:
        return jsonify({'error': 'No image uploaded'}), 400

    # Base64 데이터를 디코딩하여 이미지로 변환
    image_data = data['image'].split(",")[1]
    image = Image.open(io.BytesIO(base64.b64decode(image_data)))

    # 이미지를 OpenCV 형식으로 변환
    image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    # 비율을 유지한 채로 가로가 640px이 되도록 이미지 리사이즈
    h, w = image_cv.shape[:2]
    new_w = 640
    new_h = int((new_w / w) * h)
    resized_image = cv2.resize(image_cv, (new_w, new_h), interpolation=cv2.INTER_LINEAR)

    # YOLOv8 모델 예측
    results = model(resized_image)  # YOLO 모델을 사용하여 예측

    # 예측된 객체들에 대해 바운딩 박스 그리기
    results[0].plot()  # 바운딩 박스를 이미지에 그려 넣음

    # 결과 이미지를 numpy 배열로 변환
    result_image = results[0].plot()  # 결과 이미지가 numpy 배열로 반환됩니다.

    # OpenCV로 BGR에서 RGB로 변환
    result_image_rgb = cv2.cvtColor(result_image, cv2.COLOR_BGR2RGB)

    # numpy 배열을 PIL 이미지로 변환
    pil_image = Image.fromarray(result_image_rgb)

    # 이미지를 byte로 변환하여 반환
    img_byte_arr = io.BytesIO()
    pil_image.save(img_byte_arr, format='JPEG', quality=85)  # 'JPEG' 형식으로 저장
    img_byte_arr.seek(0)

    print('모델 작업 완료')

    return send_file(img_byte_arr, mimetype='image/jpeg')  # 올바른 MIME 타입 설정

@app.route('/test', methods=['POST'])
def test():
    print('hello')
    return 'new message'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
