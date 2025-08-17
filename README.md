# Virtual Keyboard Detector

## 설치 및 실행 방법

1. 저장소 클론

```bash
git clone <이 레포 주소>
cd virtual-keyboard-detecter
```

2. 의존성 설치

```bash
npm install
```

3. 개발 서버 실행 (자동으로 빌드 포함)

```bash
npm run dev
```

4. 모바일에서 테스트
- 개발 서버 실행 후 터미널에 표시되는 Local 또는 Network 주소를 확인하세요.
- 모바일 기기가 같은 Wi-Fi에 연결되어 있어야 합니다.
- 모바일 브라우저에서 아래와 같이 접속합니다.
  - 예시: `http://192.168.0.10:8000/sample/after.html`

## 개발 시 주의사항

- `npm run dev`는 자동으로 TypeScript를 컴파일한 후 서버를 실행합니다.
- TypeScript 파일을 수정한 후에는 `npm run build`를 다시 실행하거나, `npm run dev`를 재시작해야 합니다.
- 개발 중에는 `npm run build:watch`를 별도 터미널에서 실행하여 파일 변경 시 자동으로 컴파일할 수 있습니다.

## 기타
- 서버 종료는 터미널에서 `Ctrl + C`를 누르세요.
- 포트(8000)는 필요에 따라 변경 가능합니다.
