import { ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import BookMini from "../components/BookMini";
import { useNavigate } from "react-router-dom";

import "../styles/Account.css";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        try {
          const res = await api.get("/api/user/");
          setUser(res.data);
        } catch (error) {
          console.log("Error when fetching user data: ", error);
        }
      } else {
        console.log("No token");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="account-container">
      <Navbar />
      <h2>Account Page</h2>
      <div className="user-info">
        <p>
          <span>Name:</span> {user.first_name}
        </p>
        <p>
          <span>Surname:</span> {user.last_name}
        </p>
        <p>
          <span>Username:</span> {user.username}
        </p>
        <p>
          <span>Email:</span> {user.email}
        </p>
        <div className="user-info-buttons">
          <button
            className="button"
            onClick={() => {
              navigate("/change-user-data");
            }}
          >
            Edit Details
          </button>
          <button
            className="button"
            onClick={() => {
              navigate("/change-user-password");
            }}
          >
            Change Password
          </button>
        </div>
      </div>
      <div className="loans-section">
        <h3>My Loans</h3>
        <div className="books-container">
          {user.loans?.map((loan) => (
            <BookMini
              key={loan.id}
              title={loan.book.book.title}
              cover={loan.book.book.cover_image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Account;
