import React from "react";
import { Routes, Route } from "react-router-dom";
import SearchPage from "../Pages/SearchPage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import { BrowserRouter } from "react-router-dom";
import "../App.scss";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route
            path='/search'
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route path='/' element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
