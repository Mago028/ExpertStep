import React from "react";
import { Link } from "react-router-dom";
import "./EcsTest.css";

export default function Ecs22_2() {
  return (
    <div className="Test-Guidelines">
      <div className="Ecs-Guidelines-header">
        <h2>건설안전기사 22년도 2회차</h2>
      </div>
      <div className="notification">
        <h4>안내사항</h4>
        <p>-실제 시험장과 비슷한 환경을 제공합니다.</p>
        <p>-제한 시간이 있으며 시험을 제출하면 시험 결과를 알 수 있습니다.</p>
      </div>
      <div className="time-limit">
        <p>제한시간:180분</p>
      </div>

      <Link to="/problem/ecs/ecs22_2_test" style={{ textDecoration: "none" }}>
        <div className="test_start">시험 응시하기</div>
      </Link>
    </div>
  );
}
