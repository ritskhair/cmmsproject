import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("cmmsRememberedEmail");

    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const dummyEmail = "admin@cmms.com";
  const dummyPassword = "admin123";

  if (email === dummyEmail && password === dummyPassword) {
    setError("");

    if (rememberMe) {
      localStorage.setItem("cmmsRememberedEmail", email);
    } else {
      localStorage.removeItem("cmmsRememberedEmail");
    }

    showLoginSuccess();
  } else {
    setError("Email atau password salah.");
  }
};
const showLoginSuccess = () => {
  setShowSuccess(true);

  setTimeout(() => {
    navigate("/dashboard");
  }, 1500);
};
  const handleGuestLogin = () => {
  setError("");
  showLoginSuccess();
};

  const handleForgotPassword = () => {
    alert("Fitur reset password belum tersedia.");
  };

  const handleCreateAccount = () => {
    alert("Fitur pembuatan akun belum tersedia.");
  };

  return (
    <main className="login-page">
      <section className="login-container">
        {/* Panel kiri */}
        <div className="login-brand-panel">
          <div className="brand-content">
            <h1 className="brand-title">CMMS</h1>

            <p className="brand-subtitle">
              MAINTENANCE MANAGEMENT SYSTEM
            </p>

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

        {/* Panel kanan */}
        <div className="login-form-panel">
          <div className="login-content">
            <div className="login-heading">
              <h2>Welcome back</h2>

              <p>Sign in to continue to your maintenance workspace.</p>
            </div>

            <form onSubmit={handleSignIn} className="login-form">
              {/* Email */}
              <div className="input-group">
                <label htmlFor="email">Email address</label>

                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              {/* Password */}
              <div className="input-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              {/* Remember me dan Forgot password */}
              <div className="login-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                  />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              {/* Pesan error */}
              {error && <p className="login-error">{error}</p>}

              {/* Tombol login */}
              <div className="login-buttons">
                <button type="submit" className="sign-in-button">
                  Sign in
                </button>

                <button
                  type="button"
                  className="guest-login-button"
                  onClick={handleGuestLogin}
                >
                  Login as Guest
                </button>
              </div>
            </form>

            {/* Register */}
            <button
              type="button"
              className="create-account-button"
              onClick={handleCreateAccount}
            >
              New to CMMS?&nbsp; Create an account
            </button>

            {/* Akun dummy */}
            <div className="dummy-account">
              <strong>Akun Dummy</strong>
              <span>Email: admin@cmms.com</span>
              <span>Password: admin123</span>
            </div>

            {/* Footer */}
            <p className="login-footer">
              © 2026 CMMS • Engineering Maintenance
            </p>
          </div>
        </div>
      </section>
            {showSuccess && (
        <div className="success-overlay">
          <div className="success-notification">
            <div className="success-icon">
              <svg
                viewBox="0 0 52 52"
                aria-hidden="true"
              >
                <circle
                  className="success-circle"
                  cx="26"
                  cy="26"
                  r="25"
                />

                <path
                  className="success-check"
                  d="M14 27 L22 35 L38 18"
                />
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