// script.js
// Клиентская логика: переходы экранов, валидация, колесо (псевдо-рандом) и результаты.

// ====== Конфигурация знаков ======
const ZODIACS = [
  { key: "Aries",  name: "Овен",       symbol: "♈", desc: "Энергичный, смелый и напористый." },
  { key: "Taurus", name: "Телец",      symbol: "♉", desc: "Надёжный, практичный, терпеливый." },
  { key: "Gemini", name: "Близнецы",   symbol: "♊", desc: "Любопытный, общительный, лёгкий." },
  { key: "Cancer", name: "Рак",        symbol: "♋", desc: "Чувствительный, заботливый, интуитивный." },
  { key: "Leo",    name: "Лев",        symbol: "♌", desc: "Щедрый, творческий, харизматичный." },
  { key: "Virgo",  name: "Дева",       symbol: "♍", desc: "Внимательный, организованный, критичный." },
  { key: "Libra",  name: "Весы",       symbol: "♎", desc: "Дипломатичный, любит красоту и гармонию." },
  { key: "Scorpio",name: "Скорпион",   symbol: "♏", desc: "Страстный, глубокий, проницательный." },
  { key: "Sagittarius", name: "Стрелец",symbol: "♐", desc: "Оптимистичный, свободолюбивый, искатель." },
  { key: "Capricorn", name: "Козерог", symbol: "♑", desc: "Целеустремлённый, серьёзный, практичный." },
  { key: "Aquarius", name: "Водолей",  symbol: "♒", desc: "Оригинальный, мыслитель, гуманист." },
  { key: "Pisces", name: "Рыбы",       symbol: "♓", desc: "Мечтательный, эмпатичный, креативный." }
];

// ====== UI элементы ======
const screens = {
  hero: document.getElementById('screen-hero'),
  form: document.getElementById('screen-form'),
  wheel: document.getElementById('screen-wheel'),
  spin: document.getElementById('screen-spin'),
  result: document.getElementById('screen-result'),
  final: document.getElementById('screen-final')
};

const toFormBtn = document.getElementById('to-form');
const backHeroBtn = document.getElementById('back-hero');
const startWheelBtn = document.getElementById('start-wheel');
const spinBtn = document.getElementById('spin-btn');
const repeatYesBtn = document.getElementById('repeat-yes');
const repeatNoBtn = document.getElementById('repeat-no');
const finalBackBtn = document.getElementById('final-back');

const inputName = document.getElementById('input-name');
const inputBdate = document.getElementById('input-bdate');
const inputZodiac = document.getElementById('input-zodiac');

const wheelTrack = document.getElementById('wheel-track');
const resultNameEl = document.getElementById('result-name');
const resultSignEl = document.getElementById('result-sign');
const resultZodiacEl = document.getElementById('result-zodiac');
const resultDescEl = document.getElementById('result-desc');

const finalName = document.getElementById('final-name');
const finalSign = document.getElementById('final-sign');
const finalZodiac = document.getElementById('final-zodiac');
const finalDesc = document.getElementById('final-desc');

