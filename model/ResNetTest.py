import torch
import torch.nn as nn
import numpy as np
import random
from PIL import Image
import torchvision.transforms as transforms
import cv2
import torchvision.models as models
from PIL import Image
import matplotlib.pyplot as plt
import torchvision.transforms as transforms

class ResizeAndPad(object):
    def __init__(self, desired_size):
        self.desired_size = desired_size

    def __call__(self, image):
        desired_width, desired_height = self.desired_size
        original_width, original_height = image.size

        # 비율 유지하여 리사이즈
        ratio = min(desired_width / original_width, desired_height / original_height)
        new_width = int(original_width * ratio)
        new_height = int(original_height * ratio)
        resized_image = image.resize((new_width, new_height), Image.LANCZOS)

        # 새 이미지 생성 및 패딩
        new_image = Image.new("RGB", (desired_width, desired_height))
        pad_left = (desired_width - new_width) // 2
        pad_top = (desired_height - new_height) // 2
        new_image.paste(resized_image, (pad_left, pad_top))

        return new_image

class PillModel(nn.Module):
    # bulid cnn model
    def __init__(self):
        super(PillModel, self).__init__()

        # 클래스 개수 정의
        self.m_ClassNum = 81
        # ResNet 모델 초기화
        self.resnet = models.resnet18(pretrained=True)

        # 마지막 fully connected layer의 출력 크기를 클래스 수에 맞게 조정
        num_ftrs = self.resnet.fc.in_features
        self.resnet.fc = nn.Linear(num_ftrs, self.m_ClassNum)


    def forward(self, x):
        # ResNet 모델의 forward pass 수행
        x = self.resnet(x)
        return x

# 이미지 전처리 함수
def preprocess_image(image_path):
    transform = transforms.Compose([ResizeAndPad((500, 500)),
                                           transforms.ToTensor()])
    image = Image.open(image_path).convert("RGB")  # 이미지를 RGB 형식으로 열기
    image = transform(image).unsqueeze(0)         # 배치 차원 추가
    return image

# 모델 로드
model = PillModel()
checkpoint = torch.load("./ResNet_model_PyTorchModel.pt", map_location=torch.device('cpu'))  # 모델 파일 로드
model.load_state_dict(checkpoint['model_state_dict'])  # 모델의 상태 사전 로드
model.eval()

# 클래스 이름 목록
class_names = checkpoint['label_name']

# 이미지 분류 함수
def classify_image(image, model, class_names):

    # 모델 추론
    with torch.no_grad():
        output = model(image)

    # 확률로 변환
    probabilities = torch.softmax(output, dim=1)

    # 클래스 이름과 해당 확률을 함께 저장
    class_probabilities = [(class_name, probabilities[0][i].item()) for i, class_name in enumerate(class_names)]

    # 확률을 기준으로 내림차순 정렬
    sorted_class_probabilities = sorted(class_probabilities, key=lambda x: x[1], reverse=True)

    # 정렬된 클래스 이름과 확률 출력
    for class_name, probability in sorted_class_probabilities:
        print(f"{class_name}: {probability:.20f}")

    # 클래스 예측
    _, predicted_class = torch.max(probabilities, 1)

    # 클래스 이름 가져오기
    class_name = class_names[predicted_class.item()]

    return class_name, probabilities[0][predicted_class].item()


# 이미지 분류
image_path = "./201907803_001_7.png"  # 이미지 파일 경로

# 이미지 전처리
image = preprocess_image(image_path)

predicted_class, confidence = classify_image(image, model, class_names)

# 결과 출력
print("예측된 클래스:", predicted_class)
print("확신도:", confidence)