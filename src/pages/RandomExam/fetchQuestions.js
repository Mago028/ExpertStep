import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

// 자격증별로 랜덤 문제 가져오기 함수
export async function fetchRandomQuestions(certId) {
  try {
    let allQuestions = [];
    const questionLimits = {
      eip: { collectionNames: ["eip22_1", "eip22_2"], areas: 5, totalQuestions: 100 }, // 정보처리기사
      eis: { collectionNames: ["eis21_1", "eis21_2", "eis21_3"], areas: 5, totalQuestions: 100 }, // 산업안전기사
      ee: { collectionNames: ["ee22_1", "ee22_2"], areas: 5, totalQuestions: 100 },  // 전기기사
      efps: { collectionNames: ["efps21_1", "efps21_2", "efps21_4"], areas: 4, totalQuestions: 80 }, // 소방설비기사(기계)
      ecs: { collectionNames: ["ecs22_1", "ecs22_2"], areas: 6, totalQuestions: 120 }  // 건설안전기사
    };

    const certInfo = questionLimits[certId] || { collectionNames: [], areas: 5, totalQuestions: 100 }; // 자격증별 회차 및 영역 수
    const questionsPerArea = 20; // 각 영역당 문제 수는 20으로 고정

    // 각 회차의 문제를 순서대로 가져오기 (랜덤 회차는 고려하지 않고 모든 회차에서 문제를 가져오는 방식)
    for (let collectionName of certInfo.collectionNames) {
      for (let areaId = 1; areaId <= certInfo.areas; areaId++) {
        const q = query(
          collection(db, collectionName),  // 각 자격증의 회차 컬렉션에서 문제를 가져옴
          where("certification_area_id", "==", areaId)
        );
        const querySnapshot = await getDocs(q);

        // 문제를 랜덤하게 섞고, 각 영역에서 20문제만 선택
        let areaQuestions = querySnapshot.docs.map((doc) => doc.data());
        areaQuestions = shuffleArray(areaQuestions).slice(0, questionsPerArea);

        // 선택된 문제를 allQuestions에 추가
        allQuestions.push(...areaQuestions);
      }
    }

    // 영역별로 순차적으로 문제를 가져오기 때문에, 1영역부터 마지막 영역까지 순서대로 문제를 배치
    return allQuestions.slice(0, certInfo.totalQuestions); // 각 자격증별 최대 문제 수만큼 반환
  } catch (error) {
    console.error("Error fetching questions: ", error);
    return [];
  }
}

// 배열을 랜덤하게 섞는 함수
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
