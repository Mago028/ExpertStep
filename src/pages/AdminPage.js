import React, { useState } from 'react';
import { functions } from '../firebase/config';
import { httpsCallable } from 'firebase/functions';
import AdminWordManagement from './AdminWordManagement'; // AdminWordManagement 컴포넌트를 가져옵니다.
import './AdminPage.css'; // 스타일 파일을 가져옵니다.

const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // 관리자 권한 부여 함수
  const handleMakeAdmin = async () => {
    const addAdminRole = httpsCallable(functions, 'addAdminRole');
    try {
      const result = await addAdminRole({ email });
      setMessage(result.data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Page</h1>
      
      {/* 관리자 권한 부여 섹션 */}
      <div className="admin-role-section">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="추가할 관리자 메일을 입력하시오"
          className="admin-input"
        />
        <button onClick={handleMakeAdmin} className="admin-button">Make Admin</button>
        {message && <p>{message}</p>}
      </div>
      
      {/* 단어 관리 섹션 */}
      <AdminWordManagement />
    </div>
  );
};

export default AdminPage;
