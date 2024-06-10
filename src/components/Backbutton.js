import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import "./Backbutton.css";

function BackButton() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <button onClick={handleGoBack} className="back-btn">
      <IoIosArrowBack size="40px" />
    </button>
  );
}

export default BackButton;
