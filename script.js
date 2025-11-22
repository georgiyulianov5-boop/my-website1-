// script.js
// Полностью переработанная логика вращения/интерфейса + динамические звёзды

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

// ====== DOM элементы ======
const screens = {
  hero: document.getElementById('screen-hero'),
  form: document.getElementById('screen-form'),
  wheel: document.getElementById('screen-wheel'),
  spin: document.getElementById('screen-spin'),
  result: document.getElementById('screen-result'),
  final: document.getElementById('screen-final')
};

const toFormBtn = document.getElementById('to-form');
const startWheelBtn = document.getElementById('start-wheel');
const spinBtn = document.getElementById('spin-btn');
const repeatYesBtn = document.getElementById('repeat-yes');
const repeatNoBtn = document.getElementById('repeat-no');
const finalBackBtn = document.getElementById('final-back');

const inputName = document.getElementById('input-name');
const inputBdate = document.getElementById('input-bdate');
const inputZodiac = document.getElementById('input-zodiac');

const wheelTrack = document.getElementById('wheel-track');
const wheelViewport = document.getElementById('wheel-viewport');

const resultNameEl = document.getElementById('result-name');
const resultSignEl = document.getElementById('result-sign');
const resultZodiacEl = document.getElementById('result-zodiac');
const resultDescEl = document.getElementById('result-desc');

const finalName = document.getElementById('final-name');
const finalSign = document.getElementById('final-sign');
const finalZodiac = document.getElementById('final-zodiac');
const finalDesc = document.getElementById('final-desc');

