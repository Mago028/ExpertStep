import { useState } from 'react';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { appAuth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useDeleteAccount = () => {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { user, dispatch } = useAuthContext();

    const deleteAccount = async (password) => {
        setError(null);
        setIsPending(true);

        try {
            // 현재 사용자를 다시 인증
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            // 사용자 삭제
            await deleteUser(user);

            // 로그아웃 처리
            dispatch({ type: 'logout' });

            setIsPending(false);
        } catch (err) {
            setError(err.message);
            setIsPending(false);
        }
    };

    return { deleteAccount, error, isPending };
};
