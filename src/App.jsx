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

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* <Route path='/register' element={<RegisterP}></Route> */}

          <Route
            path="/beranda"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          ></Route>
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/activities" element={<ActivityPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
