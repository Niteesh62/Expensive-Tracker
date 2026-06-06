import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaMoneyBillWave,
  FaPlane,
  FaClipboardCheck,
  FaCog,
  FaHeadset,
} from "react-icons/fa";
import "../Sidebar/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="profile">
        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
          className="avatar"
        />
        <h3>Janice Chandler</h3>
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

      <div className="logo">EXPENSIO</div>
    </aside>
  );
}

export default Sidebar;