import { PROTEIN, ATHLETE } from "../config.js";

export const GUIDE = [
  {
    id: "estrategia",
    title: "Estrategia del ciclo",
    items: [
      { t: "El maratón manda", d: "Es tu carrera A. Todo el plan está construido para llegar a tope el 14 de febrero; Ultravolcanes es una carrera B para disfrutar." },
      { t: "Ultravolcanes como gran sesión", d: "21 km con ~1,200 m de desnivel positivo (unos 57 m por km). A 3 semanas del maratón, correrlo a fondo deja daño muscular por las bajadas que puede tardar días o semanas en irse. Por eso se corre a RPE 5-6, con power hike en las cuestas y bajadas controladas. Calcula entre 3 h 15 min y 4 h. Si el día está extremo, no correrla es una opción válida." },
      { t: "Desnivel progresivo los jueves", d: "Los jueves en El Espino suben de 200 m a 800 m de desnivel positivo (semana 12). Repite la subida más larga del parque las veces necesarias para sumarlo." },
      { t: "Maratón: 4:00 am y plano", d: "Salida a las 4:00 am con solo ~60 m de desnivel: un ritmo casi constante de principio a fin. Los largos de las semanas 12 y 13 ensayan el horario completo: alarma 1:30 am, desayuno 2:00 am y salida 4:00 am." },
      { t: "Picos antes del trail", d: "El largo más largo (32 km) y la sesión más específica (28 km con 14 a M) van en las semanas 12 y 13, antes de Ultravolcanes. Después solo queda recuperar, un último bloque M y el taper." },
      { t: "Ritmos que se ajustan solos", d: "La prueba 5K (semana 4) y la prueba 10K (semana 8) recalibran tus ritmos. Introduce el resultado en Ritmos y todos los entrenamientos se actualizan." },
    ],
  },
  {
    id: "terreno",
    title: "Asfalto y trail: la combinación",
    items: [
      { t: "5 días de carrera, 2 de descanso", d: "Lunes y sábado sin correr. Martes calidad en asfalto, miércoles fácil, jueves trail en El Espino, viernes fácil y domingo largo en asfalto." },
      { t: "Trail ≈ 15 % del volumen", d: "Un día de trail por semana (jueves) hasta Ultravolcanes. Para un maratón, las sesiones clave y los largos deben ir en asfalto (especificidad); el trail aporta fuerza de subida, técnica de bajada y variedad sin comprometer el resto." },
      { t: "Después de Ultravolcanes, 100 % asfalto", d: "Las últimas 3 semanas son solo asfalto: el cuerpo tiene que llegar adaptado al impacto y al ritmo exacto del maratón." },
      { t: "Bajadas = trabajo activo", d: "Paso corto, cadencia alta, mirada 3-4 m adelante. El cuádriceps del km 18 de Ultravolcanes se salva en los jueves de bajada y en el step-down excéntrico." },
    ],
  },
  {
    id: "intensidad",
    title: "Intensidad: 80 / 20",
    items: [
      { t: "La mayoría fácil", d: "Alrededor del 80 % del tiempo es fácil (Z2). Es el patrón que se observa en atletas de resistencia de élite y la base de casi todos los métodos serios." },
      { t: "Tres sesiones con intensidad", d: "Martes (umbral, intervalos o ritmo M), jueves (cuestas) y los bloques M del domingo. Nunca se mueven dos sesiones duras a días seguidos." },
      { t: "Sin saltos bruscos", d: "La regla del 10 % tiene poca evidencia; lo que más aumenta el riesgo de lesión es una sola sesión mucho más larga de lo habitual. Por eso el largo sube de forma gradual y tiene límite de 3 h 15 min." },
    ],
  },
  {
    id: "fuerza",
    title: "Brazos, abdomen y piernas",
    items: [
      { t: "Mantener masa con poco volumen", d: "Según la revisión de Spiering (2021), la fuerza y la masa se mantienen con poco volumen si la carga se mantiene. En descarga y taper bajan las series, nunca el peso del cinturón." },
      { t: "La interferencia es menor arriba", d: "Correr interfiere sobre todo con la fuerza de piernas. El tren superior apenas se ve afectado, por eso puedes seguir progresando en dominadas y fondos lastrados." },
      { t: "Separar de la carrera intensa", d: "La fuerza va en días sin calidad (lunes) o 6 h o más después de correr. La sesión de piernas va el martes en la tarde: día duro duro, día fácil fácil." },
      { t: "Piernas pesadas 1 vez por semana", d: "El meta-análisis de Eihara (2022) encontró que la fuerza pesada mejora la economía de carrera más que la pliometría. Se deja de hacer en la semana de Ultravolcanes y en la última semana." },
      { t: `Proteína: ${PROTEIN.min}-${PROTEIN.max} g al día`, d: `1.6-2.0 g por kg (${ATHLETE.weightKg} kg). Con 3 comidas grandes: ~35-45 g de proteína en cada una y un snack proteico después de entrenar (yogur griego, batido, huevos).` },
    ],
  },
  {
    id: "nutricion",
    title: "Nutrición en carrera",
    items: [
      { t: "Entrena el estómago", d: "La tolerancia a los carbohidratos se entrena durante semanas. El plan sube de ~40 g/h (semanas 1-4) a 60-75 g/h desde la semana 12, que es el protocolo del maratón." },
      { t: "GU Energy Gel", d: "Cada gel aporta ≈22 g de carbohidratos con una mezcla de maltodextrina y fructosa, lo que permite absorber más de 60 g/h. Para el maratón: 1 gel cada 20 min desde el minuto 20, con agua." },
      { t: "Sodio y calor", d: "Con el calor de El Salvador: 400-800 ml de líquido por hora y 300-600 mg de sodio por hora en sesiones de más de 2 h. Los geles aportan poco sodio: suma una bebida isotónica o tabletas de electrolitos." },
      { t: "Carga de carbohidratos", d: "Viernes y sábado antes del maratón: 8-10 g por kg al día (≈620-770 g). La cena del sábado será temprano (5:30-6:00 pm), así que la mayor parte de la carga va en desayuno y almuerzo." },
      { t: "Desayuno a la 1:30-2:00 am", d: "Con salida a las 4:00 am, el desayuno es 2-2.5 h antes y más pequeño de lo habitual: 1-1.5 g de carbohidratos por kg (80-115 g), fácil de digerir. Ensáyalo en los largos de las semanas 12 y 13." },
    ],
  },
  {
    id: "equipo",
    title: "Zapatillas y equipo",
    items: [
      { t: "Hoka Speedgoat", d: "Para todos los jueves de El Espino y para Ultravolcanes." },
      { t: "Hoka Clifton 10", d: "Rodajes fáciles y parte de los largos." },
      { t: "Te falta un par de ritmo/carrera", d: "Cómpralo en la semana 6 (finales de noviembre): una zapatilla ligera de ritmo o una de placa. Estrénalo en rodajes, úsalo en las sesiones a ritmo M y en al menos 2 largos (semanas 12 y 13). Nunca debutes zapatillas el día del maratón." },
    ],
  },
  {
    id: "reglas",
    title: "Reglas del plan",
    items: [
      { t: "Sesión perdida = sesión perdida", d: "No la recuperes acumulando. Si pierdes la calidad del martes, puedes moverla al miércoles; si pierdes el largo, no lo pases al lunes." },
      { t: "Dolor que cambia tu zancada", d: "Si un dolor pasa de 3/10 o te hace cambiar la forma de correr, para. Dos días de descanso a tiempo evitan dos semanas parado." },
      { t: "Enfermedad", d: "Síntomas por encima del cuello (congestión): rodaje suave permitido. Por debajo del cuello (fiebre, pecho): descanso total." },
      { t: "Sueño", d: "Duermes ~7 h. Subir a 7.5-8 h en las semanas 9-13 es la mejora de rendimiento más barata del plan." },
      { t: "Madrugada y calor", d: "El maratón arranca a oscuras y fresco, pero los últimos 10-12 km coinciden con el amanecer y el calor. Entrena temprano y deja que el pulso mande en los días calurosos: 10-20 s/km más lento y el mismo estímulo." },
      { t: "Sueño en la semana de carrera", d: "Adelanta la hora de dormir 30 min cada noche de la semana 17. La noche clave es la del jueves (8-9 h). El sábado acuéstate a las 7:30-8:00 pm." },
    ],
  },
];

