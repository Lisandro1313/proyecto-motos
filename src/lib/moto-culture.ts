export type MotoTriviaQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

export type MotoQuote = {
  text: string;
  source: string;
};

export const motoTriviaQuestions: MotoTriviaQuestion[] = [
  {
    id: "kick-start",
    question: "¿Cómo se llama el arranque a pedal de las motos clásicas?",
    options: ["Kick starter", "Starter eléctrico", "Cebador", "Bendix"],
    answer: "Kick starter",
  },
  {
    id: "two-stroke",
    question: "¿Qué motor viejo suele mezclar aceite con nafta?",
    options: ["2 tiempos", "4 tiempos", "Diesel", "Eléctrico"],
    answer: "2 tiempos",
  },
  {
    id: "carburetor",
    question: "Antes de la inyección electrónica, ¿qué pieza dosificaba mezcla?",
    options: ["Carburador", "Alternador", "Radiador", "Volante magnético"],
    answer: "Carburador",
  },
  {
    id: "cafe-racer",
    question: "¿Qué estilo nació de preparar motos livianas para correr entre cafés?",
    options: ["Cafe racer", "Motard", "Bobber", "Cub"],
    answer: "Cafe racer",
  },
  {
    id: "chain",
    question: "¿Qué transmisión pide limpieza, tensión y grasa seguido?",
    options: ["Cadena", "Cardán", "Correa", "Variador"],
    answer: "Cadena",
  },
  {
    id: "honda-dreams",
    question: "¿Qué marca japonesa se asocia al lema 'The Power of Dreams'?",
    options: ["Honda", "Yamaha", "Suzuki", "Kawasaki"],
    answer: "Honda",
  },
  {
    id: "abs",
    question: "¿Qué sistema ayuda a evitar que la rueda se bloquee al frenar?",
    options: ["ABS", "CDI", "TPS", "ECU"],
    answer: "ABS",
  },
  {
    id: "helmet",
    question: "¿Qué elemento de seguridad es obligatorio antes de salir a la calle?",
    options: ["Casco", "Alforja", "Baúl", "Cubrepuños"],
    answer: "Casco",
  },
  {
    id: "odometer",
    question: "¿Qué instrumento muestra los kilómetros recorridos?",
    options: ["Odómetro", "Tacómetro", "Manómetro", "Voltímetro"],
    answer: "Odómetro",
  },
  {
    id: "tachometer",
    question: "¿Qué reloj mide las revoluciones del motor?",
    options: ["Tacómetro", "Velocímetro", "Odómetro", "Nivel de nafta"],
    answer: "Tacómetro",
  },
  {
    id: "idle",
    question: "Cuando el motor queda prendido sin acelerar, ¿cómo se llama ese régimen?",
    options: ["Ralenti", "Corte", "Rebase", "Pique"],
    answer: "Ralenti",
  },
  {
    id: "disc-brake",
    question: "¿Qué pieza muerden las pastillas en un freno moderno?",
    options: ["Disco", "Piñón", "Corona", "Biela"],
    answer: "Disco",
  },
  {
    id: "spark-plug",
    question: "¿Qué pieza genera la chispa para encender la mezcla?",
    options: ["Bujía", "Filtro de aire", "Cadena", "Embrague"],
    answer: "Bujía",
  },
  {
    id: "air-filter",
    question: "¿Qué filtro ayuda a que el motor respire limpio?",
    options: ["Filtro de aire", "Filtro de café", "Filtro polarizado", "Filtro UV"],
    answer: "Filtro de aire",
  },
  {
    id: "clutch",
    question: "¿Qué comando desacopla el motor de la caja para cambiar de marcha?",
    options: ["Embrague", "Cebador", "Guiño", "Caballete"],
    answer: "Embrague",
  },
  {
    id: "side-stand",
    question: "¿Cómo se llama el apoyo lateral para dejar la moto estacionada?",
    options: ["Pata lateral", "Horquilla", "Manillar", "Leva"],
    answer: "Pata lateral",
  },
  {
    id: "chain-kit",
    question: "¿Qué conjunto se revisa junto: piñón, corona y cadena?",
    options: ["Kit de transmisión", "Kit de frenos", "Kit de luces", "Kit de carenado"],
    answer: "Kit de transmisión",
  },
  {
    id: "led-light",
    question: "¿Qué tecnología de luces consume poco y alumbra fuerte?",
    options: ["LED", "Carburador", "Rodamiento", "Escape"],
    answer: "LED",
  },
  {
    id: "cylinder",
    question: "¿Dónde sube y baja el pistón dentro del motor?",
    options: ["Cilindro", "Tanque", "Maza", "Tablero"],
    answer: "Cilindro",
  },
  {
    id: "coolant",
    question: "En una moto refrigerada por líquido, ¿qué fluido se revisa?",
    options: ["Refrigerante", "Nafta premium", "Grasa de cadena", "Líquido limpia vidrios"],
    answer: "Refrigerante",
  },
  {
    id: "vin",
    question: "¿Qué número identifica legalmente al chasis de la moto?",
    options: ["Número de cuadro", "Número de asiento", "Número de casco", "Número de llave"],
    answer: "Número de cuadro",
  },
  {
    id: "tire-pressure",
    question: "¿Qué conviene revisar antes de una entrega o una ruta larga?",
    options: ["Presión de neumáticos", "Color del logo", "Nombre del modelo", "Volumen de la bocina"],
    answer: "Presión de neumáticos",
  },
  {
    id: "fuel-injection",
    question: "¿Qué sistema reemplazó al carburador en muchas motos modernas?",
    options: ["Inyección electrónica", "Freno a tambor", "Arranque a patada", "Cámara con rayos"],
    answer: "Inyección electrónica",
  },
  {
    id: "turn-signal",
    question: "¿Qué luz se usa para avisar un giro?",
    options: ["Guiño", "Luz alta", "Stop", "Luz de posición"],
    answer: "Guiño",
  },
];

