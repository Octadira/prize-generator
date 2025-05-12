// Script pentru cartonașul de răzuit - joc de tip scratch card
// Acest script permite utilizatorului să interacționeze cu un canvas HTML5 pentru a descoperi premii
const prizes = [
    "Reducere 20% la următoarea comandă 🏷️",
    "Transport Gratuit la orice produs 🚚",
    "Un e-book surpriză despre călătorii 🌍",
    "Acces gratuit la un webinar exclusiv 💻",
    "O consultație gratuită de 30 min 💬",
    "Un set de stickere digitale unice ✨",
    "O șansă dublă la marea extragere 🎟️",
    "Felicitări! Ai câștigat admirația noastră! 😉",
    "Un fundal de desktop personalizat 🖼️",
    "O melodie relaxantă recomandată 🎶",
    "Un șablon util pentru productivitate 📊",
    "O rețetă secretă delicioasă 🍰",
    "Un sfat zilnic inspirațional 💡",
    "Intrare într-un club VIP select 🌟",
    "Un voucher de 50 RON la parteneri 🎁"
];

// Elemente DOM
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d'); // Contextul 2D pentru desenare pe canvas
const prizeDisplayText = document.getElementById('prize-display-text');
const resetBtn = document.getElementById('reset-btn');
const instructionText = document.getElementById('instruction-text');
const progressBar = document.getElementById('progress-bar');

let isDrawing = false; // Flag pentru a indica dacă utilizatorul desenează (ține apăsat mouse/deget)
let prizeRevealed = false; // Flag pentru a indica dacă premiul a fost complet dezvăluit
let currentPrize = ''; // Stochează premiul curent

// Funcție pentru a seta dimensiunile canvas-ului la cele ale containerului său părinte
function resizeCanvas() {
    const container = canvas.parentElement; // Obține elementul părinte al canvas-ului
    canvas.width = container.clientWidth;   // Setează lățimea canvas-ului
    canvas.height = container.clientHeight; // Setează înălțimea canvas-ului
    setupNewCard(); // Reinițializează cartonașul pentru a se potrivi noilor dimensiuni
}

// Funcție pentru a inițializa un nou cartonaș de răzuit
function setupNewCard() {
    prizeRevealed = false; // Resetează flag-ul de premiu dezvăluit
    isDrawing = false;     // Asigură că nu se desenează dacă nu e apăsat mouse-ul

    // Selectează un premiu nou aleatoriu din lista 'prizes'
    const randomIndex = Math.floor(Math.random() * prizes.length);
    currentPrize = prizes[randomIndex];
    prizeDisplayText.textContent = currentPrize; // Afișează premiul (ascuns inițial sub stratul de răzuit)

    // Desenează suprafața de răzuit pe canvas
    ctx.globalCompositeOperation = 'source-over'; // Mod normal de desenare (acoperă ce e dedesubt)
    
    // Creează un gradient pentru aspectul suprafeței de răzuit
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#A0AEC0'); // Culoare de început a gradientului (gri deschis)
    gradient.addColorStop(1, '#718096'); // Culoare de sfârșit a gradientului (gri mediu)
    ctx.fillStyle = gradient; // Setează stilul de umplere la gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Umple canvas-ul cu gradientul

    // Resetează starea butonului și a textului de instrucțiuni
    resetBtn.textContent = 'Cartonaș Nou';
    resetBtn.disabled = false;
    instructionText.textContent = 'Trage cu mouse-ul sau degetul peste zona gri pentru a descoperi premiul!';
    updateProgress(0); // Resetează bara de progres la 0%
}

// Funcția de "răzuire" - se apelează când mouse-ul/degetul se mișcă peste canvas
function scratch(x, y) {
    if (!isDrawing || prizeRevealed) return; // Nu face nimic dacă nu se desenează sau premiul e deja dezvăluit

    ctx.globalCompositeOperation = 'destination-out'; // Mod de "ștergere" - face pixelii transparenți
    ctx.beginPath(); // Începe o nouă cale de desenare
    // Desenează un cerc la poziția cursorului pentru a simula răzuirea
    ctx.arc(x, y, 20, 0, Math.PI * 2, false); // Cercul are raza de 20px
    ctx.fill(); // Umple cercul (practic, șterge acea zonă)
    
    checkProgress(); // Verifică progresul răzuirii
}

