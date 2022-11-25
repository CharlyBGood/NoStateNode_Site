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
    <div className="bg-black py-4 px-2 w-full max-w-xs m-auto text-slate-300">
      <h1>Welcome {user.displayName || user.email}</h1>
      <button className="bg-blue-700 hover:bg-slate-400 w-100 border-none text-black font-bold text-sm block border rounded mb-2 py-2 px-4 w-full" onClick={handleLogout}>Logout</button>
    </div>
  );
}
