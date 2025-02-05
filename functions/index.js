const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 관리자 역할을 부여하는 클라우드 함수
exports.addAdminRole = functions.https.onCall((data, context) => {
  const email = data.email;
  return admin.auth().getUserByEmail(email)
      .then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
          admin: true,
        });
      })
      .then(() => {
        return {message: `Success! ${email} has been made an admin.`};
      })
      .catch((error) => {
        return {error: error.message};
      });
});

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
