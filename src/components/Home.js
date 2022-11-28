import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading....</h1>;
  }

  if (!user) {
    Navigate("/Welcome")
  }

  return (
    <div className="bg-black py-4 px-2 w-full max-w-xs m-auto text-slate-300">
      <h1>¡Hola {user.displayName || user.email}!</h1>
    </div>
  );
}
