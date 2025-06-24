import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react"; // Icons for inputs
import { useUserStore } from "../store/useUserStore";

function SignUpPage() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { signUp, loading } = useUserStore();

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handles form submission (simplified)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    signUp(formData);
  };

  // Framer Motion Variants for animations
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring", // Use spring for a bouncier feel
        damping: 10,
        stiffness: 100,
        when: "beforeChildren", // Animate container before its children
        staggerChildren: 0.1 // Stagger children animations by 0.1 seconds
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
            Join TrendCart!
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <motion.div className="form-control mb-4" variants={itemVariants}>
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
                  <User className="size-4 text-primary" /> Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </motion.div>

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
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6} // Example: enforce minimum password length
              />
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div className="form-control mb-6" variants={itemVariants}>
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base-content/80 font-semibold">
                  <Lock className="size-4 text-primary" /> Confirm Password {/* Changed icon to Lock for consistency */}
                </span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
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
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </motion.div>
          </form>

          {/* Link to Login Page */}
          <motion.p className="text-center mt-6 text-sm text-base-content/70" variants={itemVariants}>
            Already have an account?{" "}
            <Link to="/login" className="link link-hover text-secondary font-semibold">
              Login here
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUpPage;