export const motoQuotes: MotoQuote[] = [
  {
    text: "La moto se vende con papeles, pero se elige con el pulso.",
    source: "RE Motos",
  },
  {
    text: "Si el motor regula parejo, el negocio también.",
    source: "Frase de taller",
  },
  {
    text: "Primero escuchá el motor; después mirá el precio.",
    source: "Vieja escuela",
  },
  {
    text: "The Power of Dreams.",
    source: "Honda",
  },
  {
    text: "Revs your heart.",
    source: "Yamaha",
  },
  {
    text: "Make Life a Ride.",
    source: "BMW Motorrad",
  },
  {
    text: "Cuatro ruedas mueven el cuerpo; dos ruedas acomodan la cabeza.",
    source: "Cultura moto",
  },
  {
    text: "Moto limpia, venta más tranquila.",
    source: "Mostrador",
  },
  {
    text: "El mejor cierre empieza con una buena entrega.",
    source: "RE Motos",
  },
  {
    text: "Una cadena cuidada habla bien del dueño anterior.",
    source: "Taller",
  },
  {
    text: "Cuando la ficha está completa, la operación sale derecha.",
    source: "Administración",
  },
  {
    text: "El cliente compra confianza antes que cilindrada.",
    source: "Ventas",
  },
  {
    text: "Buen casco, buena ruta, buen regreso.",
    source: "Cultura moto",
  },
  {
    text: "No hay moto chica si el plan está bien armado.",
    source: "Financiación",
  },
  {
    text: "El tablero cuenta datos; el vendedor cuenta historias.",
    source: "RE Motos",
  },
  {
    text: "Una vuelta corta puede cerrar una charla larga.",
    source: "Vieja escuela",
  },
  {
    text: "Papeles claros, llave liviana.",
    source: "Gestoría",
  },
  {
    text: "La primera impresión también regula en baja.",
    source: "Frase de taller",
  },
  {
    text: "Stock ordenado, semana más serena.",
    source: "Inventario",
  },
  {
    text: "Si el freno responde, la confianza también.",
    source: "Taller",
  },
  {
    text: "Cada entrega es una foto que el cliente se lleva puesta.",
    source: "RE Motos",
  },
  {
    text: "A veces la moto correcta es la que baja el ruido del día.",
    source: "Cultura moto",
  },
  {
    text: "El motor puede sonar fuerte; la gestión tiene que sonar clara.",
    source: "Administración",
  },
  {
    text: "La mejor financiación no apura: acompaña.",
    source: "Caja",
  },
  {
    text: "Antes de vender potencia, vendé tranquilidad.",
    source: "Ventas",
  },
  {
    text: "Un service a tiempo vale más que una excusa tarde.",
    source: "Taller",
  },
  {
    text: "La ruta se disfruta más cuando el casco ajusta bien.",
    source: "Seguridad",
  },
  {
    text: "La moto entra por los ojos, pero se queda por el uso.",
    source: "Mostrador",
  },
  {
    text: "Un buen asesor escucha el motor y al cliente.",
    source: "RE Motos",
  },
  {
    text: "Kilómetros reales, promesas cortas.",
    source: "Vieja escuela",
  },
  {
    text: "El detalle que corregís hoy evita el reclamo de mañana.",
    source: "Taller",
  },
  {
    text: "La sucursal late mejor cuando todos ven el mismo tablero.",
    source: "Gestión",
  },
  {
    text: "Dos ruedas, mil planes.",
    source: "Cultura moto",
  },
  {
    text: "Si el cliente vuelve por el service, la venta salió completa.",
    source: "RE Motos",
  },
  {
    text: "El mejor brillo es el de una operación prolija.",
    source: "Administración",
  },
  {
    text: "La moto ideal no grita: encaja.",
    source: "Ventas",
  },
];

export function pickDailyTrivia() {
  const index = new Date().getDate() % motoTriviaQuestions.length;
  return motoTriviaQuestions[index];
}

export function pickDailyQuote() {
  const index = new Date().getDate() % motoQuotes.length;
  return motoQuotes[index];
}

function pickRandomItem<T>(items: T[], isSameItem?: (item: T) => boolean) {
  const pool = isSameItem ? items.filter((item) => !isSameItem(item)) : items;
  const source = pool.length > 0 ? pool : items;
  const index = Math.floor(Math.random() * source.length);
  return source[index];
}

export function pickRandomTrivia(currentId?: string) {
  return pickRandomItem(
    motoTriviaQuestions,
    currentId ? (question) => question.id === currentId : undefined,
  );
}

export function pickRandomQuote(currentText?: string) {
  return pickRandomItem(
    motoQuotes,
    currentText ? (quote) => quote.text === currentText : undefined,
  );
}
