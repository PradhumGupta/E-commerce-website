import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react"; // Icons for inputs
import { useUserStore } from "../store/useUserStore";

function LoginPage() {
  // State for email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { logIn, loading } = useUserStore();

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted with:", { email, password });
    logIn({ email, password });
  };

  // Framer Motion Variants for animations (consistent with SignUpPage)
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 120
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-base-200">
      <motion.div
        className="card w-full max-w-md bg-base-100 shadow-xl border border-base-content/10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="card-body p-8">
          <h2
            className="card-title text-3xl font-bold mb-6 text-center
            bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            Welcome Back!
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <motion.div className="form-control mb-4" variants={itemVariants}>
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
                  <Mail className="size-4 text-primary" /> Email
                </span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div className="form-control mb-4" variants={itemVariants}>
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
                  <Lock className="size-4 text-primary" /> Password
                </span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div className="text-right mb-6" variants={itemVariants}>
              <Link to="/forgot-password" className="link link-hover text-sm text-base-content/70 font-semibold">
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div className="form-control mt-6" variants={itemVariants}>
              <button
                type="submit"
                className="btn btn-primary w-full text-lg font-semibold
                shadow-lg hover:shadow-xl transition-all duration-300
                hover:scale-[1.01] active:scale-[0.99]"
                disabled={loading} // Button is always disabled if loading is true
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner" />
                    Logging In...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </motion.div>
          </form>

          {/* Link to Sign Up Page */}
          <motion.p className="text-center mt-6 text-sm text-base-content/70" variants={itemVariants}>
            Don't have an account?{" "}
            <Link to="/signup" className="link link-hover text-secondary font-semibold">
              Sign Up here
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
