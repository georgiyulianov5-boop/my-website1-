// Список знаков и их иконок
const signs = [
  { name: 'Овен', icon: 'assets/icons/aries.svg' },
  { name: 'Телец', icon: 'assets/icons/taurus.svg' },
  // ...другие 10 знаков...
  { name: 'Рыбы', icon: 'assets/icons/pisces.svg' }
];

let tries = localStorage.getItem('tries') || 2;
document.getElementById('tries').textContent = tries;

// Автозаполнение знака по дате (упрощённо)
document.getElementById('birthdate').addEventListener('change', e => {
  const month = e.target.value.split('-')[1];
  const idx = (parseInt(month, 10) + 10) % 12; // примерная логика
  document.getElementById('zodiac').value = signs[idx].name;
});

// Обработка вращения
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const size = canvas.width;
const arc = (2 * Math.PI) / signs.length;

// Рисуем колесо
signs.forEach((s, i) => {
  const start = i * arc;
  ctx.beginPath();
  ctx.fillStyle = i % 2 === 0 ? '#1E1E2A' : '#292A38';
  ctx.moveTo(size/2, size/2);
  ctx.arc(size/2, size/2, size/2, start, start + arc);
  ctx.fill();
  // иконки пропускаем для краткости…
});

// Вращение
document.getElementById('spinBtn').onclick = () => {
  if (tries <= 0) return alert('Попытки закончились');
  tries--;
  localStorage.setItem('tries', tries);
  document.getElementById('tries').textContent = tries;

  const randomIdx = Math.floor(Math.random() * signs.length);
  const spinAngle = 3600 + randomIdx * (360 / signs.length);

  canvas.style.transition = 'transform 6s ease-out';
  canvas.style.transform = `rotate({spinAngle}deg)`;

  canvas.addEventListener('transitionend', () => {
    showResult(randomIdx);
    canvas.style.transition = '';
    canvas.style.transform = '';
  }, { once: true });
};

// Показ результата
function showResult(idx) {
  document.getElementById('userName').textContent = document.getElementById('name').value;
  document.getElementById('userZodiac').textContent = signs[idx].name;
  document.getElementById('zodiacIcon').src = signs[idx].icon;
  document.getElementById('result').classList.remove('hidden');
}

// Повтор
document.getElementById('retryBtn').onclick = () => {
  document.getElementById('result').classList.add('hidden');
};
