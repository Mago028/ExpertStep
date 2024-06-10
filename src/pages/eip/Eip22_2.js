import React from "react";
import { Link } from "react-router-dom";

export default function Eip22_2() {
  return (
    <div className="Test-Guidelines">
      <div className="Eip-Guidelines-header">
        <h2>정보처리기사 22년도 2회차 </h2>
      </div>
      <div className="notification">
        <h4>안내사항</h4>
        <p>-실제 시험장과 비슷한 환경을 제공합니다.</p>
        <p>-제한 시간이 있으며 시험을 제출하면 시험 결과를 알 수 있습니다.</p>
      </div>
      <div className="time-limit">
        <p>제한시간:150분</p>
      </div>

      <Link
        to="/problem/eip/eip22_2_test"
        style={{ textDecoration: "none", color: "white" }}
      >
        <div className="test_start">시험 응시하기</div>
      </Link>
    </div>
  );
}
