import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { BsPencilSquare } from "react-icons/bs";
import { FaFileWord, FaClipboardList, FaClipboardCheck } from "react-icons/fa"; // FaClipboardCheck로 아이콘 임포트 수정
import { MdOutlineSmsFailed } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { db, appAuth } from "../../firebase/config";  
import { doc, getDoc } from "firebase/firestore"; 

export default function Home() {
    const [isProblemHovered, setIsProblemHovered] = useState(false);
    const [isWordHovered, setIsWordHovered] = useState(false);
    const [isWrongHovered, setIsWrongHovered] = useState(false);
    const [isCalendarHovered, setIsCalendarHovered] = useState(false);
    const [isMockExamHovered, setIsMockExamHovered] = useState(false);
    const [isMockExamHistoryHovered, setIsMockExamHistoryHovered] = useState(false); // 모의고사 기록 버튼 상태 추가
    const [isAdmin, setIsAdmin] = useState(null);

    const userId = appAuth.currentUser ? appAuth.currentUser.uid : "defaultUserId"; 

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (userId) {
                try {
                    const userDoc = await getDoc(doc(db, "userRoles", userId));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setIsAdmin(userData.isAdmin || false);
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
        };
        checkAdminStatus();
    }, [userId]);

    const handleIcon1MouseEnter = () => setIsProblemHovered(true);
    const handleIcon1MouseLeave = () => setIsProblemHovered(false);
    const handleIcon2MouseEnter = () => setIsWordHovered(true);
    const handleIcon2MouseLeave = () => setIsWordHovered(false);
    const handleIcon3MouseEnter = () => setIsWrongHovered(true);
    const handleIcon3MouseLeave = () => setIsWrongHovered(false);
    const handleIcon4MouseEnter = () => setIsCalendarHovered(true);
    const handleIcon4MouseLeave = () => setIsCalendarHovered(false);
    const handleIcon5MouseEnter = () => setIsMockExamHovered(true);
    const handleIcon5MouseLeave = () => setIsMockExamHovered(false);
    const handleIcon6MouseEnter = () => setIsMockExamHistoryHovered(true); // 모의고사 기록 버튼 호버 처리
    const handleIcon6MouseLeave = () => setIsMockExamHistoryHovered(false);

    return (
        <div className='square-grid'>
            <div className='square-container'>
                <Link to="/problem" style={{ textDecoration: "none" }}>
                    <div
                        className='square'
                        onMouseEnter={handleIcon1MouseEnter}
                        onMouseLeave={handleIcon1MouseLeave}
                    >
                        <BsPencilSquare size="60px"
                            color={isProblemHovered ? 'white' : 'black'}
                            className='icon' />
                        <p>회차고사</p>
                    </div>
                </Link>
                <Link
                    to={{
                        pathname: "/Wrong",
                        state: { userId } 
                    }}
                    style={{ textDecoration: "none" }}
                >
                    <div
                        className='square'
                        onMouseEnter={handleIcon3MouseEnter}
                        onMouseLeave={handleIcon3MouseLeave}
                    >
                        <MdOutlineSmsFailed size="60px"
                            color={isWrongHovered ? 'white' : 'black'}
                            className='icon' />
                        <p>회차고사 오답</p>
                    </div>
                </Link>
                <Link to="/word" style={{ textDecoration: "none" }}>
                    <div
                        className='square'
                        onMouseEnter={handleIcon2MouseEnter}
                        onMouseLeave={handleIcon2MouseLeave}
                    >
                        <FaFileWord size="60px"
                            color={isWordHovered ? 'white' : 'black'}
                            className='icon' />
                        <p>단어</p>
                    </div>
                </Link>
                <Link to="/calendar" style={{ textDecoration: "none" }}>
                    <div
                        className='square'
                        onMouseEnter={handleIcon4MouseEnter}
                        onMouseLeave={handleIcon4MouseLeave}
                    >
                        <CiCalendar size="60px"
                            color={isCalendarHovered ? 'white' : 'black'}
                            className='icon' />
                        <p>일정</p>
                    </div>
                </Link>
                <Link to="/random-exam-select" style={{ textDecoration: "none" }}>
                    <div className='square' onMouseEnter={handleIcon5MouseEnter} onMouseLeave={handleIcon5MouseLeave}>
                        <FaClipboardList size="60px" color={isMockExamHovered ? 'white' : 'black'} className='icon' />
                        <p>모의고사</p>
                    </div>
                </Link>
                <Link to="/mock-exam-history" style={{ textDecoration: "none" }}>
                    <div className='square' onMouseEnter={handleIcon6MouseEnter} onMouseLeave={handleIcon6MouseLeave}>
                        <FaClipboardCheck size="60px" color={isMockExamHistoryHovered ? 'white' : 'black'} className='icon' />
                        <p>모의고사 기록</p>
                    </div>
                </Link>
            </div>

            {isAdmin !== null && isAdmin && (
             <div className="admin-section">
                <Link to="/admin" style={{ textDecoration: "none" }}>
                    <button className='admin-button'>
                        관리자페이지로 가기
                    </button>
                </Link>
            </div>
            )}
        </div>
    );
}
