# Trail + 42K · Plan de entrenamiento

Aplicación web para seguir un plan de 17 semanas que prepara dos carreras:

- **Ultravolcanes 21K** (trail), domingo 24 de enero de 2027. Carrera B, para disfrutar.
- **Maratón El Salvador** (asfalto), domingo 14 de febrero de 2027. Carrera A.

El plan empieza el lunes 19 de octubre de 2026 e incluye 5 días de carrera, 3 días de fuerza y 2 días de descanso total por semana para mantener la masa muscular de brazos y abdomen. El plan completo, día por día, está en [PLAN.md](PLAN.md).

## Funciones

- **Hoy**: la sesión del día, la de mañana, la próxima sesión clave y el progreso de la semana.
- **Plan**: perfil de volumen de las 17 semanas por fase, con cada día y cada sesión.
- **Detalle de cada sesión**: objetivo, calentamiento, ejecución y claves, con tus ritmos y zonas de pulso reales.
- **Registro**: km reales, tiempo, pulso medio, RPE y notas. El ritmo medio se calcula solo.
- **Fuerza**: ejercicios con series, repeticiones y carga, registro por ejercicio y "última vez" para progresar.
- **Ritmos**: calculadora VDOT (Jack Daniels) y zonas de pulso Karvonen. Al introducir el resultado de una prueba, todo el plan se recalcula.
- **Guía**: estrategia, combinación asfalto/trail, nutrición, equipo, reglas y fuentes científicas.
- **Respaldo**: exportar e importar el progreso en JSON.
- **Instalable y sin conexión** en iPhone (PWA) y con modo oscuro automático.

## Mejoras respecto a la versión anterior (Trail 22K)

| Antes | Ahora |
|---|---|
| Un HTML de 2.6 MB que compilaba JSX en el teléfono con Babel | Compilado con Vite: ~71 KB comprimidos |
| Fechas escritas a mano en varios lugares | Todo se deriva de una sola fecha de inicio (`src/config.js`) |
| Una carrera | Dos carreras con cuenta regresiva propia |
| Fuerza como una línea de texto | Rutinas completas, con variantes de descarga y taper y registro de cargas |
| Solo un check por sesión | Registro de km, tiempo, pulso, RPE y notas |
| Ritmos sin números ("ritmo 5K") | Ritmos y pulso calculados y editables |
| Contadores inconsistentes con las sesiones opcionales | Las opcionales suman km extra sin alterar los totales |
| Firebase con base de datos abierta | Almacenamiento local y respaldo en archivo |
| Sin vista del día ni modo sin conexión | Vista "Hoy", PWA instalable y modo oscuro |

## Uso local

```bash
npm install
npm run dev       # servidor de desarrollo
npm test          # pruebas (ritmos, calendario, carga, almacenamiento)
npm run build     # compila a dist/
npm run plan      # regenera PLAN.md desde los datos
npm run icons     # regenera los íconos
```

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube el proyecto a la rama `main`.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta las pruebas, compila y publica (`.github/workflows/deploy.yml`).

## Estructura

```
src/
  config.js            fecha de inicio, carreras, atleta y ajustes por defecto
  data/plan.js         las 17 semanas, día por día
  data/workouts.js     generadores de sesiones de carrera
  data/strength.js     rutinas de fuerza y variantes
  data/guide.js        guía y fuentes
  lib/paces.js         VDOT, ritmos y zonas de pulso
  lib/dates.js         calendario
  lib/stats.js         km, sesiones y progreso
  lib/storage.js       guardado local y respaldo
  components/          interfaz (React)
public/                manifiesto, service worker e íconos
scripts/               generadores de PLAN.md e íconos
```

## Base científica

- Taper de 2-3 semanas: volumen −41 a −60 %, intensidad y frecuencia mantenidas (Bosquet et al., 2007).
- Mantenimiento de fuerza y masa con poco volumen si la carga se mantiene (Spiering et al., 2021).
- Fuerza pesada para la economía de carrera (Eihara et al., 2022).
- Distribución de intensidad ~80/20 y especificidad del terreno para el maratón.
- Entrenamiento intestinal progresivo hasta 60-75 g de carbohidratos por hora.

Las fuentes completas están en la pestaña Guía de la app.
