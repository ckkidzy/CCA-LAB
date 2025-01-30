// Select all buttons
const buttons = document.querySelectorAll('.button-container button');

// Add event listeners to each button
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    alert(`You clicked Button ${index + 1}`);
  });
});
