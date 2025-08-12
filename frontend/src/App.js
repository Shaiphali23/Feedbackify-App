import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./ContextAPI/authContext";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./ContextAPI/ProtectedRoute";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import FeedbackChart from "./components/FeedbackChart";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Client Feedback Form */}
          <Route path="/form/:formId" element={<FeedbackForm />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
