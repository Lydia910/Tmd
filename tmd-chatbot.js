// === TMD Chatbot (homepage only) ===
// Minimal widget and integration hooks for future AI plugin.
// Include in index.html: <script src="tmd-chatbot.js" defer></script>

(function () {
  const root = document.getElementById('tmd-chatbot-root');
  if (!root) return;

  // Build the panel markup once (keeps HTML changes minimal)
  root.insertAdjacentHTML('beforeend', `
  <button id="tmd-chatbot-button" aria-label="Open chat">
    <img src="icons/tmd-chatbot-icon-robot.svg" alt="Chatbot" />
  </button>
  <section id="tmd-chatbot-panel" role="dialog" aria-labelledby="tmd-chatbot-title" aria-modal="true" aria-hidden="true">
    <header class="tmd-chatbot-header">
      <div class="tmd-title" id="tmd-chatbot-title">TMD Assistant</div>
      <button class="tmd-close" id="tmd-chatbot-close" aria-label="Close">×</button>
    </header>
    <div class="tmd-messages" id="tmd-chatbot-messages" tabindex="0"></div>
    <form class="tmd-input-row" id="tmd-chatbot-form">
      <input id="tmd-chatbot-input" type="text" autocomplete="off" placeholder="Type your message…" aria-label="Message" />
      <button id="tmd-chatbot-send" type="submit">Send</button>
    </form>
  </section>
`);

  const panel = document.getElementById('tmd-chatbot-panel');
  const btn = document.getElementById('tmd-chatbot-button');
  const closeBtn = document.getElementById('tmd-chatbot-close');
  const form = document.getElementById('tmd-chatbot-form');
  const input = document.getElementById('tmd-chatbot-input');
  const messages = document.getElementById('tmd-chatbot-messages');

  function open() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    setTimeout(() => input.focus(), 0);
  }
  function close() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }
  function toggle() {
    if (panel.classList.contains('open')) close(); else open();
  }

  btn.addEventListener('click', toggle);
  closeBtn.addEventListener('click', close);

  // Close with ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) close();
  });

  function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = 'tmd-msg ' + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // --- Load preferences with fallback (plugin first, then mock) ---
  async function loadPreferences() {
    const endpoints = [
      { url: "https://617654bb26fa.ngrok-free.app/plugin/getPreference.php", label: "plugin" },
      { url: "mock-preference.json", label: "mock" }
    ];

    for (const url of endpoints) {
      try {
        const resp = await fetch(url, { credentials: "include" });
        if (!resp.ok) throw new Error("Failed " + url);
        const prefs = await resp.json();
        console.log(`✅ Loaded preferences from ${ep.label}:`, prefs);
        return prefs;
      } catch (err) {
        console.warn(`❌ Error loading ${ep.label}`, err);
      }
    }
    return {};
  }

  // --- Initialize chatbot with prefs ---
  async function initWithPreferences() {
    const prefs = await loadPreferences();

    if (prefs.title) {
      document.getElementById("tmd-chatbot-title").textContent = prefs.title;
    }
    if (prefs.welcomeMessage) {
      addMessage("bot", prefs.welcomeMessage);
    }
    if (prefs.theme) {
      document.body.dataset.chatTheme = prefs.theme;
    }
    if (prefs.primaryColor) {
      document.documentElement.style.setProperty('--chat-primary', prefs.primaryColor);
    }
    if (prefs.botName) {
      document.getElementById("tmd-chatbot-title").textContent = prefs.botName;
    }
    if (prefs.avatar_img) {
      console.log("Bot avatar URL:", prefs.avatar_img);
    }
  }

  // Simple local echo until the AI plugin is connected
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';

    if (window.tmdChatbot && typeof window.tmdChatbot.handleUserMessage === 'function') {
      try {
        await window.tmdChatbot.handleUserMessage(text, addMessage);
      } catch (err) {
        addMessage('bot', 'Sorry, something went wrong.');
        console.error(err);
      }
    } else {
      // Placeholder bot response
      setTimeout(() => addMessage('bot', "Thanks! We'll connect this to our AI soon."), 400);
    }
  });

  // Expose a tiny public API for the future plugin
  window.tmdChatbot = Object.assign(window.tmdChatbot || {}, {
    open,
    close,
    addMessage,
    handleUserMessage: window.tmdChatbot?.handleUserMessage
  });

  // --- Run init on DOM load ---
  document.addEventListener("DOMContentLoaded", initWithPreferences);
})();
