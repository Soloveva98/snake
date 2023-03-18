const againBtn = document.querySelector(".again");
const scoreInfo = document.querySelector(".score");
const lose = document.querySelector(".lose");

//создание изображений
function createImage(imageSrc) {
	const image = new Image();
	image.onload = function () {
		console.log("onload");
	};
	image.src = imageSrc;
	return image;
};

let berryImg = createImage('img/berry.png');

// Настройка «холста»
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

let blockSize = 20;
let cols = 25;
let rows = 22;

let score = 0;
scoreInfo.textContent = score;

let key = "";
let gameOver = false;

//передвижение змеи
let velocityX = 0;
let velocityY = 0;

class Berry {
	constructor() {
		this.position = {
			x: Math.floor((Math.random() * cols)) * blockSize,
			y: Math.floor((Math.random() * rows)) * blockSize
		};

		this.image = berryImg;
	}

	draw() {
		ctx.drawImage(this.image, this.position.x, this.position.y);
	}

	collisionSnake() {
		if (snake.position.x == berry.position.x && snake.position.y == berry.position.y) {
			snake.body.push([berry.position.x, berry.position.y])
			berry = new Berry();
			score += 1;
			scoreInfo.textContent = score;
		}
	}
};

class Snake {
	constructor() {
		this.position = {
			x: blockSize * 5,
			y: blockSize * 5,
		};

		this.body = [];
	}

	update() {
		this.position.x += velocityX * blockSize;
		this.position.y += velocityY * blockSize;
		ctx.fillStyle = "green";
		ctx.fillRect(this.position.x, this.position.y, blockSize, blockSize);
	}
};

let berry = new Berry();
let snake = new Snake();

//условия проигрыша
function gameLose() {
	if (snake.position.x < 0 || snake.position.x >= cols * blockSize || snake.position.y < 0 || snake.position.y >= rows * blockSize) {
		gameOver = true;
		lose.style.opacity = 1;
	}

	for (let i = 0; i < snake.body.length; i++) {
		if (snake.position.x == snake.body[i][0] && snake.position.y == snake.body[i][1]) {
			gameOver = true;
			lose.style.opacity = 1;
		}
	}
};

//инициализация
function init() {
	lose.style.opacity = 0;
	key = "";
	gameOver = false;

	score = 0;
	scoreInfo.textContent = score;

	velocityX = 0;
	velocityY = 0;

	berry = new Berry();
	snake = new Snake();
};

//Функция анимации
function animate() {
	if (gameOver) return;

	ctx.fillStyle = '#A2D149';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	berry.draw();
	berry.collisionSnake();

	for (let i = snake.body.length - 1; i > 0; i--) {
		snake.body[i] = snake.body[i - 1];
	};

	if (snake.body.length) {
		snake.body[0] = [snake.position.x, snake.position.y];
	}

	snake.update();

	for (let i = 0; i < snake.body.length; i++) {
		ctx.fillRect(snake.body[i][0], snake.body[i][1], blockSize, blockSize);
	}

	gameLose();
};

init();
setInterval(animate, 110);

document.addEventListener('keyup', direction);
againBtn.addEventListener("click", init);

function direction({ keyCode }) {
	if ((keyCode === 65 || keyCode === 37) && key != "right") {
		key = "left"
		velocityX = -1;
		velocityY = 0;
	} else if ((keyCode === 68 || keyCode === 39) && key != "left") {
		key = "right"
		velocityX = 1;
		velocityY = 0;
	} else if ((keyCode === 87 || keyCode === 38) && key != "down") {
		key = "up"
		velocityX = 0;
		velocityY = -1;
	} else if ((keyCode === 83 || keyCode === 40) && key != "up") {
		key = "down"
		velocityX = 0;
		velocityY = 1;
	}
};