// ====== Навигация экранов ======
function show(screen){
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

// Начальное состояние
show(screens.hero);

// кнопки переходов
toFormBtn.addEventListener('click', () => show(screens.form));
backHeroBtn.addEventListener('click', () => show(screens.hero));
document.getElementById('back-form').addEventListener('click', () => show(screens.form));

// === Инициализация колеса: добавим элементы ===
function populateWheel(){
  wheelTrack.innerHTML = '';
  // Чтобы создать эффект бесконечного трека — добавим дважды список
  const fullList = [...ZODIACS, ...ZODIACS, ...ZODIACS];
  fullList.forEach((z) => {
    const it = document.createElement('div');
    it.className = 'wheel-item';
    it.setAttribute('data-key', z.key);
    it.innerHTML = `<div class="z-symbol">${z.symbol}</div><div class="z-name">${z.name}</div>`;
    wheelTrack.appendChild(it);
  });
}
populateWheel();

// ====== Простая валидaция даты dd.mm.yyyy ======
function validDate(str){
  if(!str) return false;
  const m = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if(!m) return false;
  const d = +m[1], mo = +m[2], y = +m[3];
  if(mo<1||mo>12) return false;
  const mdays = [31, (y%4===0 && y%100!==0)||y%400===0?29:28,31,30,31,30,31,31,30,31,30,31];
  if(d<1||d>mdays[mo-1]) return false;
  return true;
}

// функция для псевдо-рандомного выбора индекса (0..11)
function randomZodiacIndex(){
  return Math.floor(Math.random()*ZODIACS.length);
}

// смещение трека так, чтобы выбранный знак оказался в центре viewport
function scrollToSign(centerIndex, animate=true){
  // каждый элемент ширина + gap прибл. (используем DOM)
  const items = wheelTrack.querySelectorAll('.wheel-item');
  if(!items.length) return;
  const containerWidth = wheelTrack.parentElement.clientWidth;
  const item = items[centerIndex];
  const itemRect = item.getBoundingClientRect();
  const trackRect = wheelTrack.getBoundingClientRect();
  // вычислим текущ transform
  const itemCenter = (itemRect.left - trackRect.left) + itemRect.width/2;
  const desired = (wheelTrack.scrollWidth/2 - containerWidth/2); // not used
  // простая версия: смещаем transform так, чтобы центр выбранного элемента совпал с центром viewport
  const currentTransform = getComputedStyle(wheelTrack).transform;
  // compute offset:
  const trackLeft = wheelTrack.getBoundingClientRect().left;
  const viewportCenter = wheelTrack.parentElement.getBoundingClientRect().left + containerWidth/2;
  const shift = (viewportCenter - (itemRect.left + itemRect.width/2));
  // применим translateX
  const prev = wheelTrack._tx || 0;
  const newtx = prev + shift;
  wheelTrack._tx = newtx;
  if(animate){
    wheelTrack.style.transition = 'transform 2.8s cubic-bezier(.22,.9,.35,1)';
  } else {
    wheelTrack.style.transition = 'none';
  }
  wheelTrack.style.transform = `translateX(${newtx}px)`;
}

// ====== Основная логика вращения (псевдо-рандом) ======
function doSpin(oneTime=true){
  show(screens.spin);
  // небольшой таймаут для плавности перехода
  setTimeout(() => {
    // выбираем случайный знак (0..11)
    const idx = randomZodiacIndex();
    // из-за тройного повторения в populateWheel возьмем центральный диапазон
    // central block offset:
    const base = ZODIACS.length; // 12
    const targetIndex = base + idx; // в середине трека
    // вычисляем конечный translate: мы используем scrollToSign, но оно считает смещение от текущего положения
    // Для стабильности — установим стартовую позицию так, чтобы центр трека показывал первый элемент блока base
    // Сброс transform и выставление стартовой позиции:
    wheelTrack.style.transition = 'none';
    wheelTrack.style.transform = 'translateX(0px)';
    wheelTrack._tx = 0;

    // небольшая задержка перед анимацией
    setTimeout(() => {
      // вращение: эффект ускорение -> равномерно -> замедление
      // длительность "внешней анимации" 6 секунд
      // Для ощущения — мы сначала сдвинем трек на несколько кругов, затем подберём центр на targetIndex
      // вычислим длину одного шага:
      const items = wheelTrack.querySelectorAll('.wheel-item');
      const perItemWidth = items[0].getBoundingClientRect().width + 12; // margin gap ~12
      // количество шагов: несколько кругов (например, 3 круга) + поход к targetIndex
      const totalSteps = (ZODIACS.length * 3) + idx;
      const totalShift = - totalSteps * perItemWidth;
      // анимируем transform вручную (плавное easing)
      const duration = 6000; // 6s
      const start = performance.now();
      const from = wheelTrack._tx || 0;
      const to = from + totalShift;
      function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
      function frame(now){
        const t = Math.min(1, (now - start)/duration);
        const eased = easeOutCubic(t);
        const cur = from + (to - from) * eased;
        wheelTrack.style.transform = `translateX(${cur}px)`;
        wheelTrack._tx = cur;
        if(t < 1){
          requestAnimationFrame(frame);
        } else {
          // закончили — покажем результат
          const chosen = ZODIACS[idx];
          showResult(chosen);
        }
      }
      requestAnimationFrame(frame);
    }, 120);
  }, 300);
}

// ====== Показать результат ======
function showResult(z){
  // персонализация
  const name = inputName.value.trim() || 'Друже';
  resultNameEl.textContent = name;
  resultSignEl.textContent = z.symbol;
  resultZodiacEl.textContent = z.name;
  resultDescEl.textContent = z.desc;

  // final screen data
  finalName.textContent = name;
  finalSign.textContent = z.symbol;
  finalZodiac.textContent = z.name;
  finalDesc.textContent = z.desc;

  show(screens.result);
}

// ====== Прослушка кнопок ======
startWheelBtn.addEventListener('click', () => {
  // валидация
  const name = inputName.value.trim();
  const bdate = inputBdate.value.trim();
  if(!name){
    alert('Пожалуйста, укажи имя.');
    inputName.focus();
    return;
  }
  if(bdate && !validDate(bdate)){
    alert('Пожалуйста, введи корректную дату в формате dd.mm.yyyy или оставь поле пустым.');
    inputBdate.focus();
    return;
  }
  // идём к экрану колеса
  show(screens.wheel);
});

spinBtn.addEventListener('click', () => {
  doSpin();
});

repeatYesBtn.addEventListener('click', () => {
  // повтор — вернёмся на экран wheel и запустим spin
  show(screens.wheel);
  setTimeout(() => doSpin(), 300);
});

repeatNoBtn.addEventListener('click', () => {
  // финальный экран
  show(screens.final);
});

finalBackBtn.addEventListener('click', () => {
  // возвращаемся на главный экран
  show(screens.hero);
  // сброс полей при желании:
  inputName.value = '';
  inputBdate.value = '';
  inputZodiac.value = '';
  // reset wheel transform
  wheelTrack.style.transform = 'translateX(0px)';
  wheelTrack._tx = 0;
});

// Удобства: enter на полях запускает действие
[inputName, inputBdate].forEach(el => {
  el.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') startWheelBtn.click();
  });
});

/* Примечание по рекламе:
   - В DOM есть блоки ad-1 ... ad-7 — впиши туда код Google AdSense (или другого провайдера) после публикации.
   - Не вставляй тестовые/локальные скрипты AdSense на локальном файле: некоторые сети требуют HTTPS и домен.
*/

/* Дополнения/улучшения (по желанию):
   - Подключить реальные SVG-иконки знаков.
   - Улучшить физику вращения (использовать canvas или svg).
   - Интерграция с GA4/AdSense и модальным управлением Cookie.
*/
