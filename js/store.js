/* Loads/saves the editable content model to localStorage so admin edits
   persist in this browser between visits. The "Descargar HTML" button in
   admin.html is what actually ships a change to anyone else. */

const PQ_STORAGE_KEY = 'perla_quote_content_v1';
const PQ_ASSETS_KEY = 'perla_quote_assets_v1';

function pqDeepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function pqLoadContent() {
  const fallback = pqDeepClone(window.DEFAULT_CONTENT);
  try {
    const raw = localStorage.getItem(PQ_STORAGE_KEY);
    if (!raw) return fallback;
    const saved = JSON.parse(raw);
    // Shallow-merge per locale so newly added default fields still show up.
    return {
      es: Object.assign({}, fallback.es, saved.es),
      en: Object.assign({}, fallback.en, saved.en)
    };
  } catch (e) {
    console.warn('No se pudo leer el contenido guardado, usando valores por defecto.', e);
    return fallback;
  }
}

function pqSaveContent(content) {
  localStorage.setItem(PQ_STORAGE_KEY, JSON.stringify(content));
}

function pqLoadAssets() {
  const fallback = Object.assign({}, window.DEFAULT_ASSETS);
  try {
    const raw = localStorage.getItem(PQ_ASSETS_KEY);
    if (!raw) return fallback;
    return Object.assign(fallback, JSON.parse(raw));
  } catch (e) {
    return fallback;
  }
}

function pqSaveAssets(assets) {
  localStorage.setItem(PQ_ASSETS_KEY, JSON.stringify(assets));
}

function pqResetAll() {
  localStorage.removeItem(PQ_STORAGE_KEY);
  localStorage.removeItem(PQ_ASSETS_KEY);
}

window.PQStore = { load: pqLoadContent, save: pqSaveContent, loadAssets: pqLoadAssets, saveAssets: pqSaveAssets, reset: pqResetAll, clone: pqDeepClone };
