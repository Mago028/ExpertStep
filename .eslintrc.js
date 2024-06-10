module.exports = {
    extends: [
      "react-app",
      "react-app/jest"
    ],
    rules: {
      'react/jsx-pascal-case': 'off',  // JSX 컴포넌트 이름 규칙 무시
      'no-unused-vars': 'warn'         // 사용되지 않는 변수 경고로 설정
    }
  };
  