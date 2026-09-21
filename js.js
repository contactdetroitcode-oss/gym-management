const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Email:", email);
    console.log("Password:", password);

    if (email === "admin@gympro.com" && password === "1234") {

        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "./dashboard.html";

    } else {

        alert("Email ou mot de passe incorrect !");

    }

});