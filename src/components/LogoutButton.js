import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";

export function LogoutButton() {
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <h1>Loading...</h1>;

    return (
      <button
        className="log-button"
        onClick={handleLogout}
      >
        <Link to="./Welcome">Logout</Link>
      </button>
    );
}