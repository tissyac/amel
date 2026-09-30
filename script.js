const rainCanvas = document.getElementById('digital-rain');
const particleCanvas = document.getElementById('particle-layer');
const rainContext = rainCanvas.getContext('2d');
const particleContext = particleCanvas.getContext('2d');
const messageElement = document.getElementById('message');
const cakeScene = document.getElementById('cake-scene');
const cakeWish = document.getElementById('cake-wish');
const blowButton = document.getElementById('blow-candles');
const replayButton = document.getElementById('replay');

const characters = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\{}[]$#@%&*+−×';
const rain = [];
const particles = [];
const scenes = [
    { text: '3', fadeIn: 520, hold: 520, fadeOut: 460 },
    { text: '2', fadeIn: 520, hold: 520, fadeOut: 460 },
    { text: '1', fadeIn: 520, hold: 520, fadeOut: 460 },
    { text: 'HAPPY', fadeIn: 650, hold: 1450, fadeOut: 650 },
    { text: 'BIRTHDAY', fadeIn: 720, hold: 1750, fadeOut: 680 },
    { text: 'TO', fadeIn: 600, hold: 1150, fadeOut: 580 },
    { text: 'MON AMOUR', fadeIn: 900, hold: 4200, fadeOut: 1500, finale: true }
];

let viewport = { width: 0, height: 0, ratio: 1 };
let animationFrame;
let sceneIndex = -1;
let sceneStartedAt = 0;
let sequenceStartsAt = 0;
let finalBurstStarted = false;
let messageRevealTimers = [];

function randomCharacter() {
    return characters[Math.floor(Math.random() * characters.length)];
}

function resizeCanvas(canvas, context) {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * scale);
    canvas.height = Math.floor(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
}

function resizeScene() {
    viewport = { width: window.innerWidth, height: window.innerHeight, ratio: window.innerWidth / window.innerHeight };
    resizeCanvas(rainCanvas, rainContext);
    resizeCanvas(particleCanvas, particleContext);
    createRain();
}

function createRain() {
    rain.length = 0;
    const fontSize = viewport.width < 600 ? 13 : 16;
    const columnCount = Math.ceil(viewport.width / fontSize);

    for (let index = 0; index < columnCount; index += 1) {
        const length = Math.floor(7 + Math.random() * (viewport.height / fontSize) * .45);
        rain.push({
            x: index * fontSize + Math.random() * 8,
            y: Math.random() * viewport.height - viewport.height,
            speed: 36 + Math.random() * 105,
            length,
            fontSize,
            opacity: .18 + Math.random() * .56,
            changeAt: Math.random() * 100,
            drift: (Math.random() - .5) * .12
        });
    }
}

function drawRain(delta) {
    rainContext.fillStyle = 'rgba(3, 0, 5, .17)';
    rainContext.fillRect(0, 0, viewport.width, viewport.height);
    rainContext.font = `${rain[0]?.fontSize || 16}px 'Rajdhani', monospace`;
    rainContext.textAlign = 'center';
    rainContext.shadowBlur = 8;

    rain.forEach((column) => {
        column.y += column.speed * delta;
        column.x += column.drift;
        if (column.y - column.length * column.fontSize > viewport.height) {
            column.y = -Math.random() * viewport.height * .7;
            column.speed = 36 + Math.random() * 105;
            column.length = Math.floor(7 + Math.random() * (viewport.height / column.fontSize) * .45);
        }

        for (let trailIndex = 0; trailIndex < column.length; trailIndex += 1) {
            const y = column.y - trailIndex * column.fontSize;
            if (y < -column.fontSize || y > viewport.height + column.fontSize) continue;
            const fade = 1 - trailIndex / column.length;
            const isHead = trailIndex === 0;
            const occasionalFlash = Math.random() > .992;
            const alpha = fade * column.opacity * (isHead ? 1 : .58);
            rainContext.fillStyle = isHead || occasionalFlash
                ? `rgba(255, ${occasionalFlash ? 235 : 175}, ${occasionalFlash ? 248 : 205}, ${Math.min(1, alpha + .28)})`
                : `rgba(255, 45, 151, ${alpha})`;
            rainContext.shadowColor = '#ff168b';
            rainContext.shadowBlur = isHead ? 15 : 5;
            rainContext.fillText(randomCharacter(), column.x, y);
        }
    });
    rainContext.shadowBlur = 0;
}

function createParticle(x, y, burst = false) {
    const angle = Math.random() * Math.PI * 2;
    const speed = burst ? 35 + Math.random() * 150 : 8 + Math.random() * 22;
    const life = burst ? 900 + Math.random() * 1800 : 900 + Math.random() * 1300;
    particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (burst ? 10 : 0),
        size: 1 + Math.random() * (burst ? 2.8 : 1.8),
        life,
        maxLife: life,
        color: Math.random() > .25 ? '#ff4fa3' : '#ffc4e4'
    });
}

function emitAmbientParticles() {
    if (particles.length < 80 && Math.random() > .35) {
        createParticle(Math.random() * viewport.width, viewport.height * (.25 + Math.random() * .55));
    }
}

function emitFinaleBurst() {
    for (let index = 0; index < 130; index += 1) {
        createParticle(viewport.width / 2, viewport.height / 2, true);
    }
    finalBurstStarted = true;
}

