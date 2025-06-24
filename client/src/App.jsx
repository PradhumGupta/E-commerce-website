import NavBar from "./components/NavBar"
import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import { useThemeStore } from "./store/useThemeStore"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import { Toaster } from "react-hot-toast"
import { useUserStore } from "./store/useUserStore"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import { AnimatePresence } from 'framer-motion';
import AdminPage from "./pages/AdminPage"

function App() {
  const { theme } = useThemeStore();
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(checkingAuth) 
    return <AnimatePresence>
              <LoadingSpinner />
            </AnimatePresence>
  
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300 relative overflow-hidden" data-theme={theme}>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={ !user ? <SignUpPage /> : <Navigate to='/' /> } />
        <Route path="/login" element={ !user ? <LoginPage /> : <Navigate to='/' /> } />
        <Route path="/secret-dashboard" element={ user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' /> } />
        <Route path="/product/:id" element={<></>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
