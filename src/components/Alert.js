export function Alert({ message }) {
  return (
    <div className="bg-red-400 font-bold border-red-400 text-red-900 px-4 py-3 rounded-xs relative mb-2 text-center">
      <span className="sm:inline block">{message}</span>
    </div>
  );
}