// ====== Навигация ======
function show(screen){
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
show(screens.hero);

// события навигации
toFormBtn.addEventListener('click', ()=> show(screens.form));
startWheelBtn.addEventListener('click', ()=> {
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
  show(screens.wheel);
});

// повтор и финал
repeatYesBtn.addEventListener('click', ()=> {
  show(screens.wheel);
  setTimeout(()=> startSpin(), 250);
});
repeatNoBtn.addEventListener('click', ()=> show(screens.final));
finalBackBtn.addEventListener('click', ()=> {
  show(screens.hero);
  // сбросим поля и трек
  inputName.value = '';
  inputBdate.value = '';
  inputZodiac.value = '';
  wheelTrack.style.transform = 'translateX(0px)';
  wheelTrack._tx = 0;
});

// enter запускает старт
[inputName, inputBdate].forEach(el => el.addEventListener('keydown', (e)=> {
  if(e.key === 'Enter') startWheelBtn.click();
}));

// ====== Создание звёзд на фоне ======
(function createStars(){
  const starContainer = document.getElementById('stars');
  if(!starContainer) return;
  const COUNT = 48; // не слишком много для мобильных
  for(let i=0;i<COUNT;i++){
    const s = document.createElement('div');
    s.className = 'star';
    const size = (Math.random()*3)+1;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.left = `${Math.random()*100}%`;
    s.style.top = `${Math.random()*100}%`;
    s.style.opacity = (Math.random()*0.6)+0.4;
    const tw = (Math.random()*3)+2;
    const fy = (Math.random()*6)+6;
    s.style.animationDuration = `${tw}s, ${fy}s`;
    starContainer.appendChild(s);
  }
})();

// ====== Инициализация колеса (три повторения для плавного прокручивания) ======
function populateWheel(){
  wheelTrack.innerHTML = '';
  const full = [...ZODIACS, ...ZODIACS, ...ZODIACS];
  full.forEach(z => {
    const it = document.createElement('div');
    it.className = 'wheel-item';
    it.setAttribute('data-key', z.key);
    it.innerHTML = `<div class="z-symbol">${z.symbol}</div><div class="z-name">${z.name}</div>`;
    wheelTrack.appendChild(it);
  });
  // начальное состояние
  wheelTrack._tx = 0;
  wheelTrack.style.transform = 'translateX(0px)';
  // give small delay to ensure layout
  setTimeout(()=> updateItemTransforms(), 30);
}
populateWheel();

// ====== Валидация даты dd.mm.yyyy ======
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

// ====== Spin logic (псевдо-рандом) ======
let spinning = false;

function randomZodiacIndex(){
  return Math.floor(Math.random() * ZODIACS.length);
}

function startSpin(){
  if(spinning) return;
  spinning = true;
  // визуальный экран спина
  show(screens.spin);
  setTimeout(()=> {
    const idx = randomZodiacIndex(); // 0..11
    // целевой индекс внутри трека (средний блок)
    const base = ZODIACS.length;
    const targetIndex = base + idx;
    const items = wheelTrack.querySelectorAll('.wheel-item');
    if(!items.length){
      spinning = false;
      show(screens.wheel);
      return;
    }
    // рассчёт ширины шага
    const itemRect = items[0].getBoundingClientRect();
    const cs = getComputedStyle(items[0]);
    const marginL = parseFloat(cs.marginLeft) || 0;
    const marginR = parseFloat(cs.marginRight) || 0;
    const perStep = itemRect.width + marginL + marginR;

    // позиции
    const containerWidth = wheelTrack.parentElement.clientWidth;
    const item = items[targetIndex];
    const itemOffsetLeft = item.offsetLeft; // relative to wheelTrack
    const itemCenter = itemOffsetLeft + item.offsetWidth/2;

    // хотим несколько полных кругов + остановить на targetIndex в центре
    const rounds = 3;
    const roundWidth = perStep * ZODIACS.length;
    const finalTx = - (rounds * roundWidth + (itemCenter - containerWidth/2));

    // animate from current to finalTx
    const from = wheelTrack._tx || 0;
    const to = finalTx;
    const duration = 6000;
    const start = performance.now();
    function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

    function frame(now){
      const t = Math.min(1, (now - start)/duration);
      const eased = easeOutCubic(t);
      const cur = from + (to - from) * eased;
      wheelTrack.style.transform = `translateX(${cur}px)`;
      wheelTrack._tx = cur;
      // update item transforms (scale/translate) для иллюзии дуги
      updateItemTransforms();
      if(t < 1){
        requestAnimationFrame(frame);
      } else {
        // закончили
        const chosen = ZODIACS[idx];
        spinning = false;
        // небольшой интервал, чтобы не резать переход сразу
        setTimeout(()=> showResult(chosen), 250);
      }
    }
    requestAnimationFrame(frame);
  }, 250);
}

// переход к результату (заполняем текст)
function showResult(z){
  const name = inputName.value.trim() || 'Друже';
  resultNameEl.textContent = name;
  resultSignEl.textContent = z.symbol;
  resultZodiacEl.textContent = z.name;
  resultDescEl.textContent = z.desc;

  finalName.textContent = name;
  finalSign.textContent = z.symbol;
  finalZodiac.textContent = z.name;
  finalDesc.textContent = z.desc;

  show(screens.result);
}

// Обновление трансформации элементов для эффекта дуги
function updateItemTransforms(){
  const items = wheelTrack.querySelectorAll('.wheel-item');
  const vpRect = wheelTrack.parentElement.getBoundingClientRect();
  const vpCenter = vpRect.left + vpRect.width/2;
  items.forEach(it => {
    const r = it.getBoundingClientRect();
    const itemCenter = r.left + r.width/2;
    const dist = Math.abs(vpCenter - itemCenter);
    const norm = Math.min(1, dist / (vpRect.width * 0.6)); // 0..1
    const scale = 1 + (1 - norm) * 0.18; // ближе к центру — чуть больше
    const translateY = - (1 - norm) * 10; // поднимаем центр
    it.style.transform = `translateY(${translateY}px) scale(${scale})`;
    it.style.zIndex = Math.floor((1 - norm) * 100);
  });
}

// ====== Слушатели кнопок/области колеса ======
document.getElementById('spin-btn').addEventListener('click', startSpin);

// тап/свайп на область колеса запускает spin
let touchStartX = 0;
wheelViewport.addEventListener('click', ()=> startSpin());
wheelViewport.addEventListener('pointerdown', (e)=>{
  touchStartX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
});
wheelViewport.addEventListener('pointerup', (e)=>{
  const ux = e.clientX || (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX) || 0;
  if(Math.abs(ux - touchStartX) > 20){
    // свайп — запускаем
    startSpin();
  }
});

// ====== prevention double click while spinning
function disableDuringSpin(el){
  el.addEventListener('click', (ev) => {
    if(spinning){ ev.stopImmediatePropagation(); ev.preventDefault(); }
  }, true);
}
disableDuringSpin(document.getElementById('spin-btn'));
disableDuringSpin(wheelViewport);

// ====== initialize transforms on resize
window.addEventListener('resize', ()=> setTimeout(updateItemTransforms, 60));

// ====== динамический запуск: добавим запуск колеса по кнопке spin на первом показе
// и т.д. (repeat handled above)

// Примечание: места ad-1..ad-7 — оставлены как placeholders.
// Вставляй код Google AdSense или другой сети уже после деплоя (HTTPS + домен).
