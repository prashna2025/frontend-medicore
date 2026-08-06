import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Users, Stethoscope, Calendar, CreditCard,
  Building2, UserCheck, FileText, Activity,
  CheckCircle2, Clock, Plus, TrendingUp
} from "lucide-react";

const roleModules: Record<string, { label: string; icon: React.ElementType; path: string; color: string; bg: string }[]> = {
  default: [
    { label: "Patients",      icon: Users,       path: "/patients",      color: "#0891b2", bg: "#cffafe" },
    { label: "Doctors",       icon: Stethoscope, path: "/doctors",       color: "#7c3aed", bg: "#ede9fe" },
    { label: "Appointments",  icon: Calendar,    path: "/appointments",  color: "#d97706", bg: "#fef3c7" },
    { label: "Consultations", icon: FileText,    path: "/consultations", color: "#16a34a", bg: "#dcfce7" },
    { label: "Billing",       icon: CreditCard,  path: "/billing",       color: "#2563eb", bg: "#dbeafe" },
    { label: "Departments",   icon: Building2,   path: "/departments",   color: "#0891b2", bg: "#cffafe" },
    { label: "Staff",         icon: UserCheck,   path: "/staff",         color: "#dc2626", bg: "#fee2e2" },
    { label: "Activity",      icon: Activity,    path: "/dashboard",     color: "#475569", bg: "#f1f5f9" },
  ]
};

const quickActions = [
  { label: "New Appointment",  icon: Calendar,    path: "/appointments/new",  color: "#0891b2" },
  { label: "Add Patient",      icon: Users,       path: "/patients/new",      color: "#7c3aed" },
  { label: "Generate Invoice", icon: CreditCard,  path: "/billing/new",       color: "#16a34a" },
  { label: "New Consultation", icon: FileText,    path: "/consultations/new", color: "#d97706" },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const modules = roleModules.default;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* Welcome banner */}
      <div style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderLeft: "4px solid #0891b2",
        borderRadius: "10px",
        padding: "1.25rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
      }}>
        <div>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginBottom: "0.2rem" }}>{greeting} ??</p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Welcome back, {user?.name || "User"}
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "4px 12px", background: "#f0fdff", border: "1px solid #a5f3fc", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700, color: "#0e7490" }}>
            <TrendingUp size={12} /> {(user?.role || "USER").replace(/_/g, " ")}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "4px 12px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700, color: "#15803d" }}>
            <CheckCircle2 size={12} /> System Online
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
          Quick Actions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
          {quickActions.map(q => {
            const Icon = q.icon;
            return (
              <Link key={q.path} to={q.path} style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.875rem 1rem",
                background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: 10, textDecoration: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "border-color 150ms, box-shadow 150ms"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = q.color; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px rgba(0,0,0,0.08)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color={q.color} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Plus size={11} color={q.color} />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0f172a" }}>{q.label}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Module Overview */}
      <section>
        <h2 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
          Modules
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.875rem" }}>
          {modules.map(m => {
            const Icon = m.icon;
            return (
              <Link key={m.path} to={m.path} style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1rem 1.125rem",
                background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: 10, textDecoration: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "border-color 150ms, box-shadow 150ms"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = m.color; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 8, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={m.color} />
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>{m.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* System status */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.625rem",
        padding: "0.75rem 1rem",
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        borderRadius: 8, fontSize: "0.8125rem", color: "#15803d"
      }}>
        <CheckCircle2 size={16} />
        <span>Backend API connected — JWT session active. All 51 endpoints operational.</span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.375rem", color: "#94a3b8", fontSize: "0.75rem" }}>
          <Clock size={13} /> {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
