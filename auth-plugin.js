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
  return null; 
}

export const PLUGIN_BASE  = resolvePluginBase();
export const PLUGIN_LOGIN = PLUGIN_BASE ? `${PLUGIN_BASE}/login.html` : null;
export const PLUGIN_CHAT  = PLUGIN_BASE ? `${PLUGIN_BASE}/111.html`   : null;
export const PLUGIN_ME    = PLUGIN_BASE ? `${PLUGIN_BASE}/me`         : null;

export function goToPluginLogin(next = "/chat.html") {
  if (!PLUGIN_BASE) {
    window.location.href = `/login.html?next=${encodeURIComponent(next)}`;
    return;
  }
  const url = new URL(PLUGIN_LOGIN);
  url.searchParams.set("next", next);
  window.location.href = url.toString();
}

export async function isPluginAuthed() {
  if (!PLUGIN_BASE || !PLUGIN_ME) return false;
  try {
    const resp = await fetch(PLUGIN_ME, { credentials: "include" });
    return resp.ok;
  } catch {
    return false;
  }
}

export function clearPluginBase() {
  localStorage.removeItem("tmd_plugin_base");
}

