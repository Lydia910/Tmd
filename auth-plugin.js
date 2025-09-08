export const PLUGIN_BASE = "https://plugin.example.com";
export const PLUGIN_LOGIN = `${PLUGIN_BASE}/login.html`;   
export const PLUGIN_CHAT  = `${PLUGIN_BASE}/111.html`;    
export const PLUGIN_ME = `${PLUGIN_BASE}/me`;             


export function goToPluginLogin(next = "/chat.html") {
  const url = new URL(PLUGIN_LOGIN);
  url.searchParams.set("next", next); 
  window.location.href = url.toString();
}

export async function isPluginAuthed() {
  try {
    const resp = await fetch(PLUGIN_ME, { credentials: "include" });
    return resp.ok;
  } catch {
    return false;
  }
}
