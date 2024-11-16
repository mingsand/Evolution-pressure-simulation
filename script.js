const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const speciesCount = 3;
const initialCreatures = 3;
const foodCount = Math.floor(Math.random() * 6) + 5; // 5~10개 먹이
let foods = [];
let species = [];
let generation = 0;

class Creature {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 10;
        this.speed = Math.random() * 2 + 1; // 1~3
        this.direction = Math.random() * 2 * Math.PI; // 방향
        this.eatenFood = 0;
    }

    move() {
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);

        // 화면 경계 체크
        if (this.x < 0 || this.x > canvas.width) this.direction = Math.PI - this.direction;
        if (this.y < 0 || this.y > canvas.height) this.direction = -this.direction;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    eat(foods) {
        foods.forEach((food, index) => {
            if (Math.hypot(this.x - food.x, this.y - food.y) < this.size) {
                this.eatenFood++;
                foods.splice(index, 1); // 먹은 먹이 제거
            }
        });
    }
}

class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initialize() {
    foods = [];
    species = [];
    for (let i = 0; i < foodCount; i++) {
        foods.push(new Food(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    for (let i = 0; i < speciesCount; i++) {
        for (let j = 0; j < initialCreatures; j++) {
            let color = ['red', 'blue', 'green'][i];
            species.push(new Creature(Math.random() * canvas.width, Math.random() * canvas.height, color));
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    species.forEach(creature => {
        creature.move();
        creature.eat(foods);
        creature.draw();
    });

    foods.forEach(food => food.draw());

    if (foods.length === 0) {
        evolve();
    }

    drawInfo();
}

function evolve() {
    generation++;
    const speciesEaten = species.map(creature => creature.eatenFood);
    const sortedSpecies = [...Array(speciesCount).keys()].sort((a, b) => speciesEaten[b] - speciesEaten[a]);

    // 종 개체 수 조정
    species[sortedSpecies[0]].speed += Math.random() * 4 - 2; // 최다 섭취 종 속도 조정
    species[sortedSpecies[1]].eatenFood = species[sortedSpecies[1]].eatenFood; // 2위 유지
    species[sortedSpecies[2]].eatenFood = Math.max(0, species[sortedSpecies[2]].eatenFood - 1); // 3위 감소

    initialize(); // 초기화 후 반복
}

function drawInfo() {
    const info = `세대: ${generation}<br>남은 먹이: ${foods.length}<br><br>` +
        species.map((creature, index) => {
            let colorName = creature.color === 'red' ? '빨강' : creature.color === 'blue' ? '파랑' : '초록';
            return `종 ${index + 1} (${colorName}): 속도 ${creature.speed.toFixed(2)}, 먹은 개수 ${creature.eatenFood}`;
        }).join('<br>');
    document.getElementById('info').innerHTML = info;
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

initialize();
gameLoop();

