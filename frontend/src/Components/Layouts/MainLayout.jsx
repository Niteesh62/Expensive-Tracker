// Layout/MainLayout.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const MainLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          marginLeft: "250px",
          padding: "20px",
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          transition: "background-color var(--transition), color var(--transition)",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;