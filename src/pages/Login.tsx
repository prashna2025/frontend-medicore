import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: z.string().min(1, "Please enter your password"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

/* --- Input style helper --- */
const inp: React.CSSProperties = {
  width: "100%", padding: "0.6rem 0.75rem",
  background: "#fff", border: "1px solid #cbd5e1", borderRadius: 8,
  fontSize: "0.875rem", color: "#0f172a", outline: "none",
  fontFamily: "Inter, sans-serif", transition: "border-color 150ms, box-shadow 150ms"
};

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" }
  });

  /* ---- onSubmit logic UNCHANGED ---- */
  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const response = await authService.login({ username: values.username, password: values.password, email: values.username });
      login(response.token, response.user || response);
      navigate(from, { replace: true });
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Sign In</h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>Access your Medicore account</p>
      </div>

      {serverError && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", padding: "0.75rem 0.875rem", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, color: "#991b1b", fontSize: "0.875rem" }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#475569" }}>Username</label>
          <input {...register("username")} type="text" placeholder="Enter your username" style={inp}
            onFocus={e => { e.currentTarget.style.borderColor = "#0891b2"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(8,145,178,0.10)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {errors.username && <span style={{ color: "#dc2626", fontSize: "0.75rem" }}>{errors.username.message}</span>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#475569" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input {...register("password")} type={showPw ? "text" : "password"} placeholder="••••••••" style={{ ...inp, paddingRight: "2.75rem" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#0891b2"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(8,145,178,0.10)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <button type="button" onClick={() => setShowPw(p => !p)}
              style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span style={{ color: "#dc2626", fontSize: "0.75rem" }}>{errors.password.message}</span>}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to="/forgot-password" style={{ fontSize: "0.8125rem", color: "#0891b2", fontWeight: 500 }}>Forgot password?</Link>
        </div>

        <button type="submit" disabled={isSubmitting} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
          padding: "0.65rem", borderRadius: 8,
          background: "#0891b2", color: "#fff",
          fontWeight: 700, fontSize: "0.9rem", border: "none",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
          transition: "background 150ms"
        }}
        onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = "#0e7490"; }}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#0891b2"}
        >
          <LogIn size={16} />
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "#64748b" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#0891b2", fontWeight: 600, textDecoration: "none" }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;
