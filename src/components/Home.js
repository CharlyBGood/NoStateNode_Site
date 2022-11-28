import { useAuth } from "../context/AuthContext";

export function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading....</h1>;
  }

  return (
    <div className="bg-black py-4 px-2 w-full max-w-xs m-auto text-slate-300">
      <h1>¡Te damos la bienvenida! {user.displayName || user.email}</h1>
    </div>
  );
}
