import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Bottom_nav.css";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineMenuBook } from "react-icons/md";
import { PiNotepadBold } from "react-icons/pi";
import { IoPersonSharp } from "react-icons/io5";

function Bottom_nav() {
  const navItems = [
    {
      path: "/",
      label: "홈",
      icon: <AiFillHome size="30px" />,
    },
    {
      path: "/my-voca",
      label: "나의 단어장",
      icon: <MdOutlineMenuBook size="30px" />,
    },
    {
      path: "/grades",
      label: "성적결과",
      icon: <PiNotepadBold size="30px" />,
    },
    {
      path: "/mypage",
      label: "마이페이지",
      icon: <IoPersonSharp size="30px" />,
    },
  ];

  const navigate = useNavigate();
  const handleNavClick = (path) => {
    navigate(path, { state: { userId: "defaultUserId" } }); // userId를 상태로 전달
  };

  return (
    <nav className="Bottom-container">
      <ul className="Bottom-nav">
        {navItems.map((item, index) => (
          <li key={index} className="Bt-item">
            <div
              onClick={() => handleNavClick(item.path)}
              className="Bt-link"
            >
              <div className="Bt-icon">{item.icon}</div>
              <p>{item.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Bottom_nav;