// Funcție pentru a verifica procentul de pixeli transparenți (răzuiți)
function checkProgress() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Obține datele pixelilor canvas-ului
    const pixels = imageData.data; // Array-ul de pixeli (R,G,B,A, R,G,B,A, ...)
    let transparentPixels = 0;

    // Verifică fiecare al 16-lea pixel pentru optimizarea performanței (i += 4 * 4)
    // Se verifică canalul Alpha (al 4-lea element pentru fiecare pixel)
    for (let i = 3; i < pixels.length; i += 16) { 
        if (pixels[i] === 0) { // Dacă pixelul este transparent (alpha = 0)
            transparentPixels++;
        }
    }
    const totalCheckPixels = (pixels.length / 4) / 4; // Numărul total de pixeli verificați (ajustat pentru pasul de 4)
    const percentageScratched = (transparentPixels / totalCheckPixels) * 100; // Calculează procentul
    
    updateProgress(percentageScratched); // Actualizează bara de progres

    // Dacă s-a răzuit suficient (ex: > 70%) și premiul nu e încă marcat ca dezvăluit
    if (percentageScratched > 70 && !prizeRevealed) {
        revealFullPrize(); // Dezvăluie complet premiul
    }
}

// Funcție pentru a actualiza lățimea barei de progres
function updateProgress(percentage) {
    const clampedPercentage = Math.min(100, Math.max(0, percentage)); // Asigură că procentul e între 0 și 100
    progressBar.style.width = `${clampedPercentage}%`; // Setează lățimea barei
}

// Funcție pentru a dezvălui complet premiul (șterge tot stratul de răzuit)
function revealFullPrize() {
    prizeRevealed = true; // Marchează premiul ca fiind dezvăluit
    ctx.globalCompositeOperation = 'destination-out'; // Mod de ștergere
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Șterge tot conținutul canvas-ului
    instructionText.textContent = `Ai câștigat: ${currentPrize}`; // Afișează mesajul de câștig
    resetBtn.textContent = 'Alt Cartonaș'; // Schimbă textul butonului
    updateProgress(100); // Setează bara de progres la 100%
}

// Event Listeners pentru interacțiunea cu mouse-ul
canvas.addEventListener('mousedown', (e) => {
    if (prizeRevealed) return; // Nu face nimic dacă premiul e dezvăluit
    isDrawing = true; // Începe desenarea
    canvas.classList.add('scratching'); // Adaugă clasa pentru cursorul 'grabbing'
    scratch(e.offsetX, e.offsetY); // Răzuiește la poziția clicului
});

canvas.addEventListener('mousemove', (e) => {
    if (prizeRevealed) return;
    scratch(e.offsetX, e.offsetY); // Continuă răzuirea la mișcarea mouse-ului (dacă isDrawing e true)
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false; // Oprește desenarea la eliberarea butonului mouse-ului
    canvas.classList.remove('scratching'); // Elimină clasa pentru cursor
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false; // Oprește desenarea dacă mouse-ul iese din canvas
    canvas.classList.remove('scratching');
});

// Event Listeners pentru interacțiunea touch (dispozitive mobile)
canvas.addEventListener('touchstart', (e) => {
    if (prizeRevealed) return;
    isDrawing = true;
    canvas.classList.add('scratching');
    const touch = e.touches[0]; // Obține primul punct de atingere
    const rect = canvas.getBoundingClientRect(); // Obține dimensiunile și poziția canvas-ului
    // Calculează coordonatele atingerii relative la canvas
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    e.preventDefault(); // Previne comportamentul default (ex: scroll-ul paginii)
});

canvas.addEventListener('touchmove', (e) => {
    if (prizeRevealed) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    e.preventDefault();
});

canvas.addEventListener('touchend', () => {
    isDrawing = false;
    canvas.classList.remove('scratching');
});

canvas.addEventListener('touchcancel', () => { // În caz că atingerea este întreruptă
    isDrawing = false;
    canvas.classList.remove('scratching');
});

// Event Listener pentru butonul de reset/cartonaș nou
resetBtn.addEventListener('click', setupNewCard);

// Inițializare la încărcarea paginii și la redimensionarea ferestrei
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
