import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Link, useLocation } from "react-router-dom";
import "./Grades.css";

const Grades = () => {
  const location = useLocation();
  const { userId = "defaultUserId" } = location.state || {}; // 기본값 설정
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!userId) {
          console.error("No userId provided");
          return;
        }

        const userResultsCollection = collection(db, "users", userId, "testResults");
        const querySnapshot = await getDocs(userResultsCollection);
        const resultsData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })); // doc ID를 함께 저장

        // 시간순으로 정렬된 전체 결과를 저장
        const sortedResults = resultsData.sort((a, b) => b.timestamp - a.timestamp);
        setResults(sortedResults);
      } catch (error) {
        console.error("Error fetching results: ", error);
      }
    };

    fetchResults();
  }, [userId]);

  const deleteResult = async (resultId) => {
    try {
      // Firebase에서 해당 성적 삭제
      await deleteDoc(doc(db, "users", userId, "testResults", resultId));
      // 삭제 후 화면에서 결과 제거
      setResults(results.filter((result) => result.id !== resultId));
    } catch (error) {
      console.error("Error deleting result: ", error);
    }
  };

  const isPass = (areaScores) => {
    const averageScore = areaScores.reduce((a, b) => a + b, 0) / areaScores.length;
    return averageScore >= 60 && areaScores.every((score) => score >= 40);
  };

  return (
    <div className="grades-page">
      <h2>성적 결과</h2>
      {results.length > 0 ? (
        results.map((result, index) => (
          <div key={index} className="result-container">
            <div className="result-header">
              <h3>{result.testName}</h3>
            </div>
            <div className="result-score">{result.totalScore.toFixed(2)}점</div>
            <div
              className={`result-status ${
                isPass(result.areaScores) ? "pass" : "fail"
              }`}
            >
              {isPass(result.areaScores) ? "합격!" : "불합격"}
            </div>
            <div className="result-info">
              <p>
                총 {result.totalQuestions}문제 중 {result.totalScore.toFixed(2)}점
                맞추셨습니다.
              </p>
              <p>과락 기준: 40점 미만</p>
            </div>
            <div className="result-chart">
              {result.areaScores.map((score, areaIndex) => (
                <div
                  key={areaIndex}
                  className="subject-bar"
                  style={{
                    width: `${100 / result.areaScores.length}%`,
                    position: "relative",
                  }}
                >
                  <div
                    className="bar"
                    style={{
                      height: `${score}%`,
                    }}
                  >
                    <div className="correct-count">{score}</div>
                  </div>
                  <div className="midline"></div>
                  <div className="result-chartline">
                    <div className="subject-name">영역 {areaIndex + 1}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="delete-button"
              onClick={() => deleteResult(result.id)}
            >
              삭제
            </button>
          </div>
        ))
      ) : (
        <p>시험 결과가 없습니다.</p>
      )}
      <div className="buttons">
        <Link to="/" className="button">
          홈으로
        </Link>
      </div>
    </div>
  );
};

export default Grades;
