import { getFirestore, doc, setDoc } from 'firebase/firestore';

const useSaveWrongAnswer = () => {
  const saveWrongAnswer = async (userId, question) => {
    const db = getFirestore();
    const wrongAnswerData = {
      question: question.Question,
      choices: {
        choice1: question['Choice 1'],
        choice2: question['Choice 2'],
        choice3: question['Choice 3'],
        choice4: question['Choice 4'],
      },
      userAnswer: question.userAnswer,
      correctAnswer: question.Answer,
      explanation: question.explanation,
      subject: question.subject, // 예: 과목 또는 카테고리
      questionNum: question.Question_Num
    };

    await setDoc(doc(db, `users/${userId}/wrongAnswers`, question.Question_Num.toString()), wrongAnswerData);
  };

  return saveWrongAnswer;
};

export default useSaveWrongAnswer;
