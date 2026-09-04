import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import History from "./pages/History";
import CareerRoadmap from "./pages/CareerRoadmap";
import InterviewCoach from "./pages/InterviewCoach";
import SkillGapAnalysis from "./pages/SkillGapAnalysis";
import Profile from "./pages/Profile";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/history" element={<History />} />
        <Route path="/roadmap" element={<CareerRoadmap />} />
        <Route path="/interview" element={<InterviewCoach />} />
        <Route path="/skills" element={<SkillGapAnalysis />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;