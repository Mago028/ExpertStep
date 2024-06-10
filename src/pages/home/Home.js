import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { BsPencilSquare } from "react-icons/bs";
import { FaFileWord } from "react-icons/fa";
import { MdOutlineSmsFailed } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";

export default function Home() {
    const [isProblemHovered, setIsProblemHovered] = useState(false);
    const [isWordHovered, setIsWordHovered] = useState(false);
    const [isWrongHovered, setIsWrongHovered] = useState(false);
    const [isCalendarHovered, setIsCalendarHovered] = useState(false);

    const userId = "defaultUserId"; // 실제 userId를 여기서 가져오거나 설정

    const handleIcon1MouseEnter = () => {
        setIsProblemHovered(true);
    };

    const handleIcon1MouseLeave = () => {
        setIsProblemHovered(false);
    };

    const handleIcon2MouseEnter = () => {
        setIsWordHovered(true);
    };

    const handleIcon2MouseLeave = () => {
        setIsWordHovered(false);
    };

    const handleIcon3MouseEnter = () => {
        setIsWrongHovered(true);
    };

    const handleIcon3MouseLeave = () => {
        setIsWrongHovered(false);
    };

    const handleIcon4MouseEnter = () => {
        setIsCalendarHovered(true);
    };

    const handleIcon4MouseLeave = () => {
        setIsCalendarHovered(false);
    };

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
                        <p>문제</p>
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
                <Link
                    to={{
                        pathname: "/Wrong",
                        state: { userId } // userId를 전달
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
                        <p>오답</p>
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
            </div>
        </div>
    );
}
