import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./Incorrect_explanation.css";

const IncorrectExplanation = () => {
  const location = useLocation();
  const { userId, testId } = location.state || {};
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [modalImage, setModalImage] = useState(null); // 모달 이미지 상태 추가

  useEffect(() => {
    const fetchIncorrectAnswers = async () => {
      if (!userId) {
        console.error("No userId provided");
        return;
      }

      try {
        const userDoc = collection(db, 'users', userId, 'incorrectAnswers');
        const querySnapshot = await getDocs(userDoc);
        const answersData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(answer => answer.testId === testId) // testId로 필터링
          .sort((a, b) => a.questionNum - b.questionNum); // 문제번호 오름차순 정렬
          
        // 중복 문제 제거
        const uniqueQuestions = answersData.reduce((acc, current) => {
          const x = acc.find(item => item.questionNum === current.questionNum);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setIncorrectAnswers(uniqueQuestions);
      } catch (error) {
        console.error("Error fetching incorrect answers: ", error);
      }
    };

    fetchIncorrectAnswers();
  }, [userId, testId]);

  const renderQuestionText = (text) => {
    if (!text) return null;
    const parts = text.split(/(https:\/\/firebasestorage\.googleapis\.com[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("https://firebasestorage.googleapis.com")) {
        return <img key={index} src={part} alt={`img-${index}`} style={{ maxWidth: "100%", maxHeight: "200px" }} onClick={() => openModal(part)} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderChoice = (choice) => {
    if (typeof choice === 'string' && (choice.startsWith('http') || choice.startsWith('https'))) {
      return <img src={choice} alt="Choice" style={{ maxWidth: "100%", maxHeight: "100px" }} onClick={() => openModal(choice)} />;
    }
    return <span>{String(choice)}</span>;
  };

  const renderExplanationText = (text) => {
    if (!text) return null;
    const parts = text.split(/(https:\/\/firebasestorage\.googleapis\.com[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("https://firebasestorage.googleapis.com")) {
        return <img key={index} src={part} alt={`explanation-img-${index}`} style={{ maxWidth: "100%", maxHeight: "200px" }} onClick={() => openModal(part)} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleDelete = async (docId) => {
    try {
      const docRef = doc(db, 'users', userId, 'incorrectAnswers', docId);
      await deleteDoc(docRef);
      setIncorrectAnswers(prevState => prevState.filter(answer => answer.id !== docId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="result-page">
      <h1>오답 해설페이지</h1>
      {incorrectAnswers.length > 0 ? (
        incorrectAnswers.map((item, index) => (
          <div key={index} className="question-box">
            <h3>{item.questionNum}번 문제</h3>
            <p>{renderQuestionText(item.question)}</p>
            {item.image && item.image.trim() !== '' && <img src={item.image} alt="" style={{ maxWidth: "100%", maxHeight: "200px" }} onClick={() => openModal(item.image)} />}
            <div className="choices">
              {item.choices.map((choice, i) => (
                <p
                  key={i}
                  className={
                    i + 1 === item.correctAnswer
                      ? "correct-answer"
                      : i + 1 === item.selectedAnswer
                      ? "selected-answer"
                      : ""
                  }
                >
                  {i + 1}. {renderChoice(choice)}
                </p>
              ))}
            </div>
            <div className="explanation">
              <h4>정답</h4>
              <p className="correct-answer">
                {item.correctAnswer}. {renderChoice(item.choices[item.correctAnswer - 1])}
              </p>
              <h4>선택한 답</h4>
              <p className="selected-answer">
                {item.selectedAnswer}. {renderChoice(item.choices[item.selectedAnswer - 1])}
              </p>
              <h4>해설</h4>
              <p>{renderExplanationText(item.explanation) || "No explanation provided"}</p>
              {item.explanationImage && item.explanationImage.trim() !== '' && <img src={item.explanationImage} alt="해설 이미지" style={{ maxWidth: "100%", maxHeight: "200px" }} onClick={() => openModal(item.explanationImage)} />}
            </div>
            <button onClick={() => handleDelete(item.id)}>삭제</button>
          </div>
        ))
      ) : (
        <p>오답이 없습니다.</p>
      )}
      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <span className="close" onClick={closeModal}>&times;</span>
          <img className="modal-content" src={modalImage} alt="Modal" />
        </div>
      )}
      <div className="buttons">
        <Link to="/" className="button">홈으로</Link>
      </div>
    </div>
  );
};

export default IncorrectExplanation;
