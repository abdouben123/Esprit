import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./home";
import Chatbot from "./chatbot";
import Forum from "./forum";
import Demarche from "./demarche";
import Login from "./login";
import Register from "./register";
import Profile from "./profile";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PRIVATE ROUTES */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/chatbot"
        element={
          <PrivateRoute>
            <Chatbot />
          </PrivateRoute>
        }
      />
      <Route
        path="/forum"
        element={
          <PrivateRoute>
            <Forum />
          </PrivateRoute>
        }
      />
      <Route
        path="/demarche"
        element={
          <PrivateRoute>
            <Demarche />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
