import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import "./result.css";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    totalQuestions = 100,
    areaScores = [],
    totalScore = 0,
    incorrectAnswers = [],
    userId,
    testName = "Unknown Test"  // 기본값 설정
  } = location.state || {};

  console.log("Result 컴포넌트에서 전달된 userId: ", userId);

  const isPass = () => {
    const averageScore = areaScores.reduce((a, b) => a + b, 0) / areaScores.length;
    return averageScore >= 60 && areaScores.every(score => score >= 40);
  };

  useEffect(() => {
    const saveResultsAndIncorrectAnswers = async () => {
      if (userId) {
        try {
          if (testName) {
            // 시험 결과 데이터 저장
            await addDoc(collection(db, "users", userId, "testResults"), {
              testName, // testName만 저장하도록 수정
              totalScore,
              areaScores,
              totalQuestions,
              timestamp: new Date().toISOString(),
              incorrectAnswers,
            });
          } else {
            console.warn("No testName provided, skipping test result save.");
          }

          // 오답 데이터 각각 저장
          for (const answer of incorrectAnswers) {
            if (answer.question && answer.correctAnswer && answer.selectedAnswer) {
              await addDoc(collection(db, "users", userId, "incorrectAnswers"), {
                ...answer,
                testName,
              });
            } else {
              console.warn("Incomplete data: ", answer);
            }
          }
        } catch (error) {
          console.error("Error saving test results and incorrect answers: ", error);
        }
      } else {
        console.error("No userId provided");
      }
    };

    saveResultsAndIncorrectAnswers();
  }, [incorrectAnswers, userId, totalScore, areaScores, totalQuestions, testName]);
  
  const handleViewIncorrectAnswers = () => {
    navigate("/incorrect-explanation", { state: { userId } });
  };

  return (
    <div className="result-page">
      <div className="result-top">
        <div className="result-header">
          <div className="result-title"></div>
          <div className="result-score">{totalScore.toFixed(2)}점</div>
          <div className={`result-status ${isPass() ? "pass" : "fail"}`}>
            {isPass() ? "합격!" : "불합격"}
          </div>
        </div>
        <div className="result-info">
          <p>총 {totalQuestions}문제 중 {totalScore.toFixed(2)}점 맞추셨습니다.</p>
          <p>과락 기준: 40점 미만</p>
        </div>
      </div>
      <div className="result-container">
        <div className="result-chart">
          {areaScores.map((score, index) => (
            <div
              key={index}
              className="subject-bar"
              style={{ width: `${100 / areaScores.length}%`, position: "relative" }}
            >
              <div className="bar" style={{ height: `${score}%` }}>
                <div className="correct-count">{score}</div>
              </div>
              <div className="midline"></div>
              <div className="result-chartline">
                <div className="subject-name">영역 {index + 1}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="resultpage-btn">
          <button onClick={handleViewIncorrectAnswers} className="result-btn-container">
            <div className="wrong-answer-btn">
              <p>오답 보기</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
