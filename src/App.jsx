import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar        from "./components/Navbar.jsx";
import Footer        from "./components/Footer.jsx";
import Home          from "./pages/Home.jsx";
import Login         from "./pages/Login.jsx";
import Register      from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword  from "./pages/ResetPassword.jsx";
import Profile       from "./pages/Profile.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />

      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={isLoggedIn ? <Navigate to="/profile" replace /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/register"        element={isLoggedIn ? <Navigate to="/profile" replace /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/profile"         element={isLoggedIn ? <Profile onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" replace />} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
