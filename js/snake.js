var canvas = document.getElementById('cvs');
var ctx = canvas.getContext('2d');

// 设置蛇的尺寸、长度
var snakeSize = 15;
var length = 0
// 设置格子的数目
var cvsGridX = cvs.width / snakeSize;
var cvsGridY = cvs.height / snakeSize;

var snakeBody = []; // 储存snake
var dire = 2; // 设置方向初始值:左
var food = {}; // 设置食物对象
var direFlag = 0;

function init() {

  score = 0
  dire = 2;
  snakeBody = [];
  length = 0;
  for (var i = 0; i < 3; i++) {
    // 初始设定snake的长度为3，并由x,y的坐标(第几个格子），然后绘画出节点
    createSnakeNode(parseInt(cvsGridX / 2) + i, parseInt(cvsGridY / 2));
    putFood();
    drawSnake();
    setHighestScore();

  }
}

// 创造节点
function createSnakeNode(x, y) {
  snakeBody.push({
    x: x,
    y: y,
    color: length === 0 ? '#B94D4D' : '#565252'
  });
  length++;
  setHighestScore();
  document.getElementById('score').innerText = length - 3;
}


function setHighestScore() {
  if (parseInt(localStorage.highestScore) < (length - 3)) {
    document.getElementById('highestScore').innerText = (length - 3).toString();
    localStorage.setItem('highestScore', (length - 3).toString())
  } else {
    document.getElementById('highestScore').innerText = localStorage.getItem('highestScore');
  }
}


// 单个的节点绘制(矩形)
function drawRect(snakeNode) {
  ctx.beginPath();
  ctx.fillStyle = snakeNode.color;
  ctx.fillRect(snakeNode.x * snakeSize, snakeNode.y * snakeSize, snakeSize, snakeSize);
  ctx.closePath();
}
// 绘制
function drawSnake() {
  // clear  all canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < snakeBody.length; i++) {
    drawRect(snakeBody[i]);
  }
  drawRect(food);
}
// 移动snake
function snakeMove() {
  var newSnakeHeadNode = {
    x: snakeBody[0].x,
    y: snakeBody[0].y,
    color: snakeBody[0].color
  }
  // 定义蛇头
  // snakeBody[0].x = snakeBody[0].x - 1;
  if (dire === 1) newSnakeHeadNode.y = newSnakeHeadNode.y - 1;
  if (dire === -1) newSnakeHeadNode.y = newSnakeHeadNode.y + 1;
  if (dire === 2) newSnakeHeadNode.x = newSnakeHeadNode.x - 1;
  if (dire === -2) newSnakeHeadNode.x = newSnakeHeadNode.x + 1;
  // 蛇身体跟着蛇头
  for (var i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i].x = snakeBody[i - 1].x;
    snakeBody[i].y = snakeBody[i - 1].y;
    if ((snakeBody[i].x) === newSnakeHeadNode.x && (snakeBody[i].y) === newSnakeHeadNode.y) {
      gameover();
      return
    }
  }
  snakeBody[0] = newSnakeHeadNode;
  direFlag = 0;
  isGetFood(snakeBody[0]);
  chkOutOfBorder(snakeBody[0]);
  drawSnake();
}

function gameover() {
  alert('Game over, click and restart');
  init();
}



function isGetFood(node) {
  if (node.x === food.x && node.y === food.y) {
    putFood();
    createSnakeNode(
      snakeBody[snakeBody.length - 1].x,
      snakeBody[snakeBody.length - 1].y
    )

  }
}

document.onkeydown = function (e) {
  if (direFlag) return;
  // 阻止默认事件
  e.preventDefault();
  // 定义方向
  if (e.keyCode === 38) setDirection(1); //上
  if (e.keyCode === 40) setDirection(-1); //下
  if (e.keyCode === 37) setDirection(2); //左
  if (e.keyCode === 39) setDirection(-2); //右
}

function setDirection(dir) {
  direFlag = 1;
  if (Math.abs(dir) === Math.abs(dire)) return;
  dire = dir
}

init();
// 得到food

function chkOutOfBorder(node) {
  if (node.x < 0 || node.x > cvsGridX - 1 || node.y < 0 || node.y > cvsGridY - 1) gameover();
}

function putFood() {
  var flag = 1;
  while (1) {
    flag = 1;
    var foodX = parseInt(Math.random() * cvsGridX);
    var foodY = parseInt(Math.random() * cvsGridY);

    for (var i = 0; i < snakeBody.length; i++) {
      if (snakeBody[i].x === foodX && snakeBody[i].y === foodY) flag = 0;
    }
    if (flag) break;
  };
  food = {
    x: foodX,
    y: foodY,
    color: '#349283'
  };
}

setInterval(function () {
  snakeMove();
}, 150)