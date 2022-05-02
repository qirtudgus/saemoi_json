import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../css/footerbar.css";
import freeboard_color from "../img/자유게시판_컬러.svg";
import freeboard_black from "../img/자유게시판_흑백.svg";

const Footerbar = () => {
  const navigate = useNavigate();

  const goCategory = () => {
    navigate("/category");
  };

  return (
    <nav className="footerBox">
      <div className="footerBar">
        <NavLink
          to="/category"
          className={({ isActive }) =>
            `navCategory ` + (isActive ? "active" : undefined)
          }
        >
          <span className="navIcon"></span>
          <p>카테고리</p>
        </NavLink>

        <NavLink
          to="/comment"
          className={({ isActive }) =>
            `navComment ` + (isActive ? "active" : undefined)
          }
        >
          <span className="navIcon"></span>
          <p>댓글달기</p>
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `navHome ` + (isActive ? "active" : undefined)
          }
        >
          <span className="navIcon"></span>
          <p>홈</p>
        </NavLink>

        <NavLink
          to="/board"
          className={({ isActive }) =>
            `navWrite ` + (isActive ? "active" : undefined)
          }
        >
          <span className="navIcon"></span>
          <p>자유게시판</p>
        </NavLink>

        <NavLink
          to="/mypage"
          className={({ isActive }) =>
            `navMyPage ` + (isActive ? "active" : undefined)
          }
        >
          <span className="navIcon"></span>
          <p>마이페이지</p>
        </NavLink>
      </div>
    </nav>
  );
};

export default Footerbar;
