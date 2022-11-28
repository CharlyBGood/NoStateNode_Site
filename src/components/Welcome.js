import "../stylesheets/Form.css"

export function Welcome() {
  return (
    <div className="bg-neutral w-full text-orange-300 max-w-prose text-center m-auto">
      <h2>Te damos la bienvenida</h2>
        <p>
          NoStateNode es un espacio para compartir ideas, recursos y buscar
          financiación para proyectos.
          Para comenzar debes crear una cuenta, si ya la tienes inicia sesión.
          Gracias.
        </p>
    </div>
  )
}