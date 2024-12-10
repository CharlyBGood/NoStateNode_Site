import { Route, Routes, useNavigate } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./components/Register";
import { ResetPassword } from "./components/ResetPassword";
import { Welcome } from "./components/Welcome";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/Home");
    }
  }, [user, navigate]);

  const RouteRedirection = () => {
    const { user } = useAuth();
    return user ? <Home /> : <Welcome />;
  };

  return (
    <AuthProvider>
      <div className="todo-app">
        <Navbar />
        <Routes>
          <Route path="/" element={<RouteRedirection />} />
          <Route
            path="/Home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/Welcome" element={<Welcome />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
