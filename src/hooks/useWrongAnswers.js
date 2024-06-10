import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const useWrongAnswers = (userId) => {
  const [wrongAnswers, setWrongAnswers] = useState([]);

  useEffect(() => {
    const fetchWrongAnswers = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, `users/${userId}/wrongAnswers`));
      const answers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWrongAnswers(answers);
    };

    fetchWrongAnswers();
  }, [userId]);

  return wrongAnswers;
};

export default useWrongAnswers;
