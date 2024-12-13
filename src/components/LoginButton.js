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
      className="log-btn w-50 border-none block border rounded py-1 px-3 m-3"
      onClick={redirectLogin}
    >
      <a className="font-bold" href="#!">Ingresar</a>
    </button>
  );
}
