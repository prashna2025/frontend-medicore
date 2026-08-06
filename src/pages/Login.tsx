import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { Eye, EyeOff, LogIn } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: z.string().min(1, "Please enter your password"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.7rem 0.875rem",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "0.6rem",
  color: "#f1f5f9", fontSize: "0.9rem",
  outline: "none", fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s"
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
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", marginBottom: "0.375rem" }}>
          Welcome Back
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Sign in to your Medicore account</p>
      </div>

      {serverError && (
        <div style={{ padding: "0.75rem 1rem", background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "0.625rem", color: "#fb7185", fontSize: "0.875rem" }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1" }}>Username or Email</label>
          <input
            {...register("username")}
            type="text"
            placeholder="Enter your username"
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {errors.username && <span style={{ color: "#fb7185", fontSize: "0.75rem" }}>{errors.username.message}</span>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              {...register("password")}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: "2.75rem" }}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <button type="button" onClick={() => setShowPw(p => !p)}
              style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#64748b", cursor: "pointer", padding: 0 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span style={{ color: "#fb7185", fontSize: "0.75rem" }}>{errors.password.message}</span>}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to="/forgot-password" style={{ fontSize: "0.8rem", color: "#60a5fa", fontWeight: 500 }}>Forgot password?</Link>
        </div>

        <button type="submit" disabled={isSubmitting} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
          padding: "0.75rem", borderRadius: "0.625rem",
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          color: "white", fontWeight: 700, fontSize: "0.9rem", border: "none",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
          boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
          transition: "all 0.2s"
        }}>
          <LogIn size={16} />
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#64748b" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#60a5fa", fontWeight: 600 }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;
