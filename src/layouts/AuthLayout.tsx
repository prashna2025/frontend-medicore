import React from "react";
import { Outlet, Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export const AuthLayout: React.FC = () => {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      position: "relative",
      zIndex: 1
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem"
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", textDecoration: "none" }}>
          <div style={{
            padding: "10px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(59,130,246,0.4)"
          }}>
            <HeartPulse size={26} color="white" />
          </div>
          <span style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 800, fontSize: "1.6rem",
            background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.03em"
          }}>Medicore</span>
        </Link>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "1.25rem",
          padding: "2rem",
          boxShadow: "0 24px 64px rgba(0,0,0,0.35)"
        }}>
          <Outlet />
        </div>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
          &copy; 2025 Medicore Hospital Management System
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
