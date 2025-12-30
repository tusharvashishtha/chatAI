import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

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

  if (loading) return null;
  if (!auth) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
