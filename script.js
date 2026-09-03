const greeting = document.querySelector('#greeting');
const toggleButton = document.querySelector('#toggle-greeting');

toggleButton.addEventListener('click', () => {
  greeting.textContent = greeting.textContent === 'Helló!' ? 'Szia!' : 'Helló!';
});
