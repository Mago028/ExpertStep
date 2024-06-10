import React from "react";
import { Link } from "react-router-dom";
import { FaComputer } from "react-icons/fa6";
import "./Efps.css";

export default function Efps() {
  return (
    <div className="selectround">
      <div className="Efps-round-header">
        <h2>소방설비기사(기계)</h2>
      </div>
      <div className="Guide">
        <p>회차를 선택하세요.</p>
      </div>
      <Link to="/problem/efps/efps21_1" className="link-container">
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
                80문항
              </p>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/problem/efps/efps21_2" className="link-container">
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
                80문항
              </p>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/problem/efps/efps21_4" className="link-container">
        <div className="round-select">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">21년 4회차</p>
              <p className="categoryText">
                응시문항
                <br />
                80문항
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
