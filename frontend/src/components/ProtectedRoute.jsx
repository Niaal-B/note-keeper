import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, refreshToken } from "../redux/authSlice";

function ProtectedRoute({ children }) {
  const { accessToken, refreshToken: refreshTokenFromRedux, isAuthenticated } = useSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      auth();
    } else {
      setIsAuthorized(false);
    }
  }, [isAuthenticated, accessToken]);

  const refreshAccessToken = async () => {
    if (!refreshTokenFromRedux) {
      dispatch(logout());
      setIsAuthorized(false);
      return;
    }

    try {
      const res = await api.post("/api/token/refresh/", { refresh: refreshTokenFromRedux });

      if (res.status === 200) {
        dispatch(refreshToken(res.data.access)); // ✅ Update Redux state
        setIsAuthorized(true);
      } else {
        dispatch(logout());
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      dispatch(logout());
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    if (!accessToken) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(accessToken);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshAccessToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
