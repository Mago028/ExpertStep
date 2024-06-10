import React from "react";
import { Link } from "react-router-dom";
import { FaComputer } from "react-icons/fa6";
import "./Problem.css";

function Problem() {
  return (
    <div className="test-select">
      <div className="select-header">
        <h2>문제</h2>
      </div>
      <div className="Guide">
        <p>응시 분야를 선택하세요.</p>
      </div>
      <Link to="/problem/eip" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" /> {/* Font Awesome 아이콘 */}
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">정보처리기사</p>
              <p className="categoryTime">
                응시시간
                <br />
                2시간 30분
              </p>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/problem/eis" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" /> {/* Font Awesome 아이콘 */}
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">산업안전기사</p>
              <p className="categoryTime">
                응시시간
                <br />
                3시간
              </p>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/problem/ee" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" /> {/* Font Awesome 아이콘 */}
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">전기기사</p>
              <p className="categoryTime">
                응시시간
                <br />
                2시간 30분
              </p>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/problem/efps" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" /> {/* Font Awesome 아이콘 */}
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">소방설비기사(기계)</p>
              <p className="categoryTime">
                응시시간
                <br />
                2시간
              </p>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/problem/ecs" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="50px" /> {/* Font Awesome 아이콘 */}
            </div>
            <div className="text-wrapper">
              <p className="categoryHeader">건설안전기사</p>
              <p className="categoryTime">
                응시시간
                <br />
                3시간
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Problem;
