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

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirigir si el usuario está autenticado
  if (user) {
    navigate("/Home");
  }
  return (
    <div className="todo-app">
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<RouteRedirection />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            }
          />
          <Route path="/Home" element={<Home />} />
          <Route path="/Welcome" element={<Welcome />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </div>
  );
}

const RouteRedirection = () => {
  const { user } = useAuth(); // Aquí accedes al usuario desde el contexto
  return user ? <Home /> : <Welcome />;
};

export default App;
