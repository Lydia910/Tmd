// navbar.js
// Loads shared navbar.html into the page (supports #navbar-root and legacy #navbar-container)
// Also wires up: hamburger toggle, active link highlight, and Login modal (popup)

(function () {
  var root =
    document.getElementById("navbar-root") ||
    document.getElementById("navbar-container");
  if (!root) return;

  // Avoid double-loading if this script runs more than once
  if (root.dataset.navLoaded) return;

  fetch("navbar.html")
    .then(function (r) {
      return r.text();
    })
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

  // --- Login modal logic ---
  var openers = document.querySelectorAll("[data-login-open]");
  var modal = document.getElementById("login-modal");
  if (openers.length && modal) {
    var body = document.getElementById("login-modal-body");

    Array.prototype.forEach.call(openers, function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();

        // Lazy-load login.html main content (once)
        if (body && !body.dataset.loaded) {
          fetch("login.html")
            .then(function (r) {
              return r.text();
            })
            .then(function (html) {
              var tmp = document.createElement("div");
              tmp.innerHTML = html;
              // Prefer <main>, fallback to <form> or whole <body>
              var inner =
                tmp.querySelector("main") ||
                tmp.querySelector("form") ||
                tmp.querySelector("body");
              body.innerHTML = inner ? inner.innerHTML : html;
              body.dataset.loaded = "1";
            })
            .catch(function () {
              body.innerHTML = "<p>Failed to load. Please try again.</p>";
            });
        }

        openModal(modal);
      });
    });

    // Close buttons / backdrop / ESC
    modal.addEventListener("click", function (e) {
      if (e.target.matches("[data-login-close]") || e.target === modal) {
        closeModal(modal);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal(modal);
      }
    });
  }
}

function openModal(modal) {
  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}


