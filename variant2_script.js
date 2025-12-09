
// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
let userData = {
    name: '',
    birthdate: '',
    zodiac: ''
};
let attemptsLeft = 2;
let selectedZodiacIndex = 0;
let isSpinning = false;
let currentRotation = 0;
let spinCount = 0;

// Данные знаков зодиака
const zodiacSigns = [
    { name: 'Овен', symbol: '♈', color: '#E63946', description: 'Знак огня, энергии и страсти. Вы прирожденный лидер!' },
    { name: 'Телец', symbol: '♉', color: '#2A9D8F', description: 'Знак земли, стабильности и упорства. Вы цените комфорт и красоту!' },
    { name: 'Близнецы', symbol: '♊', color: '#E9C46A', description: 'Знак воздуха, общения и любознательности. Вы полны идей!' },
    { name: 'Рак', symbol: '♋', color: '#8FB2FF', description: 'Знак воды, эмоций и заботы. Вы чувствительная душа!' },
    { name: 'Лев', symbol: '♌', color: '#F4A261', description: 'Знак огня, творчества и величия. Вы сияете как солнце!' },
    { name: 'Дева', symbol: '♍', color: '#90BE6D', description: 'Знак земли, точности и служения. Вы перфекционист!' },
    { name: 'Весы', symbol: '♎', color: '#F08080', description: 'Знак воздуха, гармонии и справедливости. Вы ищете баланс!' },
    { name: 'Скорпион', symbol: '♏', color: '#9B5DE5', description: 'Знак воды, трансформации и страсти. Вы обладаете магнетизмом!' },
    { name: 'Стрелец', symbol: '♐', color: '#FFA500', description: 'Знак огня, приключений и философии. Вы стремитесь к свободе!' },
    { name: 'Козерог', symbol: '♑', color: '#577590', description: 'Знак земли, амбиций и дисциплины. Вы достигаете целей!' },
    { name: 'Водолей', symbol: '♒', color: '#4CC9F0', description: 'Знак воздуха, инноваций и гуманизма. Вы мыслитель будущего!' },
    { name: 'Рыбы', symbol: '♓', color: '#B5A7D6', description: 'Знак воды, мечтательности и интуиции. Вы творческая душа!' }
];

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initLocalStorage();
    setupFormValidation();
    drawWheel();
    setupScrollAnimations();
});

