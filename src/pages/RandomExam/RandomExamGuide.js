import React from "react";
import { Link, useParams } from "react-router-dom";
import "./RandomExamGuide.css";

export default function RandomExamGuide() {
  const { certId } = useParams(); // 선택된 자격증 ID를 파라미터로 가져옴

  // 자격증별 안내 내용을 동적으로 표시하기 위한 데이터
  const examInfo = {
    eip: {
      title: "정보처리기사",
      time: "제한시간: 150분",
    },
    eis: {
      title: "산업안전기사",
      time: "제한시간: 180분",
    },
    ee: {
      title: "전기기사",
      time: "제한시간: 150분",
    },
    efps: {
      title: "소방설비기사(기계)",
      time: "제한시간: 120분",
    },
    ecs: {
      title: "건설안전기사",
      time: "제한시간: 180분",
    },
  };

  // 선택된 자격증에 따른 정보 가져오기
  const selectedExam = examInfo[certId] || { title: "모의고사", time: "제한시간: 설정되지 않음" };

  return (
    <div className="RandomExamGuide-container">
      <div className="RandomExamGuide-header">
        <h2>{selectedExam.title} 모의고사</h2>
      </div>
      <div className="RandomExamGuide-notification">
        <h4>안내사항</h4>
        <p>- 실제 시험과 유사한 환경에서 모의고사를 제공합니다.</p>
        <p>- 제한 시간이 있으며, 시험이 끝난 후 결과를 확인할 수 있습니다.</p>
      </div>
      <div className="RandomExamGuide-time-limit">
        <p>{selectedExam.time}</p>
      </div>

      <Link to={`/random-exam/test/${certId}`} style={{ textDecoration: "none" }}>
        <div className="RandomExamGuide-test_start">시험 응시하기</div>
      </Link>
    </div>
  );
}
