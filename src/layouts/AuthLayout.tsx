import React from "react";
import { Outlet, Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export const AuthLayout: React.FC = () => (
  <div style={{
    minHeight: "100vh",
    background: "linear-gradient(160deg, #f0fdff 0%, #f8fafc 60%, #f0f9ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem"
  }}>
    <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", textDecoration: "none" }}>
        <div style={{ width: 40, height: 40, background: "#0891b2", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(8,145,178,0.25)" }}>
          <HeartPulse size={22} color="#fff" />
        </div>
        <span style={{ fontWeight: 800, fontSize: "1.4rem", color: "#0891b2", letterSpacing: "-0.03em" }}>Medicore</span>
      </Link>

      {/* Card */}
      <div style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: "2rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)"
      }}>
        <Outlet />
      </div>

      <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94a3b8" }}>
        &copy; {new Date().getFullYear()} Medicore Hospital Management System
      </p>
    </div>
  </div>
);

export default AuthLayout;
