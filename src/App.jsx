import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import PrivateRoute from "./routes/PrivateRoute";
import CategoryPage from "./pages/CategoryPage";
import ActivityPage from "./pages/ActivityPage";
import LihatActivity from "./pages/LihatActivity";
import CartPage from "./pages/CartPage";
import HomeAdmin from "./pages/Admin/HomeAdmin";
import UsersPageAdmin from "./pages/Admin/UsersPageAdmin";
import BannerPageAdmin from "./pages/Admin/BannerPageAdmin";
import PromoPageAdmin from "./pages/Admin/PromoPageAdmin";
import CategoryPageAdmin from "./pages/Admin/CategoryPageAdmin";
import ActivityiPageAdmin from "./pages/Admin/ActivityPageAdmin";
import { SignupForm } from "./components/SignUpForm";
import SignupPage from "./pages/SignupPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* <Route path='/register' element={<RegisterP}></Route> */}

          <Route path="/beranda" element={<MainPage />}></Route>
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/activities" element={<ActivityPage />} />
          <Route path="/activity/:id" element={<LihatActivity />} />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/home"
            element={
              <PrivateRoute>
                <HomeAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                <UsersPageAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/banner"
            element={
              <PrivateRoute>
                <BannerPageAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/promo"
            element={
              <PrivateRoute>
                <PromoPageAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/category"
            element={
              <PrivateRoute>
                <CategoryPageAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/activity"
            element={
              <PrivateRoute>
                <ActivityiPageAdmin />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/beranda" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
