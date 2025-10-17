import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  className="log-btn border-0 rounded-xs py-1 px-3"
      onClick={handleLogout}
    >
      <a className="font-bold" href="#!">Salir</a>
    </button>
  );
}
