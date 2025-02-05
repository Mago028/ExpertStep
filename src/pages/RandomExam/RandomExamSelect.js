import React from "react";
import { Link } from "react-router-dom";
import { FaComputer } from "react-icons/fa6";
import "./RandomExamSelect.css";

export default function RandomExamSelect() {
  return (
    <div className="test-select">
      <div className="select-header">
        <h2>모의고사</h2>
      </div>
      <div className="Guide">
        <p>응시 분야를 선택하세요.</p>
      </div>
      
      {/* 정보처리기사 */}
      <Link to="/random-exam/guide/eip" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">정보처리기사</p>
              <p className="categoryTime">응시시간 2시간 30분</p>
            </div>
          </div>
        </div>
      </Link>

      {/* 산업안전기사 */}
      <Link to="/random-exam/guide/eis" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">산업안전기사</p>
              <p className="categoryTime">응시시간 3시간</p>
            </div>
          </div>
        </div>
      </Link>

      {/* 전기기사 */}
      <Link to="/random-exam/guide/ee" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">전기기사</p>
              <p className="categoryTime">응시시간 2시간 30분</p>
            </div>
          </div>
        </div>
      </Link>

      {/* 소방설비기사(기계) */}
      <Link to="/random-exam/guide/efps" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">소방설비기사(기계)</p>
              <p className="categoryTime">응시시간 2시간</p>
            </div>
          </div>
        </div>
      </Link>

      {/* 건설안전기사 */}
      <Link to="/random-exam/guide/ecs" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" />
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">건설안전기사</p>
              <p className="categoryTime">응시시간 3시간</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
