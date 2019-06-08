//Zombulator homework help/experiementing
//Zombulator boiler plate code provided by Elsie Charles of the class CS160 in fall 2017

//--TODO--
//Path humans away from Zombies
//Path humans together
//Path zombies towards humans

const MIN_SIZE = 10;
const MAX_SIZE = 50;
const POPULATION_SIZE = 500;

var backgroundColor;
var population = [];
var zombieCount = 0;
var humanCount = 0;



function setup() {
  createCanvas(windowWidth, windowHeight);
  backgroundColor = color(245, 255, 245);
  initializePopulation();
}

function draw() {
  background(backgroundColor);
  noStroke();
  handlePopulation();
  drawPopulationCounts();
  handleCollisions();
}

function handleCollisions() {
  for(var i = 0; i < POPULATION_SIZE; ++i) {
    var attacker = population[i];
    for (var j = i + 1; j < POPULATION_SIZE; ++j) {
      var target = population[j];

      if (attacker.isTouching(target)) {
        if (attacker.size != 0 && target.size != 0) {
          print ("Fight");
          fight(attacker, target);
        }
      }
    }
  }
}

function initializePopulation() {
  for (var i = 0; i < POPULATION_SIZE; ++i) {
    var humanoid_type = random(0, 100);
    if (humanoid_type <= 50) {
      population[i] = initializeZombie();
      ++zombieCount;
    } else {
      population[i] = initializeHuman();
      ++humanCount;
    }
  }
}

function drawPopulationCounts() {
  stroke(0);
  textSize(72);
  textAlign(CENTER);
  text("Zombies: " + zombieCount, width / 2, 100);
  text("Humans: " + humanCount, width / 2, height - 100);
}

function handlePopulation() {
  for (var i = 0; i < POPULATION_SIZE; ++i) {
    population[i].draw();
    population[i].move();
  }
}

function initializeZombie() {
  return {
    humanoidType: "zombie",
    x: random(0, windowWidth),
    y: random(0, 200),
    speed: random(0.25, 3),
    size: random(MIN_SIZE, MAX_SIZE),
    color: color(random(190, 255), random(50, 150), random(50, 150)),
    move: function() {
      var direction = random(0, 100);
      if (direction < 20) {
        this.x += this.speed;
      } else if (direction < 40) {
        this.x -= this.speed;
      } else if (direction < 60) {
        this.y -= this.speed;
      } else {
        this.y += this.speed;
      }

      if (this.x >= windowWidth) {
        this.x -= this.speed;
      } else if (this.x <= 0) {
        this.x += this.speed;
      }

      if (this.y >= windowHeight) {
        this.y -= this.speed;
      } else if (this.y <= 0) {
        this.y += this.speed;
      }
    },
    draw: function() {
      fill(this.color);
      ellipse(this.x, this.y, this.size, this.size);
    },
    isTouching: function(target) {
      if (this.humanoidType == target.humanoidType) return false;
      var distance = dist(this.x, this.y, target.x, target.y);
      return distance <= (this.size/2 + target.size/2);
    }
  };
}

function initializeHuman() {
  return {
    humanoidType: "human",
    x: random(0, windowWidth),
    y: random(windowHeight - 200, windowHeight),
    speed: random(0.25, 3),
    size: random(MIN_SIZE, MAX_SIZE),
    color: color(random(50, 150), random(50, 150), random(190, 255)),
    move: function() {
        var direction = random(0, 100);
        if (direction < 20) {
          this.x += this.speed;
        } else if (direction < 40) {
          this.x -= this.speed;
        } else if (direction < 60) {
          this.y += this.speed;
        } else {
          this.y -= this.speed;
        }

        if (this.x >= windowWidth) {
          this.x -= this.speed;
        } else if (this.x <= 0) {
          this.x += this.speed;
        }

        if (this.y >= windowHeight) {
          this.y -= this.speed;
        } else if (this.y <= 0) {
          this.y += this.speed;
        }
      },
    draw: function() {
        fill(this.color);
        ellipse(this.x, this.y, this.size, this.size);
    },
    isTouching: function(target) {
      if (this.humanoidType == target.humanoidType) return false;
      var distance = dist(this.x, this.y, target.x, target.y);
      return distance <= (this.size/2 + target.size/2);
    }
  };
}

//New fight function that is passed the attacker and target
function fight(attacker, target) {
  //Second if statement to see who lost, the loser has it's size set to 0 and is now ignored. Thee correct pop is reduced by 1.
  if (target.size < attacker.size) {
    if (target.humanoidType == "zombie") {
      target.size = 0;
      zombieCount--;
    } else {
      target.humanoidType = "zombie";
      target.color = color(random(190, 255), random(50, 150), random(50, 150));
      humanCount--;
      zombieCount++;
    }
  } else if (target.size > attacker.size) {
    if (attacker.humanoidType == "zombie") {
      attacker.size = 0;
      zombieCount--;
    } else {
      attacker.humanoidType = "zombie";
      attacker.color = color(random(190, 255), random(50, 150), random(50, 150));
      humanCount--;
      zombieCount++;
    }
  } else if (target.size == attacker.size) {
    target.size = 0;
    attacker.size = 0;
    zombieCount--;
    humanCount--;
  }
}
