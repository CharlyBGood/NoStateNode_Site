import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";

export function LogoutButton() {
  const { logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
    navigate("/Welcome");
  };

  if (loading) return <h1>Saliendo...</h1>;

  return (
    <button
      className="bg-orange-600 hover:bg-orange-400 w-50 border-none text-black block border rounded py-1 px-1 m-3"
      onClick={handleLogout}
    >
      <a href="#!">Cerrar Sesión</a>
      {/* <Link to="./Welcome">Logout</Link> */}
    </button>
  );
}
