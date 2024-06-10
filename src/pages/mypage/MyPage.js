// src/pages/mypage/MyPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPersonSharp } from 'react-icons/io5';
import { useAuthContext } from '../../hooks/useAuthContext';
import './MyPage.css'; 

const MyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleProfileEdit = () => {
    navigate('/profile-settings');
  };

  const handlePasswordChange = () => {
    navigate('/password-change'); 
  };

  const handleAccountDeletion = () => {
    navigate('/delete-account'); 
  };

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <IoPersonSharp size={24} />
        <span className="mypage-title">회원정보</span>
      </div>
      <div className="mypage-account">
        <div className="profile-section">
          <div className="profile-pic-container">
            <IoPersonSharp size={50} />
          </div>
          <div className="profile-name">{user ? user.displayName : '홍길동'}</div> {/* 닉네임을 표시 */}
        </div>
        <div className="account-settings">
          <div className="setting-item" onClick={handleProfileEdit}>프로필 수정</div>
          <div className="setting-item" onClick={handlePasswordChange}>비밀번호 변경</div>
          <div className="setting-item" onClick={handleAccountDeletion}>회원 탈퇴</div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
