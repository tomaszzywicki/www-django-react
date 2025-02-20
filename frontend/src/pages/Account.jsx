import { ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import OrderMini from "../components/OrderMini";
import { useNavigate } from "react-router-dom";

import "../styles/Account.css";

const Account = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        try {
          const [userRes, ordersRes] = await Promise.all([
            api.get("/api/user/"),
            api.get("/api/user/orders/"),
          ]);
          setUser(userRes.data);
          setOrders(ordersRes.data);
        } catch (error) {
          console.log("Error when fetching data: ", error);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    };
    fetchUserData();
  }, [navigate]);

  const handleOrderCancel = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="account-container">
      <Navbar />
      <div className="user-info">
        <h2>Account Details</h2>
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
            onClick={() => navigate("/change-user-data")}
          >
            Edit Details
          </button>
          <button
            className="button"
            onClick={() => navigate("/change-user-password")}
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="orders-section">
        <h3 className="orders-title">My Orders</h3>
        <div className="orders-grid">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderMini
                key={order.id}
                orderId={order.id}
                book={order.book}
                orderDate={order.order_date}
                status={order.status}
                onCancelSuccess={handleOrderCancel}
              />
            ))
          ) : (
            <p>No orders found</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Account;
