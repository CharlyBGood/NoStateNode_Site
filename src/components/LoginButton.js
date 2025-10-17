import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginButton() {
  const { loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <h1>Ingresando...</h1>;

  const redirectLogin = () => {
    navigate("/Login");
  };

  return (
    <button
  className="log-btn py-1 outline-hidden border-0 px-3 font-bold rounded-xs mb-2"
      onClick={redirectLogin}
      type="button"
    >
      <a className="font-bold" href="#!">Ingresar</a>
    </button>
  );
}
