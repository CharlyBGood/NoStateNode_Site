import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./components/Register";
import { ResetPassword } from "./components/ResetPassword";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="bg-neutral-800 h-screen text-orange-400 flex">
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
