import { createContext, useEffect, useReducer } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { appAuth } from '../firebase/config';

const AuthContext = createContext();

// 인증 상태 관리 리듀서
const authReducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload };
    case 'logout':
      return { ...state, user: null };
    case 'isAuthReady':
      return { ...state, user: action.payload, isAuthReady: true };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthReady: false,
  });

  useEffect(() => {
    // Firebase 인증 상태 감지
    const unsubscribe = onAuthStateChanged(appAuth, async (user) => {
      try {
        if (user) {
          const tokenResult = await user.getIdTokenResult();
          const isAdmin = tokenResult.claims?.admin || false;

          user = { ...user, admin: isAdmin }; // 사용자 객체에 admin 속성 추가
          console.log('✅ 사용자 로그인:', user);
          console.log('🛡️ 관리자 권한:', isAdmin);
        } else {
          console.log('🚫 사용자 로그아웃됨');
        }

        dispatch({ type: 'isAuthReady', payload: user });
      } catch (error) {
        console.error('❌ Firebase 인증 상태 감지 오류:', error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };