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

function handleCollisions() {
  for(var i = 0; i < POPULATION_SIZE; ++i) {
    var attacker = population[i];
    for (var j = i + 1; j < POPULATION_SIZE; ++j) {
      var target = population[j];

      if (isTouching(attacker, target)) {
        if (attacker.size != 0 && target.size != 0) {
          print ("Fight");
          fight(attacker, target);
        }
      }
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
    var direction = random(0, 100);
    fill(population[i].color);
    ellipse(population[i].x, population[i].y, population[i].size, population[i].size);
    if (direction < 20) {
      population[i].x += population[i].speed;
    } else if (direction < 40) {
      population[i].x -= population[i].speed;
    } else if (direction < 60) {
      population[i].y += population[i].speed;
    } else {
      population[i].y -= population[i].speed;
    }
  
    if (population[i].x >= windowWidth) {
      population[i].x -= population[i].speed;
    } else if (population[i].x <= 0) {
      population[i].x += population[i].speed;
    }
  
    if (population[i].y >= windowHeight) {
      population[i].y -= population[i].speed;
    } else if (population[i].y <= 0) {
      population[i].y += population[i].speed;
    }
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
  };
}

function isTouching(self, target) {
  if (self.humanoidType == target.humanoidType) return false;
  var distance = dist(self.x, self.y, target.x, target.y);
  return distance <= (self.size/2 + target.size/2);
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
