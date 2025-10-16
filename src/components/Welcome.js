import "../stylesheets/Form.css";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Welcome() {
  const { user, loading } = useAuth();

  if (loading) return <h1>Cargando...</h1>;

  return (
    <>
      {!user ? (
        <div className="bg-neutral w-85 max-w-prose text-center m-auto">
          <h2 className="font-bold">¡Bienvenid@!</h2>
          <p>
            {/* <span className="text-bold text-orange-500">NoStateNode</span> */}
            <span className="text-orange-300">N</span>o
            <span className="text-orange-300">S</span>tate
            <span className="text-orange-300">N</span>ode es un espacio para
            guardar ideas (notas) o recursos (enlaces) y compartirlos con quien desees. Para
            comenzar debes crear una cuenta o iniciar sesión.
            Gracias.
          </p>
          <div className="m-4 py-2">
            <Link
              className="log-btn py-2 outline-hidden border-none px-3 font-bold border rounded-sm"
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
