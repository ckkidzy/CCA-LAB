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

    menuToggle.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents clicking the button from triggering unwanted effects
        navbar.classList.toggle("active"); // Toggle menu visibility
    });

    // Close the menu if clicked outside
    document.addEventListener("click", function (event) {
        if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
            navbar.classList.remove("active");
        }
    });
});
