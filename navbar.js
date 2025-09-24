// navbar.js
// Loads shared navbar.html into the page (supports #navbar-root and legacy #navbar-container)
// Also wires up: hamburger toggle, active link highlight, and Login (redirect to Plugin login)

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
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    }
  });

  // --- Login (redirect to Plugin login) ---
  // NOTE:
  // We no longer load local login.html into a modal (MFA/CORS/session cookies are fragile in iframes).
  // Instead, redirect to the Plugin's /login.html with ?next=<current path+query>.
  var openers = document.querySelectorAll("[data-login-open]");
  if (openers.length) {
    var PLUGIN_BASE =
      localStorage.getItem("tmd_plugin_base") ||
      "https://617654bb26fa.ngrok-free.app/plugin";

    // Build the next URL (path + query), keep it relative so the plugin can bounce back correctly.
    var next = encodeURIComponent(location.pathname + location.search);

    Array.prototype.forEach.call(openers, function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();

        // Hard redirect is the most reliable for auth (cookies, 2FA, etc.)
        window.location.href = PLUGIN_BASE + "/login.html?next=" + next;

      });
    });
  }
}

// Modal helpers (kept for compatibility; unused in redirect flow)
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
