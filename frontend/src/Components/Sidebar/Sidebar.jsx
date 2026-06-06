import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMoneyBillWave,
  FaPlane,
  FaClipboardCheck,
  FaCog,
  FaHeadset,
  FaMoon,
  FaSun,
  FaSignOutAlt,
} from "react-icons/fa";
import { ThemeContext } from "../../ThemeContext";
import { AuthContext } from "../../AuthContext";
import "../Sidebar/Sidebar.css";

function Sidebar() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="profile">
        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
          className="avatar"
        />
        <h3>{currentUser?.name || currentUser?.email || 'Expense User'}</h3>
        {currentUser && (
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>

      <nav>
        <NavLink to="/home" className="menu-item">
          <FaHome />
          <span>Home</span>
        </NavLink>

        <NavLink to="/expenses" className="menu-item">
          <FaMoneyBillWave />
          <span>Expenses</span>
        </NavLink>

        <NavLink to="/trips" className="menu-item">
          <FaPlane />
          <span>Trips</span>
        </NavLink>

        <NavLink to="/approvals" className="menu-item">
          <FaClipboardCheck />
          <span>Approvals</span>
        </NavLink>

        <NavLink to="/settings" className="menu-item">
          <FaCog />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/support" className="menu-item">
          <FaHeadset />
          <span>Support</span>
        </NavLink>
      </nav>

      <div className="theme-toggle">
        <button
          className="theme-btn"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="logo">EXPENSIO</div>
    </aside>
  );
}

export default Sidebar;