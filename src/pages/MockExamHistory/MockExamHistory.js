import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Latex from 'react-latex';
import 'katex/dist/katex.min.css';
import "./MockExamHistory.css";

const MockExamHistory = () => {
  const location = useLocation();
  const { userId } = location.state || { userId: "defaultUserId" };
  const [mockExamRecords, setMockExamRecords] = useState({});
  const [expandedExams, setExpandedExams] = useState({});
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.error("No userId provided");
      return;
    }

    const fetchMockExamRecords = async () => {
      try {
        const testResultsCollection = collection(db, 'users', userId, 'testResults');
        const testResultsSnapshot = await getDocs(testResultsCollection);

        let tempRecordsData = {};

        testResultsSnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const testName = data.testName;

          if (testName.includes("Unknown Test") || testName.includes("회차")) return;

          if (!tempRecordsData[testName]) {
            tempRecordsData[testName] = [];
          }

          if (data.allAnswers) {
            tempRecordsData[testName] = tempRecordsData[testName].concat(
              data.allAnswers.map((answer) => ({ ...answer, testResultId: docSnapshot.id }))
            );
          }
        });

        const sortedRecordsData = Object.fromEntries(
          Object.entries(tempRecordsData).map(([testName, answers]) => [
            testName,
            answers.sort((a, b) => a.questionNum - b.questionNum),
          ])
        );

        setMockExamRecords(sortedRecordsData);
        console.log("Mock Exam Records after fetch:", sortedRecordsData);
      } catch (error) {
        console.error("Error fetching mock exam records: ", error);
      }
    };

    fetchMockExamRecords();
  }, [userId]);

  const toggleExamExpansion = (testName) => {
    setExpandedExams((prev) => ({
      ...prev,
      [testName]: !prev[testName],
    }));
  };

  const handleDeleteAll = async (testName) => {
    try {
      const answers = mockExamRecords[testName];
      
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
  
      setMockExamRecords((prev) => {
        const updatedData = { ...prev };
        delete updatedData[testName];
        return updatedData;
      });
  
      console.log(`${testName}의 기록이 성공적으로 삭제되었습니다.`);
    } catch (error) {
      console.error("Error deleting all mock exam records: ", error);
    }
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

  return (
    <div className="record-page">
      <h1 className="page-title">모의고사 기록 페이지</h1>
      {Object.keys(mockExamRecords).length > 0 ? (
        Object.entries(mockExamRecords).map(([testName, answers], index) => (
          <div key={index} className="test-group">
            <h2 className="test-name" onClick={() => toggleExamExpansion(testName)}>
              {testName} {expandedExams[testName] ? "▼" : "▶"}
            </h2>
            {expandedExams[testName] && (
              <div className="test-answers">
                <button className="delete-all-button" onClick={() => handleDeleteAll(testName)}>전체 삭제</button>
                {answers.map((item, idx) => (
                  <div key={idx} className={`question-box ${item.isCorrect ? 'correct-box' : 'incorrect-box'}`}>
                    <h3>{item.questionNum}번 문제</h3>
                    <p>{renderQuestionText(item.question)}</p>
                    <div className="choices">
                      {item.choices.map((choice, i) => (
                        <p
                          key={i}
                          className={
                            i + 1 === item.correctAnswer
                              ? "correct-answer-choice"
                              : i + 1 === item.selectedAnswer
                              ? "selected-answer-choice"
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
                      </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>모의고사 기록이 없습니다.</p>
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

export default MockExamHistory;
