import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Account from "./pages/Account";
import Navbar from "./components/Navbar";
import Book from "./components/Book";
import Footer from "./components/Footer";

import ChangeUserData from "./pages/ChangeUserData";
import ChangeUserPassword from "./pages/ChangeUserPassword";

import "./styles/Main.css";

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

const RegisterAndLogout = () => {
  localStorage.clear();
  return <Register />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="main-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-user-data"
            element={
              <ProtectedRoute>
                <ChangeUserData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-user-password"
            element={
              <ProtectedRoute>
                <ChangeUserPassword />
              </ProtectedRoute>
            }
          />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
