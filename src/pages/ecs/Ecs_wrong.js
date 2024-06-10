import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineStickyNote2 } from "react-icons/md";
import "./Ecs_wrong.css";

export default function Ecs_wrong() {
  return (
    <div>
      <div className="test-select">
        <div className="select-header">
          <h2>오답</h2>
        </div>
        <div className="Guide">
          <p>건설안전기사의 과목을 선택하세요.</p>
        </div>
        <Link to="/" className="link-container">
          <div className="field">
            <div className="content">
              <div className="icon-wrapper">
                <MdOutlineStickyNote2 size="50px" /> {/* Font Awesome 아이콘 */}
              </div>
              <div className="text-wrapper">
                <p className="SubjectHeader">1과목</p>
                <p className="categorySubject">산업안전관리론</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/" className="link-container">
          <div className="field">
            <div className="content">
              <div className="icon-wrapper">
                <MdOutlineStickyNote2 size="50px" /> {/* Font Awesome 아이콘 */}
              </div>
              <div className="text-wrapper">
                <p className="SubjectHeader">2과목</p>
                <p className="categorySubject">산업심리 및 교육</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/" className="link-container">
          <div className="field">
            <div className="content">
              <div className="icon-wrapper">
                <MdOutlineStickyNote2 size="50px" /> {/* Font Awesome 아이콘 */}
              </div>
              <div className="text-wrapper">
                <p className="SubjectHeader">3과목</p>
                <p className="categorySubject">인간공학 및 시스템안전공학</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/" className="link-container">
          <div className="field">
            <div className="content">
              <div className="icon-wrapper">
                <MdOutlineStickyNote2 size="50px" /> {/* Font Awesome 아이콘 */}
              </div>
              <div className="text-wrapper">
                <p className="SubjectHeader">4과목</p>
                <p className="categorySubject">건설시공학</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/" className="link-container">
          <div className="field">
            <div className="content">
              <div className="icon-wrapper">
                <MdOutlineStickyNote2 size="50px" /> {/* Font Awesome 아이콘 */}
              </div>
              <div className="text-wrapper">
                <p className="SubjectHeader">5과목</p>
                <p className="categorySubject">건설재료학</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/" className="link-container">
          <div className="field">
            <div className="content">
              <div className="icon-wrapper">
                <MdOutlineStickyNote2 size="50px" /> {/* Font Awesome 아이콘 */}
              </div>
              <div className="text-wrapper">
                <p className="SubjectHeader">6과목</p>
                <p className="categorySubject">건설안전기술</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
