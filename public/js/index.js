window.onload = function() {
  var imageFloor = setImage(b_floor);
  var imageEnemy = setImage(b_enemy);
  var imageTree1 = setImage(b_tree1);
  var imageTree2 = setImage(b_tree2);
  var imageTree3 = setImage(b_tree3);
  var imageTrunk = setImage(b_trunk);
  var imageStone = setImage(b_stone);
  var imagePlayer = setImage(b_player);
  var imageHighGrass = setImage(b_high_grass);
  var imageAnimals = setImage(b_animals);
  var imageFlower1 = setImage(b_flower1);
  var imageFlower2 = setImage(b_flower2);
  var imageFlower3 = setImage(b_flower3);
  var imageFlower4 = setImage(b_flower4);
  var imageFlower5 = setImage(b_flower5);
  var elements = [];
  var eng = new Engine("content");
  var ctx = eng.ctx;
  var event = new Event(eng);

  var BLOCK = eng.BLOCK_LENGTH * 20;

  var floor = new Floor(eng, {
    W: BLOCK, H: BLOCK,
    image: imageFloor,
  });

  var player = new Element( {
    x: eng.C_X,
    y: eng.C_Y,
    id: "player", image: imagePlayer,
    speed: 4, floor: floor,
    animation: {
      frameX: listFrame(10), frameY: listFrame(8), scale: 1.5,
      run: {
        left: x_y(9, 7), right: x_y(9, 5),
        top: x_y(9, 6), bottom: x_y(9, 4)
      },
      stop: {
        left: x_y(2, 3), right: x_y(2, 1),
        top: x_y(0, 2), bottom: x_y(2, 0)
      },
    }
  });

  elements.push(player);

  event.OnClickAndTouchMove(function(ev) {
    floor.toward.x = ev.x;
    floor.toward.y = ev.y;
  });

  var infoElm = new TextView( {
    y: 50,
    size: 20
  });

  var infoFloor = new TextView( {
    size: 20
  });

  var SEED = (floor.W * floor.H) / 10;
  setFauna(SEED);
  setSkeletons(50);
  setAnimals(50);

  floor.elements = elements.sort(function(a, b) {
    return (a.y + a.H / 2) - (b.y + b.H / 2);
  })

  var render = function() {
    eng.drawFrames(render, true);
    floor.draw();
    floor.fallowing(true, player);
    infoElm.draw(ctx);
    infoFloor.draw(ctx);
    infoElm.text = "Elements:" + elements.length;
    infoFloor.text = "Floor Block's:" + floor.W * floor.H;
    eng.updateFPS();
  }
  console.log(floor.getById("skeleton_1"))
  function setFauna(seed) {
    var imagesType = [
      imageTree1,
      imageTree2,
      imageTree3
    ];
    for (var i = 0; i < seed; i++) {
      var indexTree = imagesType[Math.floor(Math.random() * imagesType.length)];
      var size = (Math.floor(Math.random() * 100)) + 100;
      elements.push(setElement(indexTree, size));
      for (var im = 0; im < 5; im++) {
        elements.push(setElement(imageHighGrass, 50));
      }
      if (i < seed / 3) {
        elements.push(setElement(imageTrunk, size / 2));
        elements.push(setElement(imageFlower1, size / 5));
        elements.push(setElement(imageFlower2, size / 5));
        elements.push(setElement(imageFlower3, size / 5));
        elements.push(setElement(imageFlower4, size / 5));
        elements.push(setElement(imageFlower5, size / 5));

      }
      if (i < seed / 4) {
        elements.push(setElement(imageStone, size / 5))
      }
    }
  }
  function setAnimals(number) {
    var _animals = {
      dog: x_y(0, 0),
      gat: x_y(3, 0),
      chicken: x_y(6, 0),
      horse: x_y(9, 0),
      sheep: x_y(0, 4),
      cow: x_y(3, 4),
      deer: x_y(6, 4),
      cabra: x_y(9, 4),
    }
    var obj = Object.keys(_animals);
    for (var i = 0; i < obj.length; i++) {
      setElementAnimal(number, _animals[obj[i]])
    }
  }
  function setElementAnimal(number, position) {
    for (var i = 0; i < number; i++) {
      elements.push(new Element( {
        x: (Math.floor(Math.random() * floor.L_W)),
        y: (Math.floor(Math.random() * floor.L_H)),
        id: "animal_" + i,
        image: imageAnimals, isAutoMove: true,
        speed: 2, floor: floor,
        animation: {
          x: position.x, y: position.y,
          frameX: listFrame(12), frameY: listFrame(8),
          scale: 1.5,
          run: {
            left: x_y(2, 2), right: x_y(2, 1),
            top: x_y(2, 3), bottom: x_y(2, 0)
          },
          stop: {
            left: x_y(0, 2), right: x_y(0, 1),
            top: x_y(0, 3), bottom: x_y(1, 0)
          },
        }
      }));
    }
  }

  function setSkeletons(number) {
    for (var i = 0; i < number; i++) {
      elements.push(new Element( {
        x: (Math.floor(Math.random() * floor.L_W)),
        y: (Math.floor(Math.random() * floor.L_H)),
        id: "skeleton_" + i,
        image: imageEnemy, isAutoMove: true,
        speed: 3, floor: floor,
        animation: {
          frameX: listFrame(9), frameY: listFrame(4),
          scale: 1.5,
          run: {
            left: x_y(8, 3), right: x_y(8, 1),
            top: x_y(8, 0), bottom: x_y(8, 2)
          },
          stop: {
            left: x_y(0, 3), right: x_y(0, 1),
            top: x_y(0, 0), bottom: x_y(0, 2)
          },
        }
      }));
    }
  }

  function setImage(base64) {
    var i = new Image();
    i.src = base64;
    return i;
  }
  var count_fauna = 0;
  function setElement(b_image, size) {
    count_fauna += 1;
    return new Element( {
      x: Math.floor(Math.random()*floor.L_W),
      y: Math.floor(Math.random()*floor.L_H),
      id: "fauna_" + count_fauna,
      image: b_image,
      W: size, H: size
    });
  }

  render();
}