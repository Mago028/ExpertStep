import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/config";  // 기존 Firebase 설정 파일에서 functions 가져오기

const addAdminRole = httpsCallable(functions, "addAdminRole");

const makeAdmin = (email) => {
  addAdminRole({ email: email })
    .then((result) => {
      console.log(result.data.message);
    })
    .catch((error) => {
      console.error(error);
    });
};

export { makeAdmin };
