import styles from './Login.module.css'
import { useState } from 'react'
import React from 'react';
import { Link } from 'react-router-dom'
import { useLogin } from '../../hooks/useLogin';
import {ReactComponent as Logo} from "../../image/ExpertStep.svg"


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');    
    const { error, isPending, login } = useLogin();
    const handleData = (event) => {
        if (event.target.type === "email") {
            setEmail(event.target.value);
        } else if (event.target.type === "password") {
            setPassword(event.target.value);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        login(email, password);
    }

    return (
        <form className={styles.login_form} onSubmit={handleSubmit} >
            
                <div className='logo'>
                    {/* <img src={ExpertStep} alt="로고"></img> */}
                    <Logo/>
                </div>
                <div className='loginForm'>
                    <input type="email" id="myEmail" placeholder='이메일주소를 입력해 주세요' required value={email} onChange={handleData} />
                    <input type="password" id="myPassWord" placeholder='비밀번호를 입력해 주세요'required value={password} onChange={handleData} />
                    <div className='join'>
                        <Link to="/signup" style={{textDecoration:"none"}}>회원가입</Link>
                    </div>
                    <div className='loginBtn'>
                        {!isPending && <button type="submit" id="myLogin" className={styles.btn}>로그인</button>}
                    </div>
                {error && <strong>{error}</strong>}
                </div>
                
            
        </form>

    )
}