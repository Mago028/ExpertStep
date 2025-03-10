import React from 'react';
import {Link} from "react-router-dom";
import { FaComputer } from "react-icons/fa6";

import './Word.css';

function Word() {
  


  return (
    <div className="test-select">
      <div className="select-header">
          <h2>단어</h2>
      </div>
      <div className="Guide">
        <p>공부할 분야를 선택하세요.</p>
      </div>
      <Link to="/eip/Eip_word" className="link-container">
        <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="40px"/> {/* Font Awesome 아이콘 */}
            </div>
            <div className="text-wrapper">
              <p className='categoryHeader'>정보처리기사</p>
            </div>
          </div>
        </div>
      </Link>
        <Link to="/eis/Eis_word" className="link-container">
          <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="40px"/> {/* Font Awesome 아이콘 */}
            </div>
            <div className="text-wrapper">
              <p className='categoryHeader'>산업안전기사</p>
            </div>
          </div>
          </div>
        </Link>
        <Link to="/ee/Ee_word" className="link-container">
          <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="40px"/> {/* Font Awesome 아이콘 */}
            </div>
            <div className="text-wrapper">
              <p className='categoryHeader'>전기기사</p>
            </div>
          </div>
          </div>
        </Link>
        <Link to="/efps/Efps_word" className="link-container">
          <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="40px"/> {/* Font Awesome 아이콘 */}
            </div>
            <div className="text-wrapper">
              <p className='categoryHeader'>소방설비기사(기계)</p>
            </div>
          </div>
          </div>
        </Link>
        <Link to="/ecs/Ecs_word" className="link-container">
          <div className="field">
          <div className="content">
            <div className="icon-wrapper">
              <FaComputer size="40px"/> {/* Font Awesome 아이콘 */}
            </div>
            <div className="text-wrapper">
              <p className='categoryHeader'>건설안전기사</p>
            </div>
          </div>
          </div>
        </Link>
    </div>
  );
}

export default Word;