import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import { User, Mail, Shield, Save, CheckCircle } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.7rem 0.875rem",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "0.625rem",
  color: "#f1f5f9", fontSize: "0.9rem",
  outline: "none", fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s"
};

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
          Profile Settings
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.25rem" }}>
          Manage your personal account information
        </p>
      </div>

      {/* Avatar + Role card */}
      <div style={{
        background: "rgba(255,255,255,0.07)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.11)", borderRadius: "1rem", padding: "1.5rem",
        display: "flex", alignItems: "center", gap: "1.25rem"
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.75rem", fontWeight: 800, color: "white",
          boxShadow: "0 8px 20px rgba(59,130,246,0.35)", flexShrink: 0
        }}>
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "#f8fafc" }}>{user?.name || "Unknown User"}</p>
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{user?.email}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", marginTop: "0.375rem", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 999, padding: "3px 10px" }}>
            <Shield size={12} color="#a78bfa" />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a78bfa" }}>{(user?.role || "USER").replace(/_/g, " ")}</span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div style={{
        background: "rgba(255,255,255,0.07)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.11)", borderRadius: "1rem", padding: "1.75rem"
      }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "1.25rem" }}>Edit Information</h2>

        {error && (
          <div style={{ padding: "0.75rem 1rem", background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "0.625rem", color: "#fb7185", fontSize: "0.875rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "0.625rem", color: "#34d399", fontSize: "0.875rem", marginBottom: "1rem" }}>
            <CheckCircle size={16} /> Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <User size={14} /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
            <button type="submit" disabled={loading} style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.625rem 1.5rem", borderRadius: "0.625rem",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: "white", fontWeight: 700, fontSize: "0.9rem", border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
              transition: "all 0.2s"
            }}>
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
