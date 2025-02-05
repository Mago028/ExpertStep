import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdTimer } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; 
import { db } from "../../firebase/config"; 
import { fetchRandomQuestions } from "./fetchQuestions"; 
import "./RandomExamTest.css"; 

export default function RandomExamTest({ userId = "defaultUserId" }) {
  const { certId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    let examTime = 0;
    switch (certId) {
      case "eip":
        examTime = 9000; // 정보처리기사: 150분
        break;
      case "eis":
        examTime = 10800; // 산업안전기사: 180분
        break;
      case "ee":
        examTime = 9000; // 전기기사: 150분
        break;
      case "efps":
        examTime = 7200; // 소방설비기사(기계): 120분
        break;
      case "ecs":
        examTime = 10800; // 건설안전기사: 180분
        break;
      default:
        examTime = 9000;
    }
    setTimeLeft(examTime);
  }, [certId]);

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = await fetchRandomQuestions(certId);
      setQuestions(fetchedQuestions);
    };
    loadQuestions();
  }, [certId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerClick = (answer) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);

    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && currentQuestion.Answer !== answer) {
      setIncorrectAnswers((prev) => [
        ...prev,
        {
          questionNum: currentQuestion.Question_Num,
          question: currentQuestion.Question,
          correctAnswer: currentQuestion.Answer,
          selectedAnswer: answer,
          choices: [
            currentQuestion["Choice 1"],
            currentQuestion["Choice 2"],
            currentQuestion["Choice 3"],
            currentQuestion["Choice 4"],
          ],
        },
      ]);
    }

    setSolvedCount(solvedCount + 1);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsSubmitPopupOpen(true);
    }
  };

  const handleSubmit = async () => {
    try {
        const testResultsRef = collection(db, "users", userId, "testResults");
        const testResultsQuery = query(testResultsRef, where("certId", "==", certId));
        const querySnapshot = await getDocs(testResultsQuery);

        let lastSession = 0;  // 시작 회차를 0으로 초기화
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const testName = doc.data().testName;
                const sessionMatch = testName.match(/\d+회/);  // 회차 추출
                if (sessionMatch) {
                    const sessionNumber = parseInt(sessionMatch[0].replace("회", ""));
                    lastSession = Math.max(lastSession, sessionNumber);
                }
            });
            lastSession += 1;  // 마지막 회차에서 1 증가한 값으로 새로운 회차 설정
        } else {
            lastSession = 1;  // 문서가 없을 경우 1회로 시작
        }

        // 자격증 이름과 회차를 포함하여 고유한 testName 생성
        const testName = `${certId === 'eip' ? '정보처리기사' 
            : certId === 'eis' ? '산업안전기사' 
            : certId === 'ee' ? '전기기사' 
            : certId === 'efps' ? '소방설비기사(기계)' 
            : certId === 'ecs' ? '건설안전기사' 
            : certId.toUpperCase()} ${lastSession}회 모의고사`;

        const areaScores = calculateAreaScores(questions, selectedAnswers);
        const totalScore = calculateTotalScore(areaScores);

        // 전체 문제 데이터를 포함하여 저장
        const fullAnswers = questions.map((question, index) => ({
            questionNum: question.Question_Num,
            question: question.Question,
            choices: [
                question["Choice 1"],
                question["Choice 2"],
                question["Choice 3"],
                question["Choice 4"],
            ],
            correctAnswer: question.Answer,
            selectedAnswer: selectedAnswers[index] || null,
            isCorrect: selectedAnswers[index] === question.Answer,
        }));

        await addDoc(testResultsRef, {
            testName,
            totalScore,
            areaScores,
            certId,
            allAnswers: fullAnswers,  // 모든 문제 저장
            timestamp: new Date().toISOString(),
        });

        navigate("/pages/problem/result", {
            state: { areaScores, totalScore, totalQuestions: questions.length, userId },
        });
        setIsSubmitPopupOpen(false);
    } catch (error) {
        console.error("Error during submission: ", error);
    }
};




const calculateAreaScores = (questions, selectedAnswers) => {
  const areaScores = Array(5).fill(0);
  questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.Answer) {
          areaScores[question.certification_area_id - 1] += 5;
      }
  });
  return areaScores.map(score => isNaN(score) ? 0 : score); // NaN이면 0으로 변경
};

