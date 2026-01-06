import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import loader from "../assets/loader.gif";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then(() => setAuth(true))
      .catch(() => setAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f0f",
          overflow: "hidden",
        }}
      >
        <img src={loader} alt="loader" />
      </div>
    );
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
