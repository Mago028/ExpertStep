// Nav.js
import styles from "./Nav.module.css";
import { Link, Navigate } from "react-router-dom"; // Navigate 추가
import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

export default function Nav() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
    return <Navigate to="/login" replace={true} />; // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <nav className={styles.nav}>
      <h1 className={styles.tit}>ExpertStep</h1>
      <ul className={styles.list_nav}>
        {!user && (
          <>
            <li>
              <Link to="/login">로그인</Link>
            </li>
            <li>
              <Link to="/signup">가입하기</Link>
            </li>
          </>
        )}
        {user && (
          <li>
            <strong>환영합니다. {user.displayName}님!</strong>
            <button type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
