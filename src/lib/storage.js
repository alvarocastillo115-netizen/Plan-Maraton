// Persistencia local (por dispositivo) + respaldo exportable/importable en JSON.
const KEY = "maraton27-v1";
const isObj = (o) => !!o && typeof o === "object" && !Array.isArray(o);

export const emptyState = () => ({ version: 1, done: {}, logs: {}, settings: null, updatedAt: null });

export function normalize(obj) {
  if (!isObj(obj)) throw new Error("Formato inválido");
  return {
    version: 1,
    done: isObj(obj.done) ? obj.done : {},
    logs: isObj(obj.logs) ? obj.logs : {},
    settings: isObj(obj.settings) ? obj.settings : null,
    updatedAt: typeof obj.updatedAt === "string" ? obj.updatedAt : null,
  };
}

export function loadState(store = globalThis.localStorage) {
  try {
    const raw = store?.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : emptyState();
  } catch {
    return emptyState();
  }
}

export function saveState(state, store = globalThis.localStorage) {
  try {
    store.setItem(KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
    return true;
  } catch {
    return false;
  }
}

export function parseBackup(text) {
  const obj = JSON.parse(text);
  if (!isObj(obj) || (!isObj(obj.done) && !isObj(obj.logs))) {
    throw new Error("El archivo no parece un respaldo de esta app.");
  }
  return normalize(obj);
}

export const backupFileName = (d = new Date()) =>
  `respaldo-maraton27-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}.json`;
