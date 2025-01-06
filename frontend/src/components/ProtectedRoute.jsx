import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../utils/auth";

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await auth();
      setIsAuthorized(authorized);
      console.log(isAuthorized);
    };
    checkAuth().catch(() => setIsAuthorized(false));
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
