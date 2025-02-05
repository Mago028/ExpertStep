import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RandomExamSelect from './RandomExamSelect';
import RandomExamGuide from './RandomExamGuide';
import RandomExamTest from './RandomExamTest';

export default function RandomExam() {
  return (
    <div>
      <Routes>
        {/* 모의고사 선택 페이지 */}
        <Route path="/select" element={<RandomExamSelect />} />

        {/* 모의고사 안내 페이지 */}
        <Route path="/guide" element={<RandomExamGuide />} />

        {/* 모의고사 테스트 페이지 */}
        <Route path="/test" element={<RandomExamTest />} />
      </Routes>
    </div>
  );
}
