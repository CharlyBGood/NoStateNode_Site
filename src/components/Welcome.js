import "../stylesheets/Form.css";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { Home } from "./Home";
// import { Navigate } from "react-router-dom";

export function Welcome() {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      {!user ? (
        <div className="bg-neutral w-85 max-w-prose text-center m-auto">
          <h2 className="font-bold">Te damos la bienvenida</h2>
          <p>
            {/* <span className="text-bold text-orange-500">NoStateNode</span> */}
            <span className="text-orange-300">N</span>o
            <span className="text-orange-300">S</span>tate
            <span className="text-orange-300">N</span>ode es un espacio para
            compartir ideas, recursos y buscar financiación para proyectos. Para
            comenzar debes crear una cuenta, si ya la tienes inicia sesión.
            Gracias.
          </p>
          <div className="m-4 py-2">
            <Link
              className="bg-orange-600 py-2 outline-none hover:bg-orange-400 border-none px-3 text-black font-bold border rounded"
              to="/register"
            >
              Registrarse
            </Link>
          </div>
        </div>
      ) : (
        <Navigate to="/Home" />
      )}
    </>
  );
}
