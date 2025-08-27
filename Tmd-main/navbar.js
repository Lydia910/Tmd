// navbar.js
// Dynamically load the shared navbar.html into the page

fetch('navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;

    // Bind the hamburger menu toggle after navbar is loaded
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        menu.classList.toggle("show");
      });
    }

    // Highlight the active link based on current page URL
    const current = location.pathname.split("/").pop();
    document.querySelectorAll('#nav-menu a').forEach(link => {
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  });
