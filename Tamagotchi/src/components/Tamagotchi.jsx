import { useState, useEffect, useRef } from "react";

// Función para determinar el color de la barra de progreso
const getProgressColor = (value) => {
  if (value > 60) return "bg-green-500"; // Verde para valores altos [cite: 174]
  if (value > 20) return "bg-yellow-500"; // Amarillo para valores medios [cite: 174]
  return "bg-red-500"; // Rojo para valores bajos [cite: 175]
};

// Componente de barra de progreso reutilizable
function ProgressBar({ label, value }) {
  const colorClass = getProgressColor(value);

  return (
    <div className="flex items-center">
      <label className="mr-2 font-medium w-20">{label}: </label>
      <div className="flex-1 bg-gray-300 h-4 rounded overflow-hidden">
        {/* Estilo condicional para el color y el ancho dinámico */}
        <div 
          className={`${colorClass} h-full transition-all duration-300`} 
          style={{ width: `${Math.max(0, value)}%` }} // Asegura que no baje de 0
        />
      </div>
    </div>
  );
}
const minVida = 0;
export function Tamagotchi() {
  // Inicialización de estados [cite: 106, 107, 157]
  const [hunger, setHunger] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [health, setHealth] = useState(100);
  const timer = useRef();

  // Función de interaccion: Alimentar [cite: 162, 181, 182, 183, 184]
  const feed = () => {
    setHunger(prevHunger => Math.min(prevHunger + 20, 100));
    setHealth(prevHealth => Math.min(prevHealth + 5, 100));
    setHappiness(prevHappiness => Math.min(prevHappiness + 5, 100));
  };

  // Función de interaccion: Jugar [cite: 165, 185, 186, 187, 188, 189, 192, 193]
  const play = () => {
    setHappiness(prevHappiness => Math.min(prevHappiness + 20, 100));
    setHunger(prevHunger => Math.max(prevHunger - 5, 0));
    setHealth(prevHealth => Math.max(prevHealth - 5, 0));
  };

  // Función de interaccion: Dormir [cite: 166, 190, 191, 194, 195]
  const sleep = () => {
    setHealth(prevHealth => Math.min(prevHealth + 10, 100));
    setHunger(prevHunger => Math.max(prevHunger - 5, 0));
    setHappiness(prevHappiness => Math.max(prevHappiness - 5, 0));
  };

  // Efecto para la actualización automática del estado con el tiempo [cite: 96, 109, 110, 111, 113, 114, 158]
  useEffect(() => {
    timer.current = setInterval(() => {
      // Disminuir con el tiempo
      setHappiness(happiness => Math.max(happiness - 1, 0));
      setHealth(health => Math.max(health - 1, 0));
      setHunger(hunger => Math.max(hunger - 1, 0));
    }, 2000); // Se actualiza cada 2 segundos

    // Función de limpieza para evitar efectos secundarios [cite: 97, 115, 160]
    return () => clearInterval(timer.current);
  }, []);

  // Determinar el estado del personaje para la imagen
  let tamagotchiState = "CONTENTILLO"; // Por defecto
  if (health === 0) {
    tamagotchiState = "Muerto";
  } else if (hunger > 70 && happiness > 70) {
    tamagotchiState = "PRIME";
  } else if (hunger < 30 || happiness < 30) {
    tamagotchiState = "Triston";
  } else if (health < 50) {
    tamagotchiState = "Enfermito";
  }

  // Si la salud llega a 0, detenemos el contador
  useEffect(() => {
    if (health === minVida) {
      clearInterval(timer.current);
    }
  }, [health]);


  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl max-w-md w-full">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Sandrotchi</h1>
      {health > minVida ? (
        <>
          {/* Espacio para la imagen del personaje [cite: 208, 226] */}
          <div className="text-center mb-6">
            <img 
             // El componente busca: /images/estado.png
              src={`/images/${tamagotchiState}.png`}
              alt={tamagotchiState} 
              className="mx-auto w-50 h-50 object-cover tamagotchi-img"
            />
            <p className="mt-2 text-lg font-semibold capitalize">{tamagotchiState}</p>
          </div>

          {/* Barras de estado [cite: 122, 124, 125, 130, 177, 178] */}
          <div className="space-y-4">
            <ProgressBar label="Vida" value={health} />
            <ProgressBar label="Felicidad" value={happiness} />
            <ProgressBar label="Hambre" value={hunger} />
          </div>

          {/* Botones de interacción [cite: 133, 134, 136, 138] */}
          <div className="flex space-x-3 mt-6 justify-center">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold 
                        hover:bg-blue-700 transition shadow-md" 
              onClick={feed}
            >
              COMER
            </button>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold 
                        hover:bg-green-700 transition shadow-md" 
              onClick={play}
            >
              Jugado
            </button>
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold 
                        hover:bg-purple-700 transition shadow-md" 
              onClick={sleep}
            >
              Dormido
            </button>
          </div>
        </>
      ) : (
        <div className="text-center p-8">
          <h2 className="text-4xl font-bold text-red-600">Se murio XD</h2>
          <p className="mt-4 text-xl">Tu peluche haaa muerto tronco....</p>
          <img 
              src={`/images/Muerto.png`} 
              alt="Dead Tamagotchi" 
              className="mx-auto w-50 h-50 object-cover mt-4"
            />
        </div>
      )}
    </div>
  );
}