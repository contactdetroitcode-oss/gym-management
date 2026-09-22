const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const loginError = document.getElementById("loginError");


/* =========================
   ADMIN LOGIN
========================= */

const ADMIN_EMAIL = "admin@gympro.com";

const ADMIN_PASSWORD = "admin123";


/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = emailInput.value.trim();

    const password = passwordInput.value.trim();

    loginError.textContent = "";


    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {

        localStorage.setItem(
            "isLoggedIn",
            "true"
        );

        localStorage.setItem(
            "adminEmail",
            email
        );

        window.location.href = "dashboard.html";

    } else {

        loginError.textContent =
            "Email ou mot de passe incorrect.";

        passwordInput.value = "";

        passwordInput.focus();

    }

});