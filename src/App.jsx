import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './home';
import Chatbot from './chatbot';
import Forum from './forum';
import Demarche from './demarche';
import Login from './login';
import Register from './register';
import Profile from './profile';
import PrivateRoute from './PrivateRoute';  // ⬅️ importer le garde

function App() {
  return (
    <Routes>
      {/* route protégée */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      {/* routes publiques */}
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/demarche" element={<Demarche />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
