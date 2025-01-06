import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const auth = async () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      const refreshed = await refreshToken();
      return refreshed;
    } else {
      return true;
    }
  } catch (error) {
    console.log("Auth error: ", error);
    return false;
  }
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  if (!refreshToken) {
    return false;
  }

  try {
    const res = await api.post("/api/token/refresh/", {
      refresh: refreshToken,
    });
    if (res.status === 200) {
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Refresh token error:", error);
    return false;
  }
};
