
const DEFAULT_PLUGIN_BASE = "https://617654bb26fa.ngrok-free.app/plugin";

function resolvePluginBase() {
  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get("plugin_base");
  if (fromQuery) {
    localStorage.setItem("tmd_plugin_base", fromQuery);
    return fromQuery;
  }
  const fromStorage = localStorage.getItem("tmd_plugin_base");
  if (fromStorage) return fromStorage;
  if (window.TMD_PLUGIN_BASE) return window.TMD_PLUGIN_BASE;
  return DEFAULT_PLUGIN_BASE; 
}

export const PLUGIN_BASE  = resolvePluginBase();
export const PLUGIN_LOGIN = PLUGIN_BASE ? `${PLUGIN_BASE}/login.html` : null;
export const PLUGIN_CHAT  = PLUGIN_BASE ? `${PLUGIN_BASE}/111.html`   : null;

async function pingMe() {
  if (!PLUGIN_BASE) return false;
  const candidates = [`${PLUGIN_BASE}/me`, `${PLUGIN_BASE}/me.json`];
  for (const url of candidates) {
    try {
      const resp = await fetch(url, { credentials: "include" });
      if (resp.ok) return true;
    } catch { /* ignore and try next */ }
  }
  return false;
}

export async function isPluginAuthed() {
  try {
    return await pingMe();
  } catch {
    return false;
  }
}

export function goToPluginLogin(next = "/chat.html") {
  if (!PLUGIN_BASE) {
    window.location.href = `/login.html?next=${encodeURIComponent(next)}`;
    return;
  }
  const url = new URL(PLUGIN_LOGIN);
  url.searchParams.set("next", next);
  window.location.href = url.toString();
}

export function clearPluginBase() {
  localStorage.removeItem("tmd_plugin_base");
  location.reload();
}


