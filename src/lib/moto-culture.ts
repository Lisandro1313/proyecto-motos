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
];

export const motoQuotes: MotoQuote[] = [
  {
    text: "La moto se vende con papeles, pero se elige con el pulso.",
    source: "MotoCenter",
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
];

export function pickDailyTrivia() {
  const index = new Date().getDate() % motoTriviaQuestions.length;
  return motoTriviaQuestions[index];
}

export function pickDailyQuote() {
  const index = new Date().getDate() % motoQuotes.length;
  return motoQuotes[index];
}
