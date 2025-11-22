// === CONFIG ===
const ZODIACS = [
  { key:"Aries", name:"Овен", symbol:"♈", desc:"Энергичный, смелый..." },
  { key:"Taurus", name:"Телец", symbol:"♉", desc:"Надёжный, практичный..." },
  { key:"Gemini", name:"Близнецы", symbol:"♊", desc:"Любопытный, общительный..." },
  { key:"Cancer", name:"Рак", symbol:"♋", desc:"Чувствительный, заботливый..." },
  { key:"Leo", name:"Лев", symbol:"♌", desc:"Щедрый, творческий..." },
  { key:"Virgo", name:"Дева", symbol:"♍", desc:"Организованный, внимательный..." },
  { key:"Libra", name:"Весы", symbol:"♎", desc:"Гармоничный, дипломатичный..." },
  { key:"Scorpio", name:"Скорпион", symbol:"♏", desc:"Глубокий, страстный..." },
  { key:"Sagittarius", name:"Стрелец", symbol:"♐", desc:"Свободолюбивый, оптимистичный..." },
  { key:"Capricorn", name:"Козерог", symbol:"♑", desc:"Целеустремлённый..." },
  { key:"Aquarius", name:"Водолей", symbol:"♒", desc:"Оригинальный мыслитель..." },
  { key:"Pisces", name:"Рыбы", symbol:"♓", desc:"Мечтательный, эмпатичный..." }
];

// === SCREENS ===
const screens = {
  hero: document.getElementById("screen-hero"),
  form: document.getElementById("screen-form"),
  wheel: document.getElementById("screen-wheel"),
  result: document.getElementById("screen-result"),
  final: document.getElementById("screen-final")
};
function show(s){ Object.values(screens).forEach(x=>x.classList.remove("active")); s.classList.add("active"); }

// === ELEMENTS ===
const inputName = document.getElementById("input-name");
const inputBdate = document.getElementById("input-bdate");
const wheelTrack = document.getElementById("wheel-track");
const wheelViewport = document.getElementById("wheel-viewport");

const resultNameEl = document.getElementById("result-name");
const resultSignEl = document.getElementById("result-sign");
const resultZodiacEl = document.getElementById("result-zodiac");
const resultDescEl = document.getElementById("result-desc");

const finalName = document.getElementById("final-name");
const finalSign = document.getElementById("final-sign");
const finalZodiac = document.getElementById("final-zodiac");
const finalDesc = document.getElementById("final-desc");

// === NAVIGATION ===
document.getElementById("to-form").onclick = ()=> show(screens.form);
document.getElementById("start-wheel").onclick = ()=>{
  if(!inputName.value.trim()){ alert("Введите имя"); return; }
  show(screens.wheel);
};

// === CREATE WHEEL ITEMS ===
function populateWheel(){
  wheelTrack.innerHTML = "";
  const full = [...ZODIACS, ...ZODIACS, ...ZODIACS];
  full.forEach(z=>{
    const d=document.createElement("div");
    d.className="wheel-item";
    d.setAttribute("data-key",z.key);
    d.innerHTML=`<div class="z-symbol">${z.symbol}</div><div>${z.name}</div>`;
    wheelTrack.appendChild(d);
  });
  wheelTrack._tx=0;
  wheelTrack.style.transform="translateX(0px)";
}
populateWheel();

// === RESULT ===
function showResult(z){
  const name = inputName.value.trim();
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

// === SPIN ===
let spinning=false;

function startSpin(){
  if(spinning) return;
  spinning=true;

  const idx = Math.floor(Math.random()*12);
  const chosen = ZODIACS[idx];

  const items = wheelTrack.querySelectorAll(".wheel-item");
  const base = 12;
  const targetIndex = base + idx;

  const r = items[0].getBoundingClientRect();
  const cs = getComputedStyle(items[0]);
  const step = r.width + parseFloat(cs.marginLeft)+parseFloat(cs.marginRight);

  const containerWidth = wheelViewport.clientWidth;
  const item = items[targetIndex];
  const center = item.offsetLeft + item.offsetWidth/2;
  const finalTx = -(3*12*step + (center - containerWidth/2));

  const from = wheelTrack._tx || 0;
  const to = finalTx;

  const duration = 6000;
  const start = performance.now();
  function ease(t){return 1-Math.pow(1-t,3);}

  function frame(now){
    const t = Math.min(1, (now-start)/duration);
    const v = from+(to-from)*ease(t);
    wheelTrack.style.transform=`translateX(${v}px)`;
    wheelTrack._tx=v;

    if(t<1) requestAnimationFrame(frame);
    else {
      spinning=false;
      setTimeout(()=> showResult(chosen),300);
    }
  }
  requestAnimationFrame(frame);
}

// Button + tap
document.getElementById("spin-btn").onclick = startSpin;
wheelViewport.onclick = startSpin;

// === REPEAT ===
document.getElementById("repeat-yes").onclick = ()=>{ show(screens.wheel); setTimeout(startSpin,200); };
document.getElementById("repeat-no").onclick = ()=> show(screens.final);
document.getElementById("final-back").onclick = ()=> show(screens.hero);
