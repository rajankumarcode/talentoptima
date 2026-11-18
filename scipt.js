const adminLogin = document.querySelector(".btn");
const loginMenu = document.querySelector(".login-menu");
const closeLogin = document.querySelector(".close");
const loginButton = document.querySelector("#loginButton");

const email = document.querySelector("#email");
const password = document.querySelector("#password");

// Admin Login button click
adminLogin.addEventListener("click", function (event) {
    event.preventDefault();
    loginMenu.classList.add("is-open");
});

// Close the login popup
closeLogin.addEventListener("click", function (event) {
    event.preventDefault();
    loginMenu.classList.remove("is-open");
});

// Login button click
loginButton.addEventListener("click", function () {

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (emailValue === "" || passwordValue === "") {
        alert("Please enter email and password.");
        return;
    }

    // Temporary login validation
    if (emailValue === "admin@gmail.com" && passwordValue === "admin123") {
       

        window.location.href = "dashboard.html";

    } else {
        alert("Invalid email or password.");
    }
});
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-manu');

navbarToggle.addEventListener('click', () => {
    const isOpen = navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active', isOpen);
    navbarToggle.setAttribute('aria-expanded', String(isOpen));
});
