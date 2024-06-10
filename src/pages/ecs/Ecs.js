import React from "react";
import { Link } from "react-router-dom";
import { FaComputer } from "react-icons/fa6";
import "./Ecs.css";

export default function Ecs() {
  return (
    <div className="selectround">
      <div className="Ecs-round-header">
        <h2>건설안전기사</h2>
      </div>
      <div className="Guide">
        <p>회차를 선택하세요.</p>
      </div>
      <Link to="/problem/ecs/ecs22_1" className="link-container">
        <div className="round-select">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">22년 1회차</p>
              <p className="categoryText">
                응시문항
                <br />
                120문항
              </p>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/problem/ecs/ecs22_2" className="link-container">
        <div className="round-select">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">22년 2회차</p>
              <p className="categoryText">
                응시문항
                <br />
                120문항
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
