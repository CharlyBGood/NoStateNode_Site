import { useAuth } from "../context/AuthContext";

export function Home() {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <h1>Loading....</h1>;
  }

  return (
    <div>
      <h1>Welcome {user.displayName || user.email}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
