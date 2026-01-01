import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AdminView from "./pages/AdminView";
import LoginView from "./pages/LoginView";
import PublicView from "./pages/PublicView";
import CheckService from "./pages/CheckService";
import LandingView from "./pages/LandingView";
import AdminGuard from "./utils/AdminGuard";
import "./index.css"

export default function App() {
return (
<div className="container">
<Header />
<Routes>
<Route path="/login" element={<LoginView />} />
<Route path="/cek" element={<CheckService />} />
<Route path="/view/:id" element={<PublicView />} />
<Route path="/admin" element={<AdminGuard><AdminView /></AdminGuard>} />
<Route path="/" element={<LandingView />} />
</Routes>
</div>
);
}