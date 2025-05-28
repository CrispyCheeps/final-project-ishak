import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* <Route path='/register' element={<RegisterP}></Route> */}

          <Route
            path="/final-project"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          >
           

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
