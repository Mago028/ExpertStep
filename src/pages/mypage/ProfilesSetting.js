import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import { appAuth } from '../../firebase/config';
import { updateProfile } from 'firebase/auth';
import { useAuthContext } from '../../hooks/useAuthContext';
import './ProfileSetting.css';

const ProfileSetting = () => {
  const { user, dispatch } = useAuthContext();
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setCurrentUsername(user.displayName);
    }
  }, [user]);

  const handleNewUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleSaveChanges = () => {
    if (newUsername && newUsername !== currentUsername) {
      updateProfile(appAuth.currentUser, { displayName: newUsername })
        .then(() => {
          dispatch({ type: 'login', payload: { ...user, displayName: newUsername } });
          alert(`이름이 '${currentUsername}'에서 '${newUsername}'로 변경되었습니다!`);
          setCurrentUsername(newUsername);
          setNewUsername('');
        })
        .catch((error) => {
          alert('이름 변경에 실패했습니다.');
        });
    } else if (!newUsername) {
      alert('새로운 이름을 입력해주세요.');
    } else {
      alert('새로운 이름이 기존 이름과 같습니다. 다른 이름을 입력해주세요.');
    }
  };

  const handleCancel = () => {
    navigate('/MyPage');
  };

  return (
    <div className="profile-settings-wrapper">
      <div className="profile-settings-header">
        <div className="setting-icon-container">
          <IoSettingsOutline style={{ width: '50px', height: '50px', marginRight: '10px' }} />
        </div>
        <div className="setting-title-container">
          <h1>프로필 설정</h1>
        </div>
      </div>
      <div className="profile-settings-container">
        <div className="profile-info">
          <div> 
            <h1 className="name title">{currentUsername}</h1>
          </div>
        </div>
        <div className="profile-current-info">
          <label htmlFor="currentUsername">현재 이름</label>
          <input
            type="text"
            id="currentUsername"
            name="currentUsername"
            value={currentUsername}
            readOnly
          />
        </div>
        <div className="profile-new-info">
          <label htmlFor="newUsername">변경할 이름</label>
          <input
            type="text"
            id="newUsername"
            name="newUsername"
            value={newUsername}
            onChange={handleNewUsernameChange}
            placeholder="새로운 이름 입력하시오"
          />
        </div>
        <div className="profile-actions">
          <button onClick={handleSaveChanges} className="profile-save-button">변경사항 저장</button>
          <button onClick={handleCancel} className="cancel-button">취소</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
