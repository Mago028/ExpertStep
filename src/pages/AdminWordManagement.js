import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import './AdminWordManagement.css'; // CSS 파일 추가

const collections = {
  "ECS Word": "ecs_word",
  "EE Word": "ee_word",
  "EFPS Word": "efps_word",
  "EIP Word": "eip_word",
  "EIS Word": "eis_word",
};

const AdminWordManagement = () => {
  const [selectedCollection, setSelectedCollection] = useState(Object.keys(collections)[0]);
  const [wordList, setWordList] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [newDefinition, setNewDefinition] = useState("");

  async function fetchWords() {
    try {
      const wordsCollection = collection(db, collections[selectedCollection]);
      const wordSnapshot = await getDocs(wordsCollection);
      const words = wordSnapshot.docs.map(doc => ({
        id: doc.id,
        word: doc.data().word,
        definition: doc.data().define,
      }));
      setWordList(words);
    } catch (error) {
      console.error("Error fetching words: ", error);
    }
  }

  useEffect(() => {
    fetchWords();
  }, [selectedCollection]);

  const handleAddWord = async () => {
    if (newWord.trim() === "" || newDefinition.trim() === "") return;
  
    try {
      await addDoc(collection(db, collections[selectedCollection]), { word: newWord, define: newDefinition });
      setNewWord("");
      setNewDefinition("");
      fetchWords();
    } catch (error) {
      console.error("Error adding word: ", error);
    }
  };

  const handleDeleteWord = async (wordId) => {
    try {
      await deleteDoc(doc(db, collections[selectedCollection], wordId));
      fetchWords();
    } catch (error) {
      console.error("Error deleting word: ", error);
    }
  };

  return (
    <div className="word-management-container">
      <h2>단어 관리</h2>
      <div className="certificate-selection">
        <label>자격증 선택: </label>
        <select value={selectedCollection} onChange={(e) => setSelectedCollection(e.target.value)}>
          {Object.keys(collections).map(collectionName => (
            <option key={collectionName} value={collectionName}>{collectionName}</option>
          ))}
        </select>
      </div>
      <div>
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="단어"
        />
        <input
          type="text"
          value={newDefinition}
          onChange={(e) => setNewDefinition(e.target.value)}
          placeholder="정의"
        />
        <button onClick={handleAddWord}>단어 추가</button>
      </div>
  
      <div className="word-list"> {/* 여기에서 스크롤 문제 가능성 */}
        <ul>
          {wordList.map((word) => (
            <li key={word.id} className="word-item">
              <button className="delete-button" onClick={() => handleDeleteWord(word.id)}>삭제</button>
              <div className="word-content">
                <strong>{word.word}</strong>: {word.definition}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminWordManagement;
