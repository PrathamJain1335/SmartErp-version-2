import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./components/Login";
import DemoAccess from "./components/DemoAccess";
import Faculty from "./Faculty";
import Admin from "./Admin";
import Student from "./Student";
import { setupGlobalTheme } from "./setupTheme";

export default function App() {
  // Initialize global theme on app load
  useEffect(() => {
    setupGlobalTheme();
  }, []);

  return (
    <ThemeProvider>
      <DemoAccess />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/faculty/*" element={<Faculty />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/student/*" element={<Student />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </ThemeProvider>
  );
}

