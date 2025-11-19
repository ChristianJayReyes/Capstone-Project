import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppContext } from "../context/AppContext";
import Swal from "sweetalert2";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForm, setShowForm] = useState(true);

  // Signup states
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Captcha
  const [captchaToken, setCaptchaToken] = useState("");

  // OTP states
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Eye icon states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAppContext();

  // Catch Google login and password reset token
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const user = params.get("user");

    // Check if this is a password reset token (from email link)
    // Reset password URLs have token but no user parameter
    if (location.pathname === "/reset-password" && token && !user) {
      setResetToken(token);
      setShowResetPassword(true);
      setIsLogin(true);
      setShowForm(true);
      // Clean URL but keep the path
      window.history.replaceState({}, document.title, "/reset-password");
      return;
    }

    // Handle Google OAuth callback
    if (token && user && user !== "undefined") {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(user));
        loginUser(parsedUser, token);
        setShowForm(false);
        Swal.fire({
          icon: "success",
          title: "Logged in with Google!",
          text: "Welcome back!",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });

        // Clean URL
        window.history.replaceState({}, document.title, "/");
      } catch (err) {
        console.error("LoginForm Google parse error:", err);
      }
    }
  }, [location, loginUser, navigate]);

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");

    try {
      const res = await fetch("https://rosario-resort-and-hotel.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email: signupEmail,
          password,
        }),
      });
      const data = await res.json();
      data.success
        ? (alert("✅ Signup success! Please login now."), setIsLogin(true))
        : setError(data.message);
    } catch {
      setError("Something went wrong");
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // If you want to check admin first
      const adminRes = await fetch(
        "https://rosario-resort-and-hotel.vercel.app/api/auth/admin-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        }
      );
      const adminData = await adminRes.json();
      if (adminData.success) {
        localStorage.setItem("token", adminData.token);
        localStorage.setItem("user", JSON.stringify(adminData.user));
        alert("Admin Login Successfully!");
        navigate("/owner");
        return;
      }

      // Only try regular login if not admin
      const userRes = await fetch("https://rosario-resort-and-hotel.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          captcha: captchaToken,
        }),
      });
      const userData = await userRes.json();
      if (userData.success) {
        setUserId(userData.user_id);
        setStep(2); // OTP step
        alert("📧 OTP sent to your email");
      } else {
        setError(userData.message); 
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://rosario-resort-and-hotel.vercel.app/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, otp }),
      });
      const data = await res.json();

      if (data.success) {
        loginUser(data.user, data.token);
        setShowForm(false);
        setStep(1);
        setOtp("");
        setUserId(null);
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Welcome back!",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
      } else setError(data.message);
    } catch {
      setError("Something went wrong");
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://rosario-resort-and-hotel.vercel.app/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("Error parsing response:", parseErr);
        setError("Server error: Invalid response from server");
        return;
      }

      if (!res.ok) {
        // Server returned an error status
        setError(data.message || `Server error (${res.status})`);
        return;
      }

      if (data.success) {
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
        setError("");
        {
          setSuccess("Password reset link has been sent to your email!");
          // Show success toast
          Swal.fire({
            icon: "success",
            title: "Email Sent!",
            text: "Password reset link has been sent to your email.",
            timer: 3000,
            showConfirmButton: false,
          });
        }
      } else {
        setError(data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message || "Network error. Please check your connection and try again.");
    }
  };

  // Reset password handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await fetch("https://rosario-resort-and-hotel.vercel.app/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken,
          newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setShowResetPassword(false);
        setResetToken("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsLogin(true);
        
        // Show sweet alert
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful!",
          text: "Your password has been reset successfully. You can now login with your new password.",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#4f46e5",
        }).then(() => {
          // Navigate to login page
          if (location.pathname === "/reset-password") {
            navigate("/login");
            window.history.replaceState({}, document.title, "/login");
          } else {
            setShowForm(true);
          }
        });
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong");
    }
  };

  if (!showForm) return null;

  return (
    <div className="relative flex h-[700px] w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-blue-100 rounded-2xl shadow-2xl">
      {/* Close Icon */}
      <img
        src={assets.closeIcon}
        alt="close"
        className="absolute top-5 right-5 h-6 w-6 cursor-pointer z-30 hover:scale-110 transition"
        onClick={() => setShowForm(false)}
      />

      {/* Sliding Image */}
      <motion.div
        className="absolute top-0 left-0 h-full w-1/2 z-20"
        initial={false}
        animate={{ x: isLogin ? "0%" : "100%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <img
          className="h-full w-full object-cover"
          src={assets.background}
          alt="resort"
        />
      </motion.div>

      {/* FORM SECTION */}
      <div className="absolute inset-0 flex justify-between">
        {/* SIGN-UP SIDE */}
        <div className="flex items-center justify-center w-full md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLogin ? 0 : 1, y: isLogin ? 20 : 0 }}
            transition={{ duration: 0.4 }}
            className={`${
              isLogin ? "hidden md:flex" : "flex"
            } flex-col items-center bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-[380px] border border-white/40`}
          >
            <h1 className="text-5xl font-bold text-blue-600">Welcome!</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mt-3">
              Create an Account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Start your resort experience today
            </p>

            <form
              onSubmit={handleSignup}
              className="mt-8 w-full flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-gray-300 rounded-full px-5 py-3 outline-none text-sm focus:ring-2 focus:ring-indigo-400 shadow-sm"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="border border-gray-300 rounded-full px-5 py-3 outline-none text-sm focus:ring-2 focus:ring-indigo-400 shadow-sm"
                required
              />

              {/* Password Fields */}
              {[
                {
                  label: "Password",
                  state: showPassword,
                  set: setShowPassword,
                  val: password,
                  func: setPassword,
                },
                {
                  label: "Confirm Password",
                  state: showConfirmPassword,
                  set: setShowConfirmPassword,
                  val: confirmPassword,
                  func: setConfirmPassword,
                },
              ].map((field, i) => (
                <div key={i} className="relative">
                  <input
                    type={field.state ? "text" : "password"}
                    placeholder={field.label}
                    value={field.val}
                    onChange={(e) => field.func(e.target.value)}
                    className="border border-gray-300 rounded-full px-5 py-3 pr-12 outline-none text-sm focus:ring-2 focus:ring-indigo-400 shadow-sm w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => field.set(!field.state)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-500"
                  >
                    <img
                      src={field.state ? assets.eyeOpen : assets.eyeClosed}
                      alt="toggle"
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              ))}

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={
                  !password || !confirmPassword || password !== confirmPassword
                }
                className={`mt-4 w-full h-11 rounded-full text-white font-medium text-sm tracking-wide shadow-lg transition-all duration-200 ${
                  !password || !confirmPassword || password !== confirmPassword
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                Sign up
              </button>

              <p className="text-gray-600 text-sm text-center mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-indigo-500 font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </motion.div>
        </div>

        {/* LOGIN SIDE */}
        <div className="flex items-center justify-center w-full md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLogin ? 1 : 0, y: isLogin ? 0 : 20 }}
            transition={{ duration: 0.4 }}
            className={`${
              isLogin ? "flex" : "hidden md:flex"
            } flex-col items-center bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-[380px] border border-white/40`}
          >
            {step === 1 ? (
              <form
                className="w-full flex flex-col items-center"
                onSubmit={handleLogin}
              >
                <h2 className="text-4xl font-bold text-blue-600">
                  Welcome Back
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Continue your stay with us
                </p>

                <a
                  href="https://rosario-resort-and-hotel.vercel.app/api/auth/google"
                  className="w-full"
                >
                  <button
                    type="button"
                    className="w-full mt-6 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium px-6 py-3 rounded-full hover:opacity-90 shadow-md transition"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        alt="Google"
                        className="h-5 w-5"
                      />
                      <span>Sign in with Google</span>
                    </div>
                  </button>
                </a>

                <div className="flex items-center gap-4 w-full my-6">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <p className="text-sm text-gray-400">or</p>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-full border border-gray-300 outline-none text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <div className="relative w-full mt-4">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-5 py-3 rounded-full border border-gray-300 outline-none text-sm text-gray-700 pr-10 shadow-sm focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-500"
                  >
                    <img
                      src={
                        showLoginPassword ? assets.eyeOpen : assets.eyeClosed
                      }
                      alt="Toggle password"
                      className="h-5 w-5"
                    />
                  </button>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button
                  type="submit"
                  className="mt-8 w-full h-11 rounded-full text-white font-medium bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300/50 shadow-md transition"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="mt-2 text-sm text-indigo-500 hover:underline"
                >
                  Forgot Password?
                </button>

                <div>
                  <ReCAPTCHA
                    sitekey="6LcMAQUsAAAAACl5v2ZO4Y-WZuzWLQ6XzeRa0TVJ"
                    onChange={(token) => setCaptchaToken(token)}
                  />
                </div>

                <p className="text-gray-600 text-sm mt-6">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-indigo-500 font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              // OTP FORM
              <form
                className="w-full flex flex-col items-center transition-all"
                onSubmit={handleVerifyOtp}
              >
                <h2 className="text-3xl font-semibold text-indigo-600">
                  Verify OTP
                </h2>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Enter the 6-digit code we sent to your email
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mt-6 px-5 py-3 text-center text-lg tracking-widest rounded-full border border-gray-300 outline-none text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-400"
                  required
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button
                  type="submit"
                  className="mt-6 w-full h-11 rounded-full text-white font-medium bg-indigo-500 hover:bg-indigo-600 shadow-md transition"
                >
                  Verify OTP
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] max-w-[90vw] relative"
          >
            <img
              src={assets.closeIcon}
              alt="close"
              className="absolute top-4 right-4 h-5 w-5 cursor-pointer hover:scale-110 transition"
              onClick={() => {
                setShowForgotPassword(false);
                setForgotPasswordEmail("");
                setError("");
                setSuccess("");
              }}
            />
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-full border border-gray-300 outline-none text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-400"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <button
                type="submit"
                className="w-full h-11 rounded-full text-white font-medium bg-indigo-500 hover:bg-indigo-600 shadow-md transition mt-2"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail("");
                  setError("");
                  setSuccess("");
                }}
                className="text-sm text-gray-500 hover:text-indigo-500"
              >
                Back to Login
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] max-w-[90vw] relative"
          >
            <img
              src={assets.closeIcon}
              alt="close"
              className="absolute top-4 right-4 h-5 w-5 cursor-pointer hover:scale-110 transition"
              onClick={() => {
                setShowResetPassword(false);
                setResetToken("");
                setNewPassword("");
                setConfirmNewPassword("");
                setError("");
                setSuccess("");
              }}
            />
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter your new password below.
            </p>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-full border border-gray-300 outline-none text-sm text-gray-700 pr-10 shadow-sm focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-500"
                >
                  <img
                    src={showNewPassword ? assets.eyeOpen : assets.eyeClosed}
                    alt="Toggle password"
                    className="h-5 w-5"
                  />
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-full border border-gray-300 outline-none text-sm text-gray-700 pr-10 shadow-sm focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-500"
                >
                  <img
                    src={showConfirmNewPassword ? assets.eyeOpen : assets.eyeClosed}
                    alt="Toggle password"
                    className="h-5 w-5"
                  />
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <button
                type="submit"
                disabled={!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword}
                className={`w-full h-11 rounded-full text-white font-medium shadow-md transition mt-2 ${
                  !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setResetToken("");
                  setNewPassword("");
                  setConfirmNewPassword("");
                  setError("");
                  setSuccess("");
                }}
                className="text-sm text-gray-500 hover:text-indigo-500"
              >
                Cancel
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
