import React from "react";
import { Link } from "react-router-dom";
import { FaComputer } from "react-icons/fa6";
import "./Eis.css";

export default function Eis() {
  return (
    <div className="selectround">
      <div className="EIS-round-header">
        <h2>산업안전기사</h2>
      </div>
      <div className="Guide">
        <p>회차를 선택하세요.</p>
      </div>
      <Link to="/problem/eis/eis21_1" className="link-container">
        <div className="round-select">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">21년 1회차</p>
              <p className="categoryText">
                응시문항
                <br />
                100문항
              </p>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/problem/eis/eis21_2" className="link-container">
        <div className="round-select">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">21년 2회차</p>
              <p className="categoryText">
                응시문항
                <br />
                100문항
              </p>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/problem/eis/eis21_3" className="link-container">
        <div className="round-select">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">21년 3회차</p>
              <p className="categoryText">
                응시문항
                <br />
                100문항
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
