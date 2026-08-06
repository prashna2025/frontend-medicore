import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  Users, Stethoscope, Calendar, CreditCard,
  Building2, UserCheck, FileText, Activity,
  TrendingUp, CheckCircle2, Clock, Shield
} from "lucide-react";

const statCards = [
  { label: "Total Patients",    icon: Users,        color: "#3b82f6", bg: "rgba(59,130,246,0.15)",   link: "/patients" },
  { label: "Doctors",          icon: Stethoscope,  color: "#8b5cf6", bg: "rgba(139,92,246,0.15)",   link: "/doctors" },
  { label: "Appointments",     icon: Calendar,     color: "#06b6d4", bg: "rgba(6,182,212,0.15)",    link: "/appointments" },
  { label: "Billing & Invoices",icon: CreditCard,  color: "#10b981", bg: "rgba(16,185,129,0.15)",   link: "/billing" },
  { label: "Departments",      icon: Building2,    color: "#f59e0b", bg: "rgba(245,158,11,0.15)",   link: "/departments" },
  { label: "Staff",            icon: UserCheck,    color: "#f43f5e", bg: "rgba(244,63,94,0.15)",    link: "/staff" },
  { label: "Consultations",    icon: FileText,     color: "#a78bfa", bg: "rgba(167,139,250,0.15)",  link: "/consultations" },
  { label: "System Status",    icon: Activity,     color: "#34d399", bg: "rgba(52,211,153,0.15)",   link: "/dashboard" },
];

const quickLinks = [
  { label: "New Appointment",  icon: Calendar,    link: "/appointments/new",  color: "#3b82f6" },
  { label: "New Patient",      icon: Users,       link: "/patients/new",      color: "#8b5cf6" },
  { label: "Generate Invoice", icon: CreditCard,  link: "/billing/new",       color: "#10b981" },
  { label: "New Consultation", icon: FileText,    link: "/consultations/new", color: "#f59e0b" },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Hero welcome section */}
      <div style={{
        background: "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.18) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "1.25rem",
        padding: "2rem",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)" }} />
        <div style={{ position: "relative" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{greeting} ??</p>
          <h1 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
            Welcome back, {user?.name || "User"}!
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Here's your hospital management overview for today.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 999, padding: "4px 12px" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}>System Online</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 999, padding: "4px 12px" }}>
              <Shield size={12} color="#a78bfa" />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#a78bfa" }}>{(user?.role || "USER").replace(/_/g, " ")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Quick Actions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
          {quickLinks.map(q => {
            const Icon = q.icon;
            return (
              <Link key={q.link} to={q.link} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: "0.625rem", padding: "1.25rem 1rem",
                background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem",
                color: "white", textDecoration: "none", textAlign: "center",
                transition: "all 0.2s", cursor: "pointer"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: "0.75rem", background: `${q.color}22`, border: `1px solid ${q.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={22} color={q.color} />
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#e2e8f0" }}>{q.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Navigation tiles */}
      <div>
        <h2 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Modules
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {statCards.map(s => {
            const Icon = s.icon;
            return (
              <Link key={s.link} to={s.link} style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1.25rem",
                background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem",
                textDecoration: "none", transition: "all 0.2s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = s.bg; (e.currentTarget as HTMLElement).style.borderColor = `${s.color}44`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: "0.75rem", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={s.color} />
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#e2e8f0" }}>{s.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System info */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        padding: "1rem 1.25rem",
        background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: "0.875rem", backdropFilter: "blur(8px)"
      }}>
        <CheckCircle2 size={18} color="#34d399" />
        <span style={{ fontSize: "0.875rem", color: "#86efac" }}>
          Backend API connected — JWT session active. All services operational.
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.375rem", color: "#94a3b8", fontSize: "0.75rem" }}>
          <Clock size={13} />
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