function drawParticles(delta) {
    particleContext.clearRect(0, 0, viewport.width, viewport.height);
    emitAmbientParticles();
    particleContext.shadowBlur = 12;

    particles.forEach((particle) => {
        particle.life -= delta * 1000;
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.vy += delta * 8;
        const alpha = Math.max(0, particle.life / particle.maxLife);
        particleContext.globalAlpha = alpha;
        particleContext.fillStyle = particle.color;
        particleContext.shadowColor = particle.color;
        particleContext.beginPath();
        particleContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        particleContext.fill();
    });

    particleContext.globalAlpha = 1;
    particleContext.shadowBlur = 0;
    for (let index = particles.length - 1; index >= 0; index -= 1) {
        if (particles[index].life <= 0) particles.splice(index, 1);
    }
}

function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
}

function easeInCubic(value) {
    return value * value * value;
}

function setMessage(text) {
    messageRevealTimers.forEach((timer) => window.clearTimeout(timer));
    messageRevealTimers = [];
    messageElement.classList.remove('characters-visible', 'glitch');
    messageElement.replaceChildren();

    Array.from(text).forEach((character, index) => {
        const letter = document.createElement('span');
        letter.className = 'message-char';
        letter.style.setProperty('--char-index', index);
        letter.textContent = character === ' ' ? '\u00a0' : randomCharacter();
        messageElement.appendChild(letter);

        const timer = window.setTimeout(() => {
            letter.textContent = character === ' ' ? '\u00a0' : character;
            letter.classList.add('settled');
        }, 100 + index * 40);
        messageRevealTimers.push(timer);
    });

    messageElement.dataset.text = text;
    messageElement.dataset.word = text;
    messageElement.setAttribute('aria-label', text);
    requestAnimationFrame(() => messageElement.classList.add('characters-visible'));
}

function showNextScene(now) {
    sceneIndex += 1;
    if (sceneIndex >= scenes.length) return;
    const scene = scenes[sceneIndex];
    sceneStartedAt = now;
    setMessage(scene.text);
    if (scene.finale) emitFinaleBurst();
}

function animateMessage(now) {
    if (sceneIndex < 0) {
        if (now >= sequenceStartsAt) showNextScene(now);
        return;
    }

    const scene = scenes[sceneIndex];
    const elapsed = now - sceneStartedAt;
    const total = scene.fadeIn + scene.hold + scene.fadeOut;
    let opacity;
    let scale;

    if (elapsed < scene.fadeIn) {
        const progress = easeOutCubic(elapsed / scene.fadeIn);
        opacity = progress;
        scale = .78 + progress * .22;
    } else if (elapsed < scene.fadeIn + scene.hold) {
        opacity = 1;
        scale = 1 + Math.sin(elapsed * .002) * .008;
    } else {
        const progress = Math.min(1, (elapsed - scene.fadeIn - scene.hold) / scene.fadeOut);
        opacity = 1 - easeInCubic(progress);
        scale = 1 + progress * .04;
    }

    if (scene.finale && elapsed > scene.fadeIn && elapsed < scene.fadeIn + scene.hold && !finalBurstStarted) {
        emitFinaleBurst();
    }

    messageElement.style.opacity = opacity.toFixed(3);
    messageElement.style.transform = `scale(${scale.toFixed(3)})`;
    messageElement.style.filter = `brightness(${(1 + opacity * .15).toFixed(2)})`;
    if (opacity > .65 && Math.random() > .985) messageElement.classList.add('glitch');
    if (Math.random() > .94) messageElement.classList.remove('glitch');

    if (elapsed >= total) {
        if (sceneIndex < scenes.length - 1) showNextScene(now);
        else showBirthdayCake();
    }
}

function showBirthdayCake() {
    messageElement.style.opacity = '0';
    messageElement.classList.remove('glitch');
    cakeScene.classList.add('visible');
    cakeScene.setAttribute('aria-hidden', 'false');
}

function extinguishCandles() {
    if (cakeScene.classList.contains('extinguished')) return;

    cakeScene.classList.add('extinguished');
    blowButton.disabled = true;
    blowButton.textContent = 'Vœu envoyé';
    cakeWish.textContent = 'Joyeux anniversaire, mon amour !';
    emitFinaleBurst();
}

function resetAnimation() {
    cancelAnimationFrame(animationFrame);
    sceneIndex = -1;
    sequenceStartsAt = performance.now() + 1200;
    sceneStartedAt = 0;
    finalBurstStarted = false;
    particles.length = 0;
    messageRevealTimers.forEach((timer) => window.clearTimeout(timer));
    messageRevealTimers = [];
    cakeScene.classList.remove('visible', 'extinguished');
    cakeScene.setAttribute('aria-hidden', 'true');
    blowButton.disabled = false;
    blowButton.textContent = 'Souffler les bougies';
    cakeWish.textContent = 'Ferme les yeux et fais un vœu';
    messageElement.textContent = '';
    messageElement.classList.remove('characters-visible', 'glitch');
    messageElement.removeAttribute('data-word');
    animate();
}

function animate(now = performance.now()) {
    const delta = Math.min(.05, (now - (animate.lastTime || now)) / 1000);
    animate.lastTime = now;
    drawRain(delta);
    drawParticles(delta);
    animateMessage(now);
    animationFrame = requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeScene);
replayButton.addEventListener('click', resetAnimation);
blowButton.addEventListener('click', extinguishCandles);
resizeScene();
resetAnimation();
