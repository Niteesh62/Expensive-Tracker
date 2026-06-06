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
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;