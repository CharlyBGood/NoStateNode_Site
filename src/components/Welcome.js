import "../stylesheets/Form.css"

export function Welcome() {
  return (
    <div className="bg-neutral w-85 max-w-prose text-center m-auto">
      <h2 className="font-bold">Te damos la bienvenida</h2>
        <p>
         <span className="text-bold text-orange-500">NoStateNode</span> es un espacio para compartir ideas, recursos y buscar
          financiación para proyectos.
          Para comenzar debes crear una cuenta, si ya la tienes inicia sesión.
          Gracias.
        </p>
    </div>
  )
}