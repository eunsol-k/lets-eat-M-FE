import sys
import json
from ultralytics import YOLO

# 모델 로드
model = YOLO('./best_first.pt')

# 이미지 경로를 명령행 인자로 받음
image_path = sys.argv[1]

# YOLO 예측 수행
results = model(image_path)
predictions = results[0]

# 모델 클래스 이름
class_names = model.names

# 결과를 JSON으로 변환
output = []
for box in predictions.boxes:
    class_id = int(box.cls)
    output.append({
        "x": float(box.xyxy[0]),  # 좌상단 X
        "y": float(box.xyxy[1]),  # 좌상단 Y
        "width": float(box.xyxy[2] - box.xyxy[0]),  # 박스 너비
        "height": float(box.xyxy[3] - box.xyxy[1]),  # 박스 높이
        "label": class_names[class_id],
        "confidence": float(box.conf) * 100  # 확률
    })

# JSON 형식으로 출력
print(json.dumps(output))
