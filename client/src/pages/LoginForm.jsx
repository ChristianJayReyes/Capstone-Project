import React, { useState } from "react";
import { motion } from "framer-motion";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative flex h-[700px] w-full overflow-hidden bg-gray-50">
      {/* Background: Both forms side by side */}
      <div className="absolute inset-0 flex">
        {/* Left = Sign Up Form */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-4xl font-medium text-gray-900">Sign up</h2>
            <p className="text-sm text-gray-500/90 mt-3">
              Create your account to get started
            </p>
            <form className="mt-8 w-80 flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border border-gray-300 rounded-full px-4 py-2 outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-full px-4 py-2 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 rounded-full px-4 py-2 outline-none"
                required
              />
              <button
                type="submit"
                className="mt-4 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
              >
                Sign up
              </button>
              <p className="text-gray-500/90 text-sm mt-4 text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-indigo-400 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Right = Sign In Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <form className="md:w-96 w-80 flex flex-col items-center justify-center">
            <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
            <p className="text-sm text-gray-500/90 mt-3">
              Welcome back! Please sign in to continue
            </p>

            <button
              type="button"
              className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
            >
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                alt="googleLogo"
              />
            </button>

            <div className="flex items-center gap-4 w-full my-5">
              <div className="w-full h-px bg-gray-300/90"></div>
              <p className="w-full text-nowrap text-sm text-gray-500/90">
                or sign in with email
              </p>
              <div className="w-full h-px bg-gray-300/90"></div>
            </div>

            <input
              type="email"
              placeholder="Email id"
              className="w-full px-4 h-12 rounded-full border border-gray-300 outline-none text-sm text-gray-600"
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mt-4 px-4 h-12 rounded-full border border-gray-300 outline-none text-sm text-gray-600"
              required
            />

            <div className="w-full flex items-center justify-between mt-6 text-gray-500/80">
              <div className="flex items-center gap-2">
                <input className="h-5" type="checkbox" id="checkbox" required />
                <label className="text-sm" htmlFor="checkbox">
                  Remember me
                </label>
              </div>
              <a className="text-sm underline" href="#">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="mt-8 w-50 h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
            >
              Login
            </button>

            <p className="text-gray-500/90 text-sm mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-indigo-400 hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Sliding Image Panel */}
      <motion.div
        className="absolute top-0 left-0 h-full w-1/2 z-20" // keep it above the form
        initial={false}
        animate={{ x: isLogin ? "0%" : "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <img
          className="h-full w-full object-cover opacity-100" // ensure it's fully visible
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="Slide Panel"
        />
      </motion.div>
    </div>
  );
};

export default LoginForm;
