import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLandingPath, saveAuthSession, type UserRole } from "../../utils/auth";
import { apiRequest, type AccountLoginResponse, type OperatorLoginResponse } from "../../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState(() => localStorage.getItem("cmmsRememberedEmail") ?? "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem("cmmsRememberedEmail")));
  const [error, setError] = useState("");
  const [operatorError, setOperatorError] = useState("");

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const result = await apiRequest<AccountLoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      });
      const role = result.role as UserRole;
      saveAuthSession(role, email, role, result.token);

      setShowSuccess(true);
      setTimeout(() => {
        navigate(getLandingPath(role));
      }, 1500);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Login gagal.");
    }
  };

  const handleOperatorLogin = async () => {
    setOperatorError("");

    try {
      const result = await apiRequest<OperatorLoginResponse>("/auth/operator", {
        method: "POST",
      });
      saveAuthSession("operator", "operator", result.role, result.token);
      setShowSuccess(true);
      setTimeout(() => navigate("/operator"), 1500);
    } catch (requestError) {
      setOperatorError(requestError instanceof Error ? requestError.message : "Login operator gagal.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-brand-panel">
          <div className="brand-content">
            <div className="login-brand-row">
              <img className="login-brand-logo" src="/Logo SAMKO.jpeg" alt="SAMKO" />
              <h1 className="brand-title">CMMS</h1>
            </div>

            <p className="brand-subtitle">COMPUTERIZED MAINTENANCE MANAGEMENT SYSTEM</p>

            <h2 className="brand-heading">
              Control your assets.
              <br />
              Prevent downtime.
              <br />
              Improve reliability.
            </h2>

            <p className="brand-description">
              A connected workspace for engineering, maintenance and asset
              performance.
            </p>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-content">
            <div className="login-heading">
              <h2>Welcome back</h2>
              <p>Sign in to continue to your maintenance workspace.</p>
            </div>

            <form onSubmit={handleSignIn} className="login-form">
              <div className="input-group">
                <label htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Username"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span>Remember me</span>
              </label>

              {error && <p className="login-error" role="alert">{error}</p>}
              {operatorError && <p className="login-error operator-login-error" role="alert">{operatorError}</p>}

              <div className="login-buttons">
                <button type="submit" className="sign-in-button">
                  Sign in
                </button>
                <button
                  type="button"
                  className="operator-login-button"
                  onClick={handleOperatorLogin}
                >
                  Login as Operator
                </button>
              </div>
            </form>

            <p className="login-footer">© 2026 CMMS • Engineering Maintenance</p>
          </div>
        </div>
      </section>

      {showSuccess && (
        <div className="success-overlay">
          <div className="success-notification" role="status" aria-live="polite">
            <div className="success-icon">
              <svg viewBox="0 0 52 52" aria-hidden="true">
                <circle className="success-circle" cx="26" cy="26" r="25" />
                <path className="success-check" d="M14 27 L22 35 L38 18" />
              </svg>
            </div>
            <h2>Berhasil</h2>
            <p>
              Login berhasil dilakukan, silahkan
              <br />
              memulai sesi anda
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
