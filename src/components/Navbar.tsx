import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  HeartPulse, LogOut, User, LayoutDashboard, Users,
  Stethoscope, Building2, Calendar, FileText, CreditCard,
  UserCheck, Menu, X, ChevronDown
} from "lucide-react";

/* ---- Nav items — role filtering logic UNCHANGED ---- */
const allNavItems = [
  { name: "Dashboard",    path: "/dashboard",     icon: LayoutDashboard, roles: ["SUPER_ADMIN","ADMIN","RECEPTIONIST","DOCTOR","PATIENT"] },
  { name: "Patients",     path: "/patients",      icon: Users,           roles: ["SUPER_ADMIN","ADMIN","RECEPTIONIST","DOCTOR"] },
  { name: "Doctors",      path: "/doctors",       icon: Stethoscope,     roles: ["SUPER_ADMIN","ADMIN","RECEPTIONIST","DOCTOR"] },
  { name: "Departments",  path: "/departments",   icon: Building2,       roles: ["SUPER_ADMIN","ADMIN","RECEPTIONIST"] },
  { name: "Appointments", path: "/appointments",  icon: Calendar,        roles: ["SUPER_ADMIN","ADMIN","RECEPTIONIST","DOCTOR","PATIENT"] },
  { name: "Consultations",path: "/consultations", icon: FileText,        roles: ["SUPER_ADMIN","ADMIN","DOCTOR","PATIENT"] },
  { name: "Billing",      path: "/billing",       icon: CreditCard,      roles: ["SUPER_ADMIN","ADMIN","RECEPTIONIST","PATIENT"] },
  { name: "Staff",        path: "/staff",         icon: UserCheck,       roles: ["SUPER_ADMIN","ADMIN"] },
];

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const role = user?.role || "PATIENT";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* ---- Role filtering logic UNCHANGED ---- */
  const visibleItems = allNavItems.filter(item =>
    role === "SUPER_ADMIN" || item.roles.includes(role)
  );

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <>
      {/* ===== TOP HEADER ===== */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
      }}>
        <div style={{
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px"
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{
              width: 32, height: 32,
              background: "#0891b2",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <HeartPulse size={18} color="#fff" />
            </div>
            <span style={{
              fontWeight: 800,
              fontSize: "1.125rem",
              color: "#0891b2",
              letterSpacing: "-0.03em"
            }}>Medicore</span>
          </Link>

          {/* Desktop nav links */}
          {isAuthenticated && (
            <nav style={{
              display: "flex", alignItems: "center", gap: "0.125rem",
              overflow: "hidden"
            }} className="desktop-nav">
              {visibleItems.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={({ isActive }) => ({
                      display: "flex", alignItems: "center", gap: "0.375rem",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      color: isActive ? "#0891b2" : "#475569",
                      background: isActive ? "#f0fdff" : "transparent",
                      transition: "all 150ms ease",
                      whiteSpace: "nowrap"
                    })}
                    onMouseEnter={e => {
                      const el = e.currentTarget;
                      if (!el.getAttribute("aria-current")) {
                        el.style.background = "#f8fafc";
                        el.style.color = "#0f172a";
                      }
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget;
                      if (!el.getAttribute("aria-current")) {
                        el.style.background = "transparent";
                        el.style.color = "#475569";
                      }
                    }}
                  >
                    <Icon size={14} />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* Right: user area */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {isAuthenticated ? (
              <>
                {/* Profile button */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setProfileOpen(p => !p)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.35rem 0.625rem", borderRadius: "8px",
                      background: "#f8fafc", border: "1px solid #e2e8f0",
                      cursor: "pointer", transition: "background 150ms",
                      color: "#0f172a"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#f8fafc")}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "#cffafe", color: "#0e7490",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "0.75rem"
                    }}>
                      {initials}
                    </div>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 500, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.name || user?.username}
                    </span>
                    <ChevronDown size={13} style={{ color: "#94a3b8" }} />
                  </button>

                  {profileOpen && (
                    <div style={{
                      position: "absolute", right: 0, top: "calc(100% + 6px)",
                      background: "#fff", border: "1px solid #e2e8f0",
                      borderRadius: 10, padding: "0.375rem",
                      minWidth: 188,
                      boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
                      zIndex: 300
                    }}>
                      {/* User info header */}
                      <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid #f1f5f9", marginBottom: "0.25rem" }}>
                        <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0f172a" }}>{user?.name}</p>
                        <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: 2 }}>{role.replace(/_/g, " ")}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.45rem 0.75rem", borderRadius: 6,
                          color: "#475569", fontSize: "0.8125rem",
                          textDecoration: "none", transition: "background 150ms"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <User size={14} /> Profile Settings
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.45rem 0.75rem", borderRadius: 6,
                          color: "#dc2626", fontSize: "0.8125rem",
                          background: "transparent", border: "none",
                          width: "100%", cursor: "pointer", transition: "background 150ms"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#fee2e2")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileOpen(o => !o)}
                  style={{
                    display: "none", padding: "0.35rem", borderRadius: 6,
                    background: "#f8fafc", border: "1px solid #e2e8f0",
                    cursor: "pointer", color: "#475569"
                  }}
                  className="mobile-menu-btn"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link to="/login" style={{
                  padding: "0.4rem 0.875rem", borderRadius: 6,
                  border: "1px solid #e2e8f0", color: "#475569",
                  fontSize: "0.875rem", fontWeight: 500, textDecoration: "none"
                }}>Log In</Link>
                <Link to="/register" style={{
                  padding: "0.4rem 0.875rem", borderRadius: 6,
                  background: "#0891b2", color: "#fff",
                  fontSize: "0.875rem", fontWeight: 600, textDecoration: "none"
                }}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== MOBILE DRAWER ===== */}
      {mobileOpen && isAuthenticated && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(15,23,42,0.3)" }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: 260,
              background: "#fff", borderRight: "1px solid #e2e8f0",
              padding: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem",
              overflowY: "auto"
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", marginBottom: "0.75rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
              <HeartPulse size={18} color="#0891b2" />
              <span style={{ fontWeight: 800, color: "#0891b2" }}>Medicore</span>
            </div>
            {visibleItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    display: "flex", alignItems: "center", gap: "0.625rem",
                    padding: "0.6rem 0.875rem", borderRadius: 8,
                    fontSize: "0.875rem", fontWeight: 500,
                    color: isActive ? "#0891b2" : "#475569",
                    background: isActive ? "#f0fdff" : "transparent",
                    textDecoration: "none", transition: "all 150ms"
                  })}
                >
                  <Icon size={17} /> {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* Profile dropdown backdrop */}
      {profileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }} onClick={() => setProfileOpen(false)} />
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
