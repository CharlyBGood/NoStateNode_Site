import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./components/Register";
import { ResetPassword } from "./components/ResetPassword";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="bg-neutral-800 h-screen text-zinc-400 flex">
      <AuthProvider>
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
      </AuthProvider>
    </div>
  );
}

export default App;
