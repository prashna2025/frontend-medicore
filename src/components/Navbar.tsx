import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  HeartPulse, LogOut, User, LayoutDashboard, Users,
  Stethoscope, Building2, Calendar, FileText, CreditCard,
  UserCheck, Menu, X, ChevronDown
} from "lucide-react";

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

  const visibleItems = allNavItems.filter(item =>
    role === "SUPER_ADMIN" || item.roles.includes(role)
  );

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
      isActive
        ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
        : "text-white/70 hover:text-white hover:bg-white/10"
    }`;

  return (
    <>
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(15,23,42,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)"
      }}>
        {/* Top bar: logo + user */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          height: "56px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{
              padding: "6px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <HeartPulse size={20} color="white" />
            </div>
            <span style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 800,
              fontSize: "1.2rem",
              background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em"
            }}>Medicore</span>
          </Link>

          {/* Right: user actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {isAuthenticated ? (
              <>
                {/* Profile dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setProfileOpen(p => !p)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "6px 12px", borderRadius: "10px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white", cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "0.8rem", color: "white"
                    }}>
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.name || user?.username}
                    </span>
                    <ChevronDown size={14} style={{ opacity: 0.6 }} />
                  </button>

                  {profileOpen && (
                    <div style={{
                      position: "absolute", right: 0, top: "calc(100% + 8px)",
                      background: "rgba(15,23,42,0.95)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12, padding: "0.5rem", minWidth: 180,
                      boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                      zIndex: 100
                    }}>
                      <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "0.25rem" }}>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 2 }}>Signed in as</p>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "white" }}>{user?.name}</p>
                        <p style={{ fontSize: "0.7rem", color: "#60a5fa" }}>{role.replace(/_/g, " ")}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.5rem 0.75rem", borderRadius: 8,
                          color: "#cbd5e1", fontSize: "0.875rem",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <User size={15} /> Profile Settings
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          padding: "0.5rem 0.75rem", borderRadius: 8,
                          color: "#f87171", fontSize: "0.875rem",
                          background: "transparent", border: "none",
                          width: "100%", transition: "all 0.2s", cursor: "pointer"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile hamburger */}
                <button
                  className="md:hidden"
                  onClick={() => setMobileOpen(o => !o)}
                  style={{
                    padding: "6px", borderRadius: 8, background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)", color: "white"
                  }}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link to="/login" style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)",
                  transition: "all 0.2s"
                }}>Log In</Link>
                <Link to="/register" style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: "0.875rem",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  color: "white", fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(59,130,246,0.4)"
                }}>Register</Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation tabs — horizontal scroll on mobile */}
        {isAuthenticated && (
          <nav style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0 1.5rem",
            paddingBottom: "0.5rem",
            overflowX: "auto",
            maxWidth: "1400px",
            margin: "0 auto",
            scrollbarWidth: "none"
          }}
          className="hide-scrollbar"
          >
            {visibleItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} className={navLinkClass}>
                  <Icon size={15} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && isAuthenticated && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)"
        }} onClick={() => setMobileOpen(false)}>
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: 260,
            background: "rgba(15,23,42,0.97)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            padding: "1.5rem 1rem",
            display: "flex", flexDirection: "column", gap: "0.25rem",
            overflowY: "auto"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <HeartPulse size={20} color="#60a5fa" />
                <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#60a5fa" }}>Medicore</span>
              </div>
            </div>
            {visibleItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.625rem 0.875rem", borderRadius: 10,
                    fontSize: "0.9rem", fontWeight: 500,
                    color: isActive ? "white" : "rgba(255,255,255,0.65)",
                    background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
                    transition: "all 0.2s"
                  })}
                >
                  <Icon size={17} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* Close profile dropdown on outside click */}
      {profileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 39 }} onClick={() => setProfileOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
