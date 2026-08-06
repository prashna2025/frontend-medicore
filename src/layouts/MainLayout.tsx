import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export const MainLayout: React.FC = () => (
  <div style={{ minHeight: "100vh", background: "var(--c-bg)", display: "flex", flexDirection: "column" }}>
    <Navbar />
    <main style={{
      flex: 1,
      padding: "2rem 1.5rem",
      maxWidth: "var(--content-max)",
      width: "100%",
      margin: "0 auto"
    }}>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
