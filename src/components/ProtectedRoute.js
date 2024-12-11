import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>

  // if (!user) return <Navigate to="/Welcome" />; 

  user ? <Navigate to="/Home" /> : <Navigate to="/Welcome" />



  return <>{children}</>

}
