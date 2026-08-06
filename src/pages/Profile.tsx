import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import { User, Mail, Shield, Save, CheckCircle, AlertCircle } from "lucide-react";

const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "0.3rem" };
const labelStyle: React.CSSProperties = { fontSize: "0.8125rem", fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", gap: "0.375rem" };
const inp: React.CSSProperties = {
  padding: "0.6rem 0.75rem", background: "#fff",
  border: "1px solid #cbd5e1", borderRadius: 8,
  fontSize: "0.875rem", color: "#0f172a", outline: "none",
  fontFamily: "Inter, sans-serif", width: "100%",
  transition: "border-color 150ms, box-shadow 150ms"
};
const onFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = "#0891b2"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(8,145,178,0.10)"; };
const onBlur = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "none"; };

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---- handleSubmit logic UNCHANGED ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile({ name, email });
      if (updateUser) updateUser(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() || "U";

  return (
    <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Profile Settings</h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.2rem" }}>Manage your account information</p>
      </div>

      {/* User card */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.125rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#cffafe", color: "#0e7490", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.25rem", flexShrink: 0, border: "2px solid #a5f3fc" }}>
          {initials}
        </div>
        <div>
          <p style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#0f172a" }}>{user?.name || "—"}</p>
          <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>{user?.email}</p>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", marginTop: "0.3rem", padding: "2px 10px", background: "#f0fdff", border: "1px solid #a5f3fc", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, color: "#0e7490" }}>
            <Shield size={11} /> {(user?.role || "USER").replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "0.75rem 1.5rem", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Edit Information</p>
        </div>
        <div style={{ padding: "1.5rem" }}>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 0.875rem", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, color: "#991b1b", fontSize: "0.875rem", marginBottom: "1rem" }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 0.875rem", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, color: "#15803d", fontSize: "0.875rem", marginBottom: "1rem" }}>
              <CheckCircle size={16} /> Profile updated successfully!
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}><User size={13} /> Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={inp} onFocus={onFocus} onBlur={onBlur} required />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}><Mail size={13} /> Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inp} onFocus={onFocus} onBlur={onBlur} required />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
              <button type="submit" disabled={loading} style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.6rem 1.375rem", borderRadius: 8,
                background: "#0891b2", color: "#fff",
                fontWeight: 700, fontSize: "0.875rem", border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.65 : 1, transition: "background 150ms"
              }}>
                <Save size={15} /> {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
