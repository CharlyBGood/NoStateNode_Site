import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";

export function LoginButton() {
  const { loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <h1>Ingresando...</h1>;

  const redirectLogin = () => {
    navigate("/Login");
  };

  return (
    <button
      className="bg-orange-600 hover:bg-orange-400 w-50 border-none text-black block border rounded py-1 px-1 m-3"
      onClick={redirectLogin}
    >
      <a href="#!">Ingresar</a>
      {/* <Link to="./Login">Login</Link> */}
    </button>
  );
}
