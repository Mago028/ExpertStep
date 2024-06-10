import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import { usePasswordChange } from '../../hooks/usePasswordChange';
import { useAuthContext } from '../../hooks/useAuthContext';
import './PassWordChangePage.css';

function PasswordChangeScreen() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { changePassword, error, isPending } = usePasswordChange();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        changePassword(currentPassword, newPassword);
    };

    const handleCancel = () => {
        navigate('/MyPage');
    };

    return (
        <div className="password-change-container">
            <div className="password-change-header">
                <div className="password-icon-container">
                    <IoSettingsOutline style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                </div>
                <div className="password-title-container">
                    <h1>비밀번호 변경</h1>
                </div>
            </div>
            <div className="form-container">
                <div className="password-change-content">
                    <div className="profile-info">
                        <div>
                            <h1 className="name title">{user?.displayName}</h1>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="password-form">
                        <div className="password-field-container">
                            <input
                                type="password"
                                placeholder="현재 비밀번호를 입력하세요"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="password-input"
                            />
                        </div>
                        <input
                            type="password"
                            placeholder="변경할 비밀번호를 입력하세요"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="password-input"
                        />
                        <input
                            type="password"
                            placeholder="변경할 비밀번호를 다시 입력하세요"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="password-input"
                        />
                        {!isPending && <button type="submit" className="password-submit-button">비밀번호 변경</button>}
                        {isPending && <button type="submit" className="password-submit-button" disabled>변경 중...</button>}
                        {error && <p className="error">{error}</p>}
                        <button type="button" className="password-cancel-button" onClick={handleCancel}>취소</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PasswordChangeScreen;
