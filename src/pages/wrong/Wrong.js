import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Latex from 'react-latex';
import 'katex/dist/katex.min.css';
import "./Wrong.css";

const Wrong = () => {
  const location = useLocation();
  const { userId } = location.state || { userId: "defaultUserId" };
  const [groupedIncorrectAnswers, setGroupedIncorrectAnswers] = useState({});
  const [expandedTests, setExpandedTests] = useState({});
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.error("No userId provided");
      return;
    }
  
    const fetchIncorrectAnswers = async () => {
      try {
        const testResultsCollection = collection(db, 'users', userId, 'testResults');
        const testResultsSnapshot = await getDocs(testResultsCollection);
  
        let tempGroupedData = {};
  
        testResultsSnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          
          // 'Unknown Test'를 발견하면 DB에서 삭제
          if (data.testName === "Unknown Test") {
            console.warn(`Deleting Unknown Test: ${docSnapshot.id}`);
            deleteDoc(doc(db, 'users', userId, 'testResults', docSnapshot.id));
            return;
          }

          const testName = data.testName;

          // '모의고사'가 포함된 시험 이름은 필터링하여 제외
          if (testName.includes("모의고사")) return;

          if (!tempGroupedData[testName]) {
            tempGroupedData[testName] = [];
          }

          if (testName.includes("회차")) {
            // 회차고사는 전체 오답 데이터 그대로 추가
            tempGroupedData[testName] = tempGroupedData[testName].concat(data.incorrectAnswers || []);
          } else if (data.incorrectAnswers) {
            // 모의고사는 isCorrect 필드로 필터링하여 오답만 추가
            const incorrectAnswers = data.incorrectAnswers.filter(answer => answer.isCorrect === false);
            tempGroupedData[testName] = tempGroupedData[testName].concat(incorrectAnswers);
          }
        });

        // 각 시험의 오답 문제를 작은 번호 순서대로 정렬
        const sortedGroupedData = Object.fromEntries(
          Object.entries(tempGroupedData).map(([testName, answers]) => [
            testName,
            answers.sort((a, b) => a.questionNum - b.questionNum),
          ])
        );

        setGroupedIncorrectAnswers(sortedGroupedData);
        console.log("Grouped Data after fetch:", sortedGroupedData);
      } catch (error) {
        console.error("Error fetching incorrect answers: ", error);
      }
    };
    
    fetchIncorrectAnswers();
  }, [userId]);

  const toggleTestExpansion = (testName) => {
    setExpandedTests((prev) => ({
      ...prev,
      [testName]: !prev[testName],
    }));
  };

  const renderQuestionText = (text) => {
    if (!text) return null;
    const parts = text.split(/(https:\/\/firebasestorage\.googleapis\.com[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("https://firebasestorage.googleapis.com")) {
        return <img key={index} src={part} alt={`img-${index}`} style={{ maxWidth: "100%", maxHeight: "200px" }} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderChoice = (choice) => {
    if (typeof choice === 'string' && (choice.startsWith('http') || choice.startsWith('https'))) {
      return <img src={choice} alt="Choice" style={{ maxWidth: "100%", maxHeight: "100px" }} />;
    }
    return <span>{String(choice)}</span>;
  };

  const renderExplanation = (explanation) => {
    if (!explanation) return <p>해설이 없습니다.</p>;
    const parts = explanation.split(/(https:\/\/firebasestorage\.googleapis\.com[^\s]+)/g);
    return (
      <div>
        {parts.map((part, index) => {
          if (part.startsWith("https://firebasestorage.googleapis.com")) {
            return <img key={index} src={part} alt={`explain-img-${index}`} style={{ maxWidth: "100%", maxHeight: "200px" }} onClick={() => setModalImage(part)} />;
          }
          return <Latex key={index}>{part}</Latex>;
        })}
      </div>
    );
  };

  const handleDeleteAll = async (testName) => {
    try {
      const answers = groupedIncorrectAnswers[testName];
      
      const deletePromises = answers.map((answer) => {
        if (answer.testResultId) {
          const docRef = doc(db, 'users', userId, 'testResults', answer.testResultId);
          return deleteDoc(docRef);
        } else {
          console.warn("No testResultId found for answer:", answer);
          return Promise.resolve();
        }
      });
  
      await Promise.all(deletePromises);
  
      setGroupedIncorrectAnswers((prev) => {
        const updatedData = { ...prev };
        delete updatedData[testName];
        return updatedData;
      });
  
      console.log(`${testName}의 오답이 성공적으로 삭제되었습니다.`);
    } catch (error) {
      console.error("Error deleting all incorrect answers: ", error);
    }
  };
  
  return (
    <div className="result-page">
      <h1 className="page-title">오답 해설 페이지</h1>
      {Object.keys(groupedIncorrectAnswers).length > 0 ? (
        Object.entries(groupedIncorrectAnswers)
          .map(([testName, answers], index) => (
            <div key={index} className="test-group">
              <h2 className="test-name" onClick={() => toggleTestExpansion(testName)}>
                {testName} {expandedTests[testName] ? "▼" : "▶"}
              </h2>
              {expandedTests[testName] && (
                <div className="test-answers">
                  <button className="delete-all-button" onClick={() => handleDeleteAll(testName)}>전체 삭제</button>
                  {answers.map((item, idx) => (
                    <div key={idx} className="question-box">
                      <h3>{item.questionNum}번 문제</h3>
                      <p>{renderQuestionText(item.question)}</p>
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
                        <div>{renderExplanation(item.explanation)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
      ) : (
        <p>오답이 없습니다.</p>
      )}
      <div className="buttons">
        <Link to="/" className="button">홈으로</Link>
      </div>

      {modalImage && (
        <div className="modal" onClick={() => setModalImage(null)}>
          <div className="modal-content">
            <img src={modalImage} alt="Explanation" className="modal-image" onClick={() => setModalImage(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Wrong;
