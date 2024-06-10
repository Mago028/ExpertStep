import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "../../firebase/config"; // Firebase 설정 파일 경로
import { collection, getDocs } from 'firebase/firestore';
import './Efps_word.css';

function EfpsWord() {
  const [pageIndex, setPageIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [cards, setCards] = useState([]); // Firestore에서 가져온 단어 데이터를 저장할 상태
  const cardsPerPage = 1; // 한 페이지에 한 장의 카드만 표시
  const navigate = useNavigate();
  const subjectKey = 'efps_word_favorites';

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem(subjectKey)) || [];
    setFavorites(storedFavorites);

    const fetchCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'efps_word'));
        const fetchedCards = querySnapshot.docs.map(doc => ({
          id: doc.id,
          word: doc.data().word,
          definition: doc.data().define
        }));
        setCards(fetchedCards);
      } catch (error) {
        console.error("Error fetching cards: ", error);
      }
    };

    fetchCards();
  }, []);

  const numPages = Math.ceil(cards.length / cardsPerPage);
  const currentPageCards = cards.slice(pageIndex * cardsPerPage, (pageIndex + 1) * cardsPerPage);

  const handleNext = () => {
    if (pageIndex < numPages - 1) {
      setPageIndex(pageIndex + 1);
    } else {
      setPageIndex(0); // 마지막 카드일 경우 첫 페이지로 돌아감
    }
  };

  const handleComplete = () => {
    navigate('/word'); // 완료 버튼을 누르면 '/word' 경로로 이동
  };

  const toggleFavorite = (card) => {
    const updatedFavorites = favorites.includes(card.id)
      ? favorites.filter(fav => fav !== card.id)
      : [...favorites, card.id];

    setFavorites(updatedFavorites);
    localStorage.setItem(subjectKey, JSON.stringify(updatedFavorites));
  };

  return (
    <div className="card-container">
      {currentPageCards.map((card) => (
        <div key={card.id} className="card-content">
          <Card card={card} isFavorite={favorites.includes(card.id)} toggleFavorite={toggleFavorite} />
          <div className="button-container">
            <button onClick={handleNext} className="next-button">다음</button>
            <button onClick={handleComplete} className="complete-button">완료</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Card({ card, isFavorite, toggleFavorite }) {
  const [showDefinition, setShowDefinition] = useState(false);
  const definitionRef = useRef(null);

  useEffect(() => {
    const resizeText = (element) => {
      let fontSize = 1.5; // Initial font size in em
      element.style.fontSize = `${fontSize}em`;
      element.style.overflow = 'hidden';

      while ((element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) && fontSize > 0.5) {
        fontSize -= 0.1;
        element.style.fontSize = `${fontSize}em`;
      }
    };

    if (definitionRef.current) {
      resizeText(definitionRef.current);
    }
  }, [card.definition, showDefinition]);

  const handleToggleDefinition = () => {
    setShowDefinition(!showDefinition);
  };

  return (
    <div className={`card ${showDefinition ? 'show-definition' : ''}`} onClick={handleToggleDefinition}>
      <div className="card-inner">
        <div className="card-front">
          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(card); }} className="favorite-button">
            {isFavorite ? '★' : '☆'}
          </button>
          <div className="word">
            {card.word}
          </div>
        </div>
        <div className="card-back">
          <div className="definition" ref={definitionRef}>
            {card.definition}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EfpsWord;