// Prosty skrypt do animacji cząsteczkowej w tle
const canvas = document.getElementById('particles-js');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Przechowuje pozycję kursora
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/110) * (canvas.width/110)
}

window.addEventListener('mousemove', 
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// Klasa definiująca pojedynczą cząsteczkę
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    
    // Metoda do rysowania cząsteczki
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(0, 191, 255, 0.1)';
        ctx.fill();
    }

    // Metoda do aktualizacji pozycji cząsteczki
    update() {
        // Odbijanie od krawędzi
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Interakcja z kursorem
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size){
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 5;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 5;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 5;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 5;
            }
        }
        // Przesunięcie cząsteczki
        this.x += this.directionX;
        this.y += this.directionY;
        // Narysowanie cząsteczki
        this.draw();
    }
}

// Inicjalizacja cząsteczek
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = 'rgba(0, 191, 255, 0.5)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Pętla animacji
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Rysowanie połączeń między cząsteczkami
function connect(){
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle='rgba(0, 191, 255,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Obsługa zmiany rozmiaru okna
window.addEventListener('resize', 
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    }
);

// Obsługa opuszczenia okna przez kursor
window.addEventListener('mouseout', 
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
)

// Start
init();
animate();
