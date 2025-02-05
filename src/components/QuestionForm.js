import React, { useState } from 'react';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';  // 기존 Firebase 설정 파일에서 db 가져오기

const QuestionForm = ({ questionId, existingData }) => {
  const [question, setQuestion] = useState(existingData || { title: '', content: '' });
  const firestore = getFirestore(db);  // 기존 Firestore 인스턴스 사용

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const questionsRef = collection(firestore, 'questions');
    if (questionId) {
      const questionDoc = doc(firestore, 'questions', questionId);
      await updateDoc(questionDoc, question);
    } else {
      await addDoc(questionsRef, question);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={question.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Content</label>
        <textarea
          name="content"
          value={question.content}
          onChange={handleChange}
        ></textarea>
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default QuestionForm;
