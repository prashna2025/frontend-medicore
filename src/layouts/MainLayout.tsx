import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export const MainLayout: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
      <Navbar />
      <main style={{
        flex: 1,
        padding: "2rem 1.5rem",
        maxWidth: "1400px",
        width: "100%",
        margin: "0 auto",
        animation: "fadeInUp 0.35s ease-out"
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
