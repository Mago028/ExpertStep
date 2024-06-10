import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import { useAuthContext } from '../../hooks/useAuthContext';
import './DeleteAccount.css';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const { user } = useAuthContext();

  const handleDelete = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && password) {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      try {
        await reauthenticateWithCredential(currentUser, credential);
        await deleteUser(currentUser);
        console.log("Account deletion successful");
        navigate('/signup');
      } catch (error) {
        console.error("Error deleting user: ", error);
        alert("회원 탈퇴 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } else {
      alert("비밀번호를 입력해 주세요.");
    }
  };

  const handleCancel = () => {
    navigate('/MyPage');
  };

  return (
    <div className="delete-account-container">
      <div className="delete-account-header">
        <div className="delete-icon-container">
          <IoSettingsOutline style={{ width: '50px', height: '50px', marginRight: '10px' }} />
        </div>
        <div className="delete-title-container">
          <h1>회원탈퇴</h1>
        </div>
      </div>
      <div className="delete-account-content">
        <div className="profile-info">
          <div>
            <h1 className="name title">{user?.displayName}</h1>
          </div>
        </div>
        <div className="delete-field-container">
          <p>INERGY 계정을 탈퇴하면 모든 데이터와 서비스 이용 기록이 삭제됩니다.</p>
          <p>자동화된 또는 복구가 불가능한 방법으로 처리됩니다. 잃게 되는 정보와 서비스 이용 기록이 많으니 신중하게 고민하고 결정하시길 바랍니다.</p>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <div className="button-container">
            <button className="delete-account-button" onClick={handleDelete}>탈퇴하기</button>
            <button className="delete-account-back" onClick={handleCancel}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