// === ЗВЕЗДНЫЙ ФОН ===
function initStars() {
    const starsBg = document.getElementById('starsBg');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3}px;
            height: ${Math.random() * 3}px;
            background: ${Math.random() > 0.5 ? '#fff' : '#E8C67A'};
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.7 + 0.3};
            animation: twinkle ${Math.random() * 5 + 3}s infinite alternate;
        `;
        starsBg.appendChild(star);
    }
}

// === АНИМАЦИИ ПРИ СКРОЛЛЕ ===
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.history-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
}

// === ЛОКАЛЬНОЕ ХРАНИЛИЩЕ ===
function initLocalStorage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = (new Date()).toDateString();
    if (lastVisit !== today) {
        localStorage.setItem('attemptsLeft', '2');
        localStorage.setItem('lastVisit', today);
        attemptsLeft = 2;
    } else {
        attemptsLeft = parseInt(localStorage.getItem('attemptsLeft') || '2');
    }
}

function updateAttempts() {
    localStorage.setItem('attemptsLeft', attemptsLeft.toString());
    document.getElementById('attemptsText').textContent = `Осталось попыток: ${attemptsLeft}`;
}

// === СКРОЛЛ К СЕКЦИИ ===
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// === ВАЛИДАЦИЯ ФОРМЫ ===
function setupFormValidation() {
    const form = document.getElementById('userForm');
    const userName = document.getElementById('userName');
    const userBirthdate = document.getElementById('userBirthdate');
    const userZodiac = document.getElementById('userZodiac');
    const userConsent = document.getElementById('userConsent');

    userBirthdate.addEventListener('change', (e) => {
        const date = new Date(e.target.value);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let zodiacIndex = 0;
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiacIndex = 0;
        else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiacIndex = 1;
        else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiacIndex = 2;
        else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiacIndex = 3;
        else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiacIndex = 4;
        else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiacIndex = 5;
        else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiacIndex = 6;
        else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiacIndex = 7;
        else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiacIndex = 8;
        else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) zodiacIndex = 9;
        else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiacIndex = 10;
        else zodiacIndex = 11;

        const zodiacValues = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        userZodiac.value = zodiacValues[zodiacIndex];
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (userName.value.trim().length < 2) {
            document.getElementById('nameError').textContent = 'Введите корректное имя';
            isValid = false;
        } else {
            document.getElementById('nameError').textContent = '';
        }
        if (!userBirthdate.value) {
            document.getElementById('birthdateError').textContent = 'Выберите дату рождения';
            isValid = false;
        } else {
            document.getElementById('birthdateError').textContent = '';
        }
        if (!userZodiac.value) {
            document.getElementById('zodiacError').textContent = 'Выберите знак зодиака';
            isValid = false;
        } else {
            document.getElementById('zodiacError').textContent = '';
        }
        if (!userConsent.checked) {
            document.getElementById('consentError').textContent = 'Необходимо согласие';
            isValid = false;
        } else {
            document.getElementById('consentError').textContent = '';
        }

        if (isValid) {
            userData.name = userName.value.trim();
            userData.birthdate = userBirthdate.value;
            userData.zodiac = userZodiac.options[userZodiac.selectedIndex].text;

            document.getElementById('wheelSection').style.display = 'flex';
            updateAttempts();

            setTimeout(() => {
                scrollToSection('wheelSection');
            }, 300);
        }
    });
}

// === КОЛЕСО РУЛЕТКИ ===
function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 280;
    const anglePerSegment = (2 * Math.PI) / zodiacSigns.length;

    zodiacSigns.forEach((sign, index) => {
        const startAngle = index * anglePerSegment - Math.PI / 2;
        const endAngle = startAngle + anglePerSegment;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, sign.color);
        gradient.addColorStop(1, darkenColor(sign.color, 0.5));
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = 'rgba(232, 198, 122, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(232, 198, 122, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillText(sign.symbol, radius * 0.7, 0);
        ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#E8C67A';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function darkenColor(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * factor);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * factor);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * factor);
    return `rgb(${r}, ${g}, ${b})`;
}

// === ВРАЩЕНИЕ КОЛЕСА ===
function spinWheel() {
    if (isSpinning) return;
    if (attemptsLeft <= 0) {
        alert("У вас закончились попытки на сегодня!");
        return;
    }
    isSpinning = true;
    attemptsLeft--;
    updateAttempts();
    spinCount++;

    const canvas = document.getElementById('wheelCanvas');
    const spinBtn = document.getElementById('spinBtn');
    const selectBtn = document.getElementById('selectBtn');
    const retryBtn = document.getElementById('retryBtn');

    spinBtn.style.display = 'none';
    retryBtn.style.display = 'none';
    selectBtn.style.display = 'none';

    selectedZodiacIndex = Math.floor(Math.random() * zodiacSigns.length);

    const anglePerSegment = 360 / zodiacSigns.length;
    
    // Нормализуем текущее вращение
    const normalizedCurrent = ((currentRotation % 360) + 360) % 360;
    
    let targetAngle = 345 - selectedZodiacIndex * anglePerSegment;
    
    const spins = spinCount === 1 ? 5 : 8;
    targetAngle += 360 * spins;
    
    
    while (targetAngle <= normalizedCurrent) {
        targetAngle += 360;
    }
    
    const newRotation = currentRotation - normalizedCurrent + targetAngle;
    
    canvas.style.transition = 'transform 6s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    canvas.style.transform = `rotate(${newRotation}deg)`;
    currentRotation = newRotation;

    setTimeout(() => {
        isSpinning = false;
        selectBtn.style.display = 'inline-flex';
        if (attemptsLeft > 0) {
            retryBtn.style.display = 'inline-flex';
        }
    }, 6000);
}

// === ВЫБОР ЗНАКА ===
function selectZodiac() {
    const selectedSign = zodiacSigns[selectedZodiacIndex];
    document.getElementById('resultName').textContent = userData.name;
    document.getElementById('resultIcon').textContent = selectedSign.symbol;
    document.getElementById('resultZodiac').textContent = selectedSign.name;
    document.getElementById('resultDescription').textContent = selectedSign.description;

    document.getElementById('resultSection').style.display = 'flex';

    setTimeout(() => {
        scrollToSection('resultSection');
    }, 300);
}

// === СБРОС ПРИЛОЖЕНИЯ ===
function resetApp() {
    window.location.reload();
}

// === МОДАЛЬНОЕ ОКНО ===
function openModal(type) {
    event.preventDefault();
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (type === 'privacy') {
        modalTitle.textContent = 'Политика конфиденциальности';
        modalBody.innerHTML = `
            <p><b>1. Сбор информации</b><br>
            Мы собираем только ту информацию, которую вы добровольно предоставляете: имя и дату рождения.</p>
            <p><b>2. Использование информации</b><br>
            Ваши данные используются исключительно для персонализации опыта использования сайта и не передаются третьим лицам.</p>
            <p><b>3. Хранение данных</b><br>
            Данные хранятся локально в вашем браузере и удаляются автоматически при очистке кэша.</p>
            <p><b>4. Cookies</b><br>
            Мы используем cookies для отслеживания количества попыток и улучшения пользовательского опыта.</p>
        `;
    } else if (type === 'terms') {
        modalTitle.textContent = 'Пользовательское соглашение';
        modalBody.innerHTML = `
            <p><b>1. Принятие условий</b><br>
            Используя данный сайт, вы соглашаетесь с условиями использования.</p>
            <p><b>2. Развлекательный характер</b><br>
            Сайт ChangeZodiac предоставляет развлекательный контент и не несет ответственности за принятие решений на основе предоставленной информации.</p>
            <p><b>3. Ограничения</b><br>
            Каждый пользователь имеет право на 2 попытки в день. Попытки обновляются в полночь по местному времени.</p>
            <p><b>4. Изменения</b><br>
            Мы оставляем за собой право изменять условия использования без предварительного уведомления.</p>
        `;
    }
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};

