// login.js
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("login-modal");
  const openBtns = document.querySelectorAll("[data-login-open]");
  const closeBtns = document.querySelectorAll("[data-login-close]");

  if (!modal) return;


  openBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "block";
      modal.setAttribute("aria-hidden", "false");
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    });
  });
});
