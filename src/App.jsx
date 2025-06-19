import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import PrivateRoute from "./routes/PrivateRoute";
import CategoryPage from "./pages/CategoryPage";
import ActivityPage from "./pages/ActivityPage";
import LihatActivity from "./pages/LihatActivity";
import CartPage from "./pages/CartPage";
import UserManagement from "./pages/Admin/UserManagement";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
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
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
