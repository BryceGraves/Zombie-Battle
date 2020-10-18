/*
  Zombulator homework help/experiementing
  Zombulator boiler plate code provided by Elsie Charles of the class CS160 in fall 2017
*/

const MIN_SIZE = 10;
const MAX_SIZE = 50;
const POPULATION_SIZE = 500;

const population = {
  human: [],
  zombie: [],
};

let backgroundColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  backgroundColor = color(245, 255, 245);
  initializePopulation();
}

function draw() {
  background(backgroundColor);
  noStroke();

  if (populationEmpty()) {
    drawEndingScreen();
  } else {
    handlePopulation();
    drawPopulationCounts();
    handleCollisions();
  }
}

const drawEndingScreen = () => {
  stroke(0);
  textSize(72);
  textAlign(CENTER);

  if (!population.human.length && !population.zombie.length) {
    text(
      'Humans and zombies have defeated each other... nothing left here but nature',
      width / 2,
      height / 2
    );
  } else if (!population.zombie.length) {
    text('Humans eradicated the zombie threat!', width / 2, height / 2);
  } else if (!population.human.length) {
    text('Zombies have taken over the world :(', width / 2, height / 2);
  } else {
    text("YOU SHOULDN'T BE SEEING THIS", width / 2, height / 2);
  }
};

const drawPopulationCounts = () => {
  stroke(0);
  textSize(72);
  textAlign(CENTER);
  text('Humans: ' + population.human.length, width / 2, height - 100);
  text('Zombies: ' + population.zombie.length, width / 2, 100);
};

const initializePopulation = () => {
  for (let i = 0; i < POPULATION_SIZE; ++i) {
    const current = initializeHumanoid(random(0, 100) < 50 ? 'human' : 'zombie');

    population[current.humanoidType].push(current);
  }
};

const handleCollisions = () => {
  population.human.forEach((human) => {
    population.zombie.forEach((zombie) => {
      if (isTouching(human, zombie)) {
        fight(human, zombie);
      }
    });
  });
};

const handleMovement = (current) => {
  if (!current || population.human.length === 0) {
    return;
  }

  if (current.x !== population.human[0].x) {
    if (Math.abs(current.x - population.human[0].x) < current.speed) {
      current.x = population.human[0].x;
    } else {
      current.x += current.x < population.human[0].x ? current.speed : -current.speed;
    }
  }

  if (current.y !== population.human[0].y) {
    if (Math.abs(current.y - population.human[0].y) < current.speed) {
      current.y = population.human[0].y;
    } else {
      current.y += current.y < population.human[0].y ? current.speed : -current.speed;
    }
  }
};

const handlePopulation = () => {
  [...population.human, ...population.zombie].forEach((v, i) => {
    fill(v.color);
    ellipse(v.x, v.y, v.size, v.size);

    if (i !== 0) {
      handleMovement(v);
    }
  });
};

const initializeHumanoid = (type) => {
  const humanoid = {
    id: uuid(),
    humanoidType: type,
    x: random(0, windowWidth),
    size: random(MIN_SIZE, MAX_SIZE),
  };

  switch (type) {
    case 'human':
      humanoid.y = random(windowHeight - 200, windowHeight);
      humanoid.speed = random(1, 2);
      humanoid.color = color(random(50, 150), random(50, 150), random(150, 250));
      break;
    case 'zombie':
      humanoid.y = random(0, 200);
      humanoid.speed = random(2, 3);
      humanoid.color = color(random(150, 250), random(50, 150), random(50, 150));
      break;
  }

  return humanoid;
};

const isTouching = (self, target) =>
  self.humanoidType !== target.humanoidType
    ? dist(self.x, self.y, target.x, target.y) <= self.size / 2 + target.size / 2
    : false;

const fight = (human, zombie) => {
  if (human.size < zombie.size) {
    const newZombie = human;
    newZombie.humanoidType = 'zombie';
    newZombie.color = color(random(190, 255), random(50, 150), random(50, 150));

    population.human = population.human.filter((h) => h.id !== newZombie.id);
    population.zombie.push(newZombie);
  } else if (human.size > zombie.size) {
    population.zombie = population.zombie.filter((z) => z.id !== zombie.id);
  } else {
    population.human = population.human.filter((h) => h.id !== human.id);
    population.zombie = population.zombie.filter((z) => z.id !== zombie.id);
  }
};

const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );

const populationEmpty = () => Object.values(population).some((v) => v.length === 0);
