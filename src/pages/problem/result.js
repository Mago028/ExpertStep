import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  } = location.state || {};

  console.log("Result 컴포넌트에서 전달된 userId: ", userId);

  const findFailedSubjects = () => {
    return areaScores
      .map((score, index) => ({
        subject: `영역 ${index + 1}`,
        score,
      }))
      .filter((subject) => subject.score < 40);
  };

  const isPass = () => {
    const averageScore = areaScores.reduce((a, b) => a + b, 0) / areaScores.length;
    return averageScore >= 60 && findFailedSubjects().length === 0;
  };

  useEffect(() => {
    const saveIncorrectAnswers = async () => {
      if (userId) {
        for (const answer of incorrectAnswers) {
          if (answer.question && answer.correctAnswer && answer.selectedAnswer) {
            await addDoc(collection(db, "users", userId, "incorrectAnswers"), answer);
          } else {
            console.warn("Incomplete data: ", answer);
          }
        }
      } else {
        console.error("No userId provided");
      }
    };
    saveIncorrectAnswers();
  }, [incorrectAnswers, userId]);

  const handleViewIncorrectAnswers = () => {
    navigate("/incorrect-explanation", { state: { userId } });
  };

  return (
    <div className="result-page">
      <div className="result-top">
        <div className="result-header">
          <div className="result-title">
            <h2>총점</h2>
          </div>
          <div className="result-score">{totalScore.toFixed(2)}점</div>
          <div className={`result-status ${isPass() ? "pass" : "fail"}`}>
            {isPass() ? "합격!" : "불합격"}
          </div>
        </div>
        <div className="result-info">
          <p>
            총 {totalQuestions}문제 중 {totalScore.toFixed(2)}점 맞추셨습니다.
          </p>
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
                <div className="subject-name">영역 {index + 1}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="fail-subjects">
          <h3>과락 과목</h3>
          {findFailedSubjects().length > 0 ? (
            <ul>
              {findFailedSubjects().map((subject, index) => (
                <li key={index}>{subject.subject}</li>
              ))}
            </ul>
          ) : (
            <p>과락한 과목이 없습니다.</p>
          )}
        </div>
      </div>
      <div className="resultpage-btn">
        <Link to="/problem" className="result-btn-container">
          <div className="problem-btn">
            <p>
              문제 페이지로 <br />
              돌아가기
            </p>
          </div>
        </Link>
        <button onClick={handleViewIncorrectAnswers} className="result-btn-container">
          <div className="wrong-answer-btn">
            <p>오답 보기</p>
          </div>
        </button>
      </div>
    </div>
  );
}
