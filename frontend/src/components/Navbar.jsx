import { Link } from "react-router-dom";
import { auth } from "../utils/auth";
import { useState, useEffect } from "react";

import "../styles/Navbar.css";

const Navbar = () => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await auth();
      setIsAuthorized(authorized);
    };
    checkAuth().catch(() => setIsAuthorized(false));
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MyLibrary
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          {isAuthorized ? (
            <>
              <li className="navbar-item">
                <Link to="/account" className="navbar-link">
                  Account
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/logout" className="navbar-link">
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
