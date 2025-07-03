import { Link, useResolvedPath } from "react-router-dom"
import {
  ShoppingCartIcon,
  ShoppingBagIcon,
  UserPlusIcon,   // For Sign Up
  LogInIcon,      // For Login
  LogOutIcon,     // For Logout
  LayoutDashboardIcon // For Dashboard
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import { useEffect } from "react";

function NavBar() {
  const { pathname } = useResolvedPath();
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";

  const {cart} = useCartStore();

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4rem] justify-between">
          {/* LOGO SECTION */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="size-9 text-primary" />
                <span
                  className="font-semibold font-mono tracking-widest text-2xl
                  bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                >
                  TrendCart
                </span>
              </div>
            </Link>
          </div>

          {/* NAVIGATION AND USER ACTIONS SECTION */}
          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <ThemeSelector />

            

            {/* Dashboard Button (Admin Only) */}
            {isAdmin && (
              <Link to="/secret-dashboard" className="btn btn-ghost rounded-full px-4 flex items-center gap-2 text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors duration-200">
                <LayoutDashboardIcon className="size-5" />
                Dashboard
              </Link>
            )}

            {/* Conditional Rendering for Cart, Login/Signup, and Logout */}
            {user ? (
              <>
                {/* Home Button */}
            <Link to="/coupons" className="btn btn-ghost rounded-full px-4 text-base-content/70 hover:text-base-content hover:bg-base-200 transition-colors duration-200">
              Coupons
            </Link>

                <div className="indicator">
                  <Link to="/cart" className="p-2 rounded-full hover:bg-base-200 transition-colors duration-200">
                    <ShoppingBagIcon className="size-5 text-accent" /> {/* Using accent for cart icon color */}
                    {cart.length > 0 && (
                      <span className="badge badge-sm badge-primary indicator-item">
                      {cart.length} {/* This should ideally come from your cart state */}
                      </span>)}
                  </Link>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout} // Replace with actual logout logic
                  className="btn btn-outline btn-error rounded-full px-4 flex items-center gap-2 transition-colors duration-200 hover:bg-error hover:text-error-content"
                >
                  <LogOutIcon className="size-5" />
                  Logout
                </button>
              </>
            ) : (
              // User is not logged in
              <>
                {/* Sign Up Button */}
                <Link
                  to="/signup"
                  className="btn btn-primary rounded-full px-4 flex items-center gap-2
                  shadow-md hover:shadow-lg transition-all duration-200
                  hover:bg-primary-focus hover:border-primary-focus"
                >
                  <UserPlusIcon className="size-5" />
                  Sign Up
                </Link>

                {/* Login Button */}
                <Link
                  to="/login"
                  className="btn btn-secondary rounded-full px-4 flex items-center gap-2
                  shadow-md hover:shadow-lg transition-all duration-200
                  hover:bg-secondary-focus hover:border-secondary-focus"
                >
                  <LogInIcon className="size-5" />
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;