import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from "../../firebase/config";
import { IoClose } from "react-icons/io5";
import { MdTimer } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Eis21_test.css";

export default function Ecs22_1_test({ userId = "defaultUserId" }) {
  const [solvedCount, setSolvedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10800); // 180분 = 10800초
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(120).fill(null)); // 기본값 120문제
  const [eipData, setEipData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvedQuestions, setSolvedQuestions] = useState(new Array(120).fill(false)); // 기본값 120문제
  const navigate = useNavigate();

  const TOTAL_SUBJECTS = 6; // 총 과목 수
  const TEST_NAME = "산업기사 22년 1회차"; // 시험 이름

  const formatSolvedCount = () => `${solvedCount} / ${eipData.length}`; // 총 문제 수

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'eis21_1'), orderBy('Question_Num', 'asc'));
      const querySnapshot = await getDocs(q);
      const questionsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        if (data.Image && data.Image !== "Null") {
          const imageRef = ref(storage, data.Image);
          data.Image = await getDownloadURL(imageRef);
        }
        return { id: doc.id, ...data };
      }));
      setEipData(questionsData);
    } catch (error) {
      console.error("Error fetching questions: ", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    const timer = setInterval(() => setTimeLeft(prevTime => prevTime - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleAnswerClick = (answer) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);

    if (!solvedQuestions[currentQuestionIndex]) {
      const updatedSolvedQuestions = [...solvedQuestions];
      updatedSolvedQuestions[currentQuestionIndex] = true;
      setSolvedQuestions(updatedSolvedQuestions);
      setSolvedCount(prevCount => prevCount + 1);
    }

    if (currentQuestionIndex === eipData.length - 1) {
      setIsSubmitPopupOpen(true);
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const fetchAnswers = async () => {
    try {
      const questionsQuery = query(collection(db, 'eis21_1'), orderBy('Question_Num', 'asc'));
      const questionsSnapshot = await getDocs(questionsQuery);
  
      const explanationsQuery = query(collection(db, 'eis21_1_explain'));
      const explanationsSnapshot = await getDocs(explanationsQuery);
      const explanationsMap = explanationsSnapshot.docs.reduce((acc, doc) => {
        acc[doc.data().Question_Num] = {
          explain: doc.data().explain,
          image: doc.data().image
        };
        return acc;
      }, {});
  
      return questionsSnapshot.docs.map(doc => {
        const data = doc.data();
        const explanationData = explanationsMap[data.Question_Num] || {};
        return {
          answer: data.Answer,
          areaId: data.certification_area_id,
          Question: data.Question,
          "Choice 1": data["Choice 1"],
          "Choice 2": data["Choice 2"],
          "Choice 3": data["Choice 3"],
          "Choice 4": data["Choice 4"],
          Explanation: explanationData.explain || "No explanation provided",
          ExplanationImage: explanationData.image || null,
          Image: data.Image || null
        };
      });
    } catch (error) {
      console.error("Error fetching answers: ", error);
      return [];
    }
  };

  const handleSubmit = async () => {
    try {
      const answersData = await fetchAnswers();
      const areaScores = Array(TOTAL_SUBJECTS).fill(0);
      const incorrectAnswers = [];
  
      selectedAnswers.forEach((answer, index) => {
        const { answer: correctAnswer, areaId, Question, Explanation, Image, ExplanationImage } = answersData[index];
        if (answer !== correctAnswer) {
          incorrectAnswers.push({
            questionNum: index + 1,
            question: Question,
            correctAnswer,
            selectedAnswer: answer,
            choices: [
              answersData[index]["Choice 1"],
              answersData[index]["Choice 2"],
              answersData[index]["Choice 3"],
              answersData[index]["Choice 4"]
            ],
            explanation: Explanation || "No explanation provided",
            userId: userId,
            image: Image || null,
            explanationImage: ExplanationImage || null
          });
        } else {
          areaScores[areaId - 1] += 5;
        }
      });
  
      const totalScore = areaScores.reduce((a, b) => a + b, 0) / TOTAL_SUBJECTS;
  
      // 오답 데이터를 Firestore에 저장
      incorrectAnswers.forEach(async (answer) => {
        const docRef = collection(db, "users", userId, "incorrectAnswers");
        await addDoc(docRef, answer);
      });
  
      // 시험 결과를 Firestore에 저장
      const resultData = {
        testName: TEST_NAME,
        userId: userId,
        totalScore: totalScore,
        areaScores: areaScores,
        totalQuestions: eipData.length,
        timestamp: new Date().toISOString()
      };
  
      await addDoc(collection(db, "users", userId, "testResults"), resultData);
  
      navigate("/pages/problem/result", { state: { areaScores, totalScore, totalQuestions: eipData.length, userId } });
      setIsSubmitPopupOpen(false);
    } catch (error) {
      console.error("Error during submission: ", error);
    }
  };

  const currentQuestion = eipData[currentQuestionIndex];

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const toggleSubmitPopup = () => setIsSubmitPopupOpen(!isSubmitPopupOpen);

  const scrollToQuestion = (questionNumber) => {
    const questionIndex = eipData.findIndex(q => q.Question_Num === questionNumber);
    if (questionIndex !== -1) {
      setCurrentQuestionIndex(questionIndex);
      setIsPopupOpen(false);
    }
  };

  const renderNumberGroups = () => {
    const numberGroups = [];
    for (let i = 0; i < eipData.length; i += 5) {
      const group = [];
      for (let j = i + 1; j <= i + 5 && j <= eipData.length; j++) {
        group.push(
          <button className="popup-button" key={j} onClick={() => scrollToQuestion(j)}>
            {j}
          </button>
        );
      }
      numberGroups.push(<div className="popup-group" key={i}>{group}</div>);
    }
    return numberGroups;
  };

  const renderChoice = (choice) => {
    if (typeof choice === 'string' && (choice.startsWith('http') || choice.startsWith('https'))) {
      return <img src={choice} alt="Choice" style={{ maxWidth: "100%", maxHeight: "100px" }} />;
    }
    return <span>{String(choice)}</span>;
  };

  const renderQuestionText = (text) => {
    const parts = text.split(/(https:\/\/firebasestorage\.googleapis\.com[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("https://firebasestorage.googleapis.com")) {
        return <img key={index} src={part} alt={`img-${index}`} style={{ maxWidth: "100%", maxHeight: "200px" }} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="Test-sheet">
      <div className="Test-top">
        <div className="Test-sheet-header">
          <h2>{TEST_NAME}</h2>
        </div>
        <div className="Test-submit">
          <button onClick={toggleSubmitPopup}>제출</button>
        </div>
      </div>
      <div className="State">
        <div className="Current-problem">
          <p>{formatSolvedCount()}</p>
        </div>
        <div className="Timer">
          <p>
            <MdTimer size="15px" className="icon-timer"></MdTimer>:{" "}
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      <div className="Question-sheet">
        {loading && <p>Loading...</p>}
        {error && <p>Error loading data: {error}</p>}
        {!loading && !error && currentQuestion && (
          <div id={`question-${currentQuestion.Question_Num}`}>
            <h2 className="Question">
              {currentQuestion.Question_Num}. {renderQuestionText(currentQuestion.Question)}
            </h2>
            {currentQuestion.Image && currentQuestion.Image !== "Null" && (
              <img
                src={currentQuestion.Image}
                alt="문제 이미지"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            )}
            <div className="choices">
              <p>1. {renderChoice(currentQuestion["Choice 1"])}</p>
              <p>2. {renderChoice(currentQuestion["Choice 2"])}</p>
              <p>3. {renderChoice(currentQuestion["Choice 3"])}</p>
              <p>4. {renderChoice(currentQuestion["Choice 4"])}</p>
            </div>
            <div className="answer-buttons-container">
              <button className="answer-buttons" onClick={() => handleAnswerClick(1)}>1</button>
              <button className="answer-buttons" onClick={() => handleAnswerClick(2)}>2</button>
              <button className="answer-buttons" onClick={() => handleAnswerClick(3)}>3</button>
              <button className="answer-buttons" onClick={() => handleAnswerClick(4)}>4</button>
            </div>
          </div>
        )}
      </div>

      <div>
        <button className="button-view-all" onClick={togglePopup}>
          <FaListUl size="15px" className="icon-fullview"></FaListUl>전체보기
        </button>
        {isPopupOpen && (
          <div className="popup">
            <div className="popup-title">문제 전체보기</div>
            <div className="popup-description">번호를 클릭하면 해당 문제로 이동합니다.</div>
            <span className="close-button" onClick={togglePopup}>
              <IoClose size="40px"></IoClose>
            </span>
            <div className="popup-content">{renderNumberGroups()}</div>
          </div>
        )}
      </div>
      <div>
        {isSubmitPopupOpen && (
          <div className="Submit-popup">
            <div className="popup-submit-title">제출 하시겠습니까?</div>
            <div className="popup-submit-description">제출 후에는 수정이 불가합니다.</div>
            <div className="popup-submit-info">
              <span>풀지 않은 문제:</span>
              <span style={{ color: "#F62215" }}>{eipData.length - solvedCount}</span>
            </div>
            <div className="popup-submit-buttons">
              <button className="cancel-button" onClick={toggleSubmitPopup}>취소</button>
              <button className="submit-button" onClick={handleSubmit}>제출</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