export const SOURCES = [
  { t: "Bosquet et al. 2007 · taper (resumen RunnersConnect)", u: "https://runnersconnect.net/running-training-articles/how-to-taper-for-a-marathon/" },
  { t: "Spiering et al. 2021 · dosis mínima para mantener fuerza", u: "https://pubmed.ncbi.nlm.nih.gov/33629972/" },
  { t: "Eihara et al. 2022 · fuerza pesada y economía de carrera", u: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9653533/" },
  { t: "Entrenamiento concurrente: interferencia tren superior e inferior (JSSM)", u: "https://jssm.org/16-3-391.p_d_f" },
  { t: "Entrenar en trail para una carrera de asfalto (REI)", u: "https://www.rei.com/blog/run/train-road-race-trails" },
  { t: "Correr trails entrenando para asfalto (RunnersConnect)", u: "https://runnersconnect.net/?p=23557" },
  { t: "Media maratón antes de un maratón (Active.com)", u: "https://www.active.com/running/articles/should-you-race-a-half-marathon-before-a-marathon?page=2" },
  { t: "Fuerza excéntrica para bajadas (CTS)", u: "https://trainright.com/eccentric-strength-training-for-improved-downhill-running-performance/" },
  { t: "Cuestas cortas, medias y largas", u: "https://ctyeh.com/articles/2329?lang=en" },
  { t: "Carbohidratos por hora (Precision Hydration)", u: "https://www.precisionhydration.com/performance-advice/nutrition/how-much-carbohydrate-carbs-athletes-per-hour/" },
  { t: "Entrenamiento intestinal para maratón (RunnersConnect)", u: "https://runnersconnect.net/?p=66667" },
  { t: "El mito de la regla del 10 % (Outside)", u: "https://run.outsideonline.com/training/getting-started/myth-of-the-10-percent-rule/?scope=anon" },
  { t: "Debate sobre el entrenamiento polarizado (Outside)", u: "https://www.outsideonline.com/health/training-performance/polarized-training-debate?scope=anon" },
  { t: "Proteína en atletas (Universidad de Stirling)", u: "https://www.stir.ac.uk/news/2019/04/experts-provide-new-guidelines-to-athletes-on-protein-intake/" },
];
