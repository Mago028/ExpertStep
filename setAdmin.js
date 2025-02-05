const admin = require('firebase-admin');
const { readFileSync } = require('fs');

// 환경 변수에서 서비스 계정 키 경로 가져오기
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  console.error("❌ Error: GOOGLE_APPLICATION_CREDENTIALS 환경 변수가 설정되지 않았습니다.");
  process.exit(1);
}

// 서비스 계정 키 JSON 파일 로드
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 관리자 권한 부여 함수
const grantAdminRole = async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Success! ${email} has been made an admin`);
  } catch (error) {
    console.error("❌ Error granting admin role:", error);
  }
};

// 환경 변수에서 관리자 이메일 가져오기
const email = process.env.ADMIN_EMAIL;

if (!email) {
  console.error("❌ Error: ADMIN_EMAIL 환경 변수가 설정되지 않았습니다.");
  process.exit(1);
}

// 관리자 권한 부여 실행
grantAdminRole(email);