const calculateTotalScore = (areaScores) => {
  const validScores = areaScores.filter(score => !isNaN(score)); // 유효한 점수만 계산
  return validScores.reduce((a, b) => a + b, 0) / (validScores.length || 1);
};

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const renderNumberGroups = () => {
    const numberGroups = [];
    for (let i = 0; i < 100; i += 5) {
      const group = [];
      for (let j = i + 1; j <= i + 5; j++) {
        if (j <= 100) {
          group.push(
            <button
              className="popup-button"
              key={j}
              onClick={() => scrollToQuestion(j)}
            >
              {j}
            </button>
          );
        }
      }
      numberGroups.push(
        <div className="popup-group" key={i}>
          {group}
        </div>
      );
    }
    return numberGroups;
  };

  const scrollToQuestion = (questionNumber) => {
    const questionIndex = questionNumber - 1;
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setCurrentQuestionIndex(questionIndex);
      setIsPopupOpen(false);
    }
  };

  const renderContentWithImages = (text) => {
    if (typeof text === "string") {
      const parts = text.split(/\s+/g).map((part, index) => {
        if (part.startsWith("https://")) {
          return (
            <div key={index}>
              <img src={part} alt={`img-${index}`} style={{ maxWidth: "100%", maxHeight: "200px" }} />
            </div>
          );
        }
        return part + " ";
      });
      return <p>{parts}</p>;
    } else {
      return <p>{text}</p>;
    }
  };

  return (
    <div className="RandomTest-sheet">
      <div className="RandomTest-top">
        <div className="RandomTest-sheet-header">
          <h2>
            {certId === "eip"
              ? "정보처리기사 모의고사"
              : certId === "eis"
              ? "산업안전기사 모의고사"
              : certId === "ee"
              ? "전기기사 모의고사"
              : certId === "efps"
              ? "소방설비기사(기계) 모의고사"
              : certId === "ecs"
              ? "건설안전기사 모의고사"
              : certId.toUpperCase() + " 모의고사"}
          </h2>
        </div>
        <div className="RandomTest-submit">
          <button onClick={() => setIsSubmitPopupOpen(true)}>제출</button>
        </div>
      </div>

      <div className="RandomState">
        <div className="RandomCurrent-problem">
          <p>{`${solvedCount} / ${questions.length}`}</p>
        </div>
        <div className="RandomTimer">
          <p>
            <MdTimer size="15px" className="Randomicon-timer" /> {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      <div className="RandomQuestion-sheet">
        {questions.length > 0 && (
          <div id={`question-${currentQuestionIndex + 1}`}>
            <div className="RandomQuestion">
              <span>{currentQuestionIndex + 1}.</span>
              <span>{renderContentWithImages(questions[currentQuestionIndex].Question)}</span>
            </div>
            {questions[currentQuestionIndex].Image && questions[currentQuestionIndex].Image !== "Null" && (
              <img src={questions[currentQuestionIndex].Image} alt="문제 이미지" style={{ maxWidth: "100%", maxHeight: "200px" }} />
            )}
            <div className="Randomchoices">
              <p>1. {renderContentWithImages(questions[currentQuestionIndex]["Choice 1"])}</p>
              <p>2. {renderContentWithImages(questions[currentQuestionIndex]["Choice 2"])}</p>
              <p>3. {renderContentWithImages(questions[currentQuestionIndex]["Choice 3"])}</p>
              <p>4. {renderContentWithImages(questions[currentQuestionIndex]["Choice 4"])}</p>
            </div>
          </div>
        )}
      </div>

      <div className="Randomanswer-buttons-container">
        <button className="Randomanswer-buttons" onClick={() => handleAnswerClick(1)}>1</button>
        <button className="Randomanswer-buttons" onClick={() => handleAnswerClick(2)}>2</button>
        <button className="Randomanswer-buttons" onClick={() => handleAnswerClick(3)}>3</button>
        <button className="Randomanswer-buttons" onClick={() => handleAnswerClick(4)}>4</button>
      </div>

      <div>
        <button className="button-view-all" onClick={togglePopup}>
          <FaListUl size="15px" className="icon-fullview"></FaListUl>전체보기
        </button>

        {isPopupOpen && (
          <div className="popup">
            <div className="popup-title">문제 전체보기</div>
            <div className="popup-description">
              번호를 클릭하면 해당 문제로 이동합니다.
            </div>
            <span className="close-button" onClick={togglePopup}>
              <IoClose size="40px"></IoClose>
            </span>
            <div className="popup-content">{renderNumberGroups()}</div>
          </div>
        )}
      </div>

      {isSubmitPopupOpen && (
        <div className="RandomSubmit-popup">
          <div>제출 하시겠습니까?</div>
          <button onClick={() => setIsSubmitPopupOpen(false)}>취소</button>
          <button onClick={handleSubmit}>제출</button>
        </div>
      )}
    </div>
  );
}
