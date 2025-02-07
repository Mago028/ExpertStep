// src/hooks/usePasswordChange.js
import { useState } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuthContext } from './useAuthContext';

export const usePasswordChange = () => {
    const { user } = useAuthContext();
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const changePassword = async (currentPassword, newPassword) => {
        setError(null);
        setIsPending(true);

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setIsPending(false);
            alert('비밀번호가 성공적으로 변경되었습니다.');
        } catch (err) {
            setError(`비밀번호 변경 실패: ${err.message}`);
            setIsPending(false);
        }
    };

    return { changePassword, error, isPending };
}
