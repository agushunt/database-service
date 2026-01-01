
// ===============================
// src/utils/AdminGuard.jsx
// ===============================
import { Navigate } from "react-router-dom";
export default function AdminGuard({ children }) {
  return localStorage.getItem("admin") ? children : <Navigate to="/login" />;
}