import './style.css'

document.addEventListener('DOMContentLoaded', function () {
    const svg = document.getElementById('svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', 'path');
    path.setAttribute('stroke', 'blue');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('id', 'path2');
    path2.setAttribute('stroke', 'red');
    path2.setAttribute('fill', 'none');
    path2.setAttribute('stroke-width', '2');
    svg.appendChild(path2);

    const ballPrediction = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    ballPrediction.setAttribute('id', 'ballPrediction');
    ballPrediction.setAttribute('stroke', 'blue');
    ballPrediction.setAttribute('fill', 'none');
    ballPrediction.setAttribute('stroke-width', '2');
    ballPrediction.setAttribute('stroke-dasharray', '5,5');
    svg.appendChild(ballPrediction);
});

const svg = document.getElementById('svg');


const output = {
    time: document.getElementById('time'),
    disc: {
        x: document.getElementById('discX'),
        y: document.getElementById('discy'),
    }
}

let output1, output2;

[...document.querySelectorAll(".form-input.range")].map((el, index) => {
    if (index === 0) output1 = el.querySelector('output')
    if (index === 1) output2 = el.querySelector('output')
})

let positionsByTime = {}

let angle = 45; // Angle initial du lancer
let angle2 = 30; // Angle initial de la droite
let initialVelocity;
const gravity = 0.982; // Gravité affectant le mouvement

let x = 50; // Position horizontale initiale
let y = 570; // Position verticale initiale

let x2 = 80; // Position horizontale initiale pour la droite
let y2 = 570; // Position verticale initiale pour la droite

let pathData = ''; // Trajectoire représentée par une seule ligne
let pathData2 = ''; // Trajectoire représentée par une deuxième ligne
let animation, delay; // Référence pour l'animation

let time1 = 0

const shotHitError = createPath('shoot_hit_error', {stroke: '#00FF00', fill: 'none', style: 'opacity: 0.5', strokeWidth: '40'})
const shotHit = createPath('shoot_hit')

const speed = document.getElementById('speed');

function startAnimation() {
    angle = parseInt(document.getElementById('angleInput').value);
    angle2 = parseInt(document.getElementById('angleInput2').value);
    x = 50;
    y = 570;
    x2 = 80;
    y2 = 570;
    time1 = 0
    initialVelocity = parseInt(speed.value);
    delay = parseInt(document.getElementById('reactionTime').value)

    document.body.classList.remove('bg-green-500')
    document.querySelector(".container").classList.remove('success')

    shotHitError.setAttribute('d', '')
    shotHit.setAttribute('d', '')

    positionsByTime = {
        [time1]: [
            {x, y},
            {x2, y2}
        ]
    }

    pathData = `M${x},${y}`;
    pathData2 = `M${x2},${y2}`;
    animate();
}



const adjustment = document.getElementById('adjustment');


document.getElementById("angleInput").addEventListener('input', e => {
    output1.querySelector('.value').textContent = e.target.value
    startAnimation()
})

document.getElementById("angleInput2").addEventListener('input', e => {
    output2.querySelector('.value').textContent = e.target.value
    startAnimation()
})


document.getElementById("reactionTime").addEventListener('input', e => {
    startAnimation()
})

adjustment.addEventListener('input', e => {
    startAnimation()
})
speed.addEventListener('input', e => {
    startAnimation()
})

const in_range = (x, min, max) => {
    return x >= min && x <= max;
}

function animate() {
    const path = document.getElementById('path');
    const path2 = document.getElementById('path2');

    const velocityY = initialVelocity * Math.sin(angle * Math.PI / 180) - gravity * time1;
    const velocityX = initialVelocity * Math.cos(angle * Math.PI / 180);

    y -= velocityY;
    x += velocityX;

    output.disc.x.textContent = x
    output.disc.y.textContent = y
    output.time.textContent = time1
    output.disc.x.style.color = "inherit"
    output.disc.y.style.color = "inherit"

    pathData += ` L${x},${y}`;

    if (time1 >= delay) {
        const velocityY2 = initialVelocity * Math.sin(angle2 * Math.PI / 180);
        const velocityX2 = initialVelocity * Math.cos(angle2 * Math.PI / 180);
        y2 -= velocityY2;
        x2 += velocityX2;
        pathData2 += ` L${x2},${y2}`;
        path2.setAttribute('d', pathData2);
    }

    positionsByTime[time1] = {
        pigeon: [x, y],
        shot: [x2, y2]
    }


    const positions = positionsByTime[time1]
    let adjust1X = positions.pigeon[0] + parseInt(adjustment.value)
    let adjust2X = positions.pigeon[0] - parseInt(adjustment.value)
    let adjust1Y = positions.pigeon[1] + parseInt(adjustment.value)
    let adjust2Y = positions.pigeon[1] - parseInt(adjustment.value)
    if (in_range(positions.shot[0], adjust2X, adjust1X) && in_range(positions.shot[1], adjust2Y, adjust1Y)) {
        console.log('hit', time1, positions)
        shotHitError.setAttribute('stroke-width', (adjustment.value * 2).toString())
        shotHit.setAttribute('d', `M${positions.pigeon[0]},0 L${positions.pigeon[0]},800`)
        shotHitError.setAttribute('d', `M${positions.pigeon[0]},0 L${positions.pigeon[0]},800`)

        output.disc.x.textContent = positions.pigeon[0]
        output.disc.x.style.color = "#00FF00"
        output.disc.y.textContent = positions.pigeon[1]
        output.disc.y.style.color = "#00FF00"

        document.body.classList.add('bg-green-500')
        document.querySelector(".container").classList.add('success')
    }


    time1++

    path.setAttribute('d', pathData);
    if ((y2 <= 10 || x2 >= 800) && y >= 800) {
        cancelAnimationFrame(animation);

        for (let time in positionsByTime) {
            const positions = positionsByTime[time]
            let adjust1X = positions.pigeon[0] + parseInt(adjustment.value)
            let adjust2X = positions.pigeon[0] - parseInt(adjustment.value)
            let adjust1Y = positions.pigeon[1] + parseInt(adjustment.value)
            let adjust2Y = positions.pigeon[1] - parseInt(adjustment.value)
            if (in_range(positions.shot[0], adjust2X, adjust1X) && in_range(positions.shot[1], adjust2Y, adjust1Y)) {
                output.disc.x.textContent = positions.pigeon[0]
                output.disc.x.style.color = "#00FF00"
                output.disc.y.textContent = positions.pigeon[1]
                output.disc.y.style.color = "#00FF00"
            }
        }

    } else {
        animation = requestAnimationFrame(animate);
    }
}

function createPath(id, config = {
    stroke: 'green',
    fill: 'none',
    style: '',
    strokeWidth: '2'
}) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', id);
    path.setAttribute('stroke', config.stroke);
    path.setAttribute('fill', config.fill);
    path.setAttribute('stroke-width', config.strokeWidth);
    path.setAttribute('style', config.style);
    svg.appendChild(path);
    return path
}
