// navbar.js
// Loads shared navbar.html into the page (supports #navbar-root and legacy #navbar-container)
// Wires up: hamburger toggle, active link highlight, Login redirect, Logout click, and login-state toggle.

(function () {
  var root =
    document.getElementById("navbar-root") ||
    document.getElementById("navbar-container");
  if (!root) return;

  // Avoid double-loading if this script runs more than once
  if (root.dataset.navLoaded) return;

  fetch("navbar.html")
    .then(function (r) { return r.text(); })
    .then(function (html) {
      root.innerHTML = html;
      root.dataset.navLoaded = "1";
      setupNavbarInteractions(root);
    })
    .catch(function (e) {
      console.error("Navbar load failed", e);
    });
})();

function setupNavbarInteractions(scopeEl) {
  // --- Hamburger menu toggle (mobile) ---
  var toggle = scopeEl.querySelector("#nav-toggle");
  var menu = scopeEl.querySelector("#nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("show");
    });
  }

  // --- Active link highlight ---
  var path = location.pathname.split("/").pop() || "index.html";
  var links = scopeEl.querySelectorAll("a[href]");
  Array.prototype.forEach.call(links, function (link) {
    var href = (link.getAttribute("href") || "").split("/").pop();
    if (href && href === path) {
      link.classList.add("active");
    }
  });

  // --- Login redirect with fallback ---
  var loginOpeners = scopeEl.querySelectorAll("[data-login-open]");
  if (loginOpeners.length) {
    var PLUGIN_BASE =
      localStorage.getItem("tmd_plugin_base") ||
      "https://617654bb26fa.ngrok-free.app/plugin";
    var next = encodeURIComponent(location.pathname + location.search);

    Array.prototype.forEach.call(loginOpeners, function (btn) {
      btn.addEventListener("click", async function (ev) {
        ev.preventDefault();

        try {
          // test plugin login.html is reachable
          const resp = await fetch(PLUGIN_BASE + "/login.html", { method: "HEAD" });
          if (resp.ok) {
            window.location.href = PLUGIN_BASE + "/login.html?next=" + next;
            return;
          }
        } catch (e) {
          console.warn("Plugin login not available, using local fallback");
        }

        // === fallback: open local login.html inside modal ===
        var modal = document.getElementById("login-modal");
        var body  = document.getElementById("login-modal-body");
        if (body) {
          body.innerHTML =
            '<iframe src="login.html" style="width:100%;height:70vh;border:0;"></iframe>';
        }
        openModal(modal);
      });
    });
  }

  // --- Logout click ---
  (function () {
    var btn = scopeEl.querySelector('#logoutBtn');
    if (!btn) return;

    var PLUGIN_BASE =
      localStorage.getItem('tmd_plugin_base') ||
      'https://617654bb26fa.ngrok-free.app/plugin';

    btn.addEventListener('click', function () {
      window.location.href = PLUGIN_BASE + '/auth/logout.php';
    });
  })();

  // --- Toggle Login/Logout by auth status ---
  (function () {
    var PLUGIN_BASE =
      localStorage.getItem('tmd_plugin_base') ||
      'https://617654bb26fa.ngrok-free.app/plugin';
    var STATUS_URL = PLUGIN_BASE + '/auth/status.php';

    var loginLink  = scopeEl.querySelector('[data-login-open]');
    var logoutBtn  = scopeEl.querySelector('#logoutBtn');

    if (!loginLink && !logoutBtn) return;

    var ctrl = new AbortController();
    var to = setTimeout(function(){ ctrl.abort(); }, 6000);

    fetch(STATUS_URL, {
      credentials: "include",
      signal: ctrl.signal,
      headers: { "Accept": "application/json" }
    })
      .then(function (r) {
        clearTimeout(to);
        if (!r.ok) throw new Error('status not ok');
        return r.json();
      })
      .then(function (j) {
        var authed = !!(j && j.logged_in);

        if (loginLink) loginLink.style.display = authed ? 'none' : '';
        if (logoutBtn) logoutBtn.style.display = authed ? '' : 'none';
      })
      .catch(function () {
        if (loginLink) loginLink.style.display = '';
        if (logoutBtn) logoutBtn.style.display = 'none';
      });
  })();
}

function openModal(modal) {
  if (!modal) return;
  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(modal) {
  if (!modal) return;
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}
