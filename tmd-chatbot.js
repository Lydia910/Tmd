// === TMD Chatbot (homepage only) ===
// Minimal widget and integration hooks for future AI plugin.
// Include in index.html: <script src="tmd-chatbot.js" defer></script>

(function () {
  const root = document.getElementById('tmd-chatbot-root');
  if (!root) return;

  // Build the panel markup once (keeps HTML changes minimal)
  root.insertAdjacentHTML('beforeend', `
    <button id="tmd-chatbot-button" aria-label="Open chat">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 2H4a2 2 0 0 0-2 2v14l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" fill="currentColor"/>
        <circle cx="8" cy="10" r="1.6" fill="#fff"/>
        <circle cx="12" cy="10" r="1.6" fill="#fff"/>
        <circle cx="16" cy="10" r="1.6" fill="#fff"/>
      </svg>
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
    /**
     * userText: Text entered by the user
     * addMessage(role, text): Call this to add a message to the UI (role = “user” | “bot”)
     * Integrate your API/plugin here, then send the reply back using addMessage(“bot”, “...”)
     * Set a handler that receives (text, addMessage).
     * The handler should call addMessage('bot', reply) when it has a result.
     * Example:
     *   window.tmdChatbot.handleUserMessage = async (text, add) => {
     *     const reply = await fetch('/your/api', {method:'POST', body: JSON.stringify({text})})
     *                         .then(r => r.json()).then(d => d.answer);
     *     add('bot', reply);
     *   };
     */
    handleUserMessage: window.tmdChatbot?.handleUserMessage
  });
})();
