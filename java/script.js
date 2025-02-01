// Select all buttons
const buttons = document.querySelectorAll('.button-container button');

// Add event listeners to each button
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    alert(`You clicked Button ${index + 1}`);
  });
});

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".button-container");

    // ✅ Make sure the menu is closed when the page loads
    navbar.classList.remove("active");

    // ✅ Toggle menu on button click
    menuToggle.addEventListener("click", function (event) {
        event.stopPropagation();
        navbar.classList.toggle("active");
    });

    // ✅ Close menu when clicking outside
    document.addEventListener("click", function (event) {
        if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
            navbar.classList.remove("active");
        }
    });
});
