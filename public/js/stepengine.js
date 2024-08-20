var defaultBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAABlSURBVBiVfY9LDcAgEETfNpvgAAt1gBZQWLTgAAt1wIkeyAJpms5xPpkZuc7QAVItwgbjD4Do3SRMjN4BoCNpxDBF78h3I9Ui8pUycVb8Qfd0vhtWAaGnWkR3cT1Zm/TduS6PwQ9HaDYmZ70fKgAAAABJRU5ErkJggg==";
var listFrame = function(e) {
  var arr = [];
  for (var i = 0; i < e; i++) {
    arr.push(i)
  }
  return arr;
}
function minMax(min, max) {
  return (Math.floor(Math.random()*(max-min)))+min
}
var x_y = function(x, y) {
  return {
    x: x,
    y: y
  };
}
function defaultId() {
  var resultId = "id_";
  for (var i = 0; i < 7; i++) {
    var randomNumb = Math.floor(Math.random() * 10);
    resultId += randomNumb;
  }
  return resultId;
}
function verify(value, data) {
  var obj = data || {};
  var array = Object.keys(obj);
  if (array.indexOf(value) == -1) {
    return false;
  } else {
    return data[value];
  }
}
function insertIntoSorted(arr, element) {
  let index = 0;
  while (index < arr.length && (arr[index].y + arr[index].H / 2) < (element.y + element.H / 2)) {
    index++;
  }
  arr.splice(index, 0, element);
}

function defaultImage(data, isSrc) {
  var img = new Image();
  var src = "";
  if (!isNaN(verify("src", data))) {
    img.src = defaultBase64;
    src = "defaultImage"
  } else {
    img.src = data.src;
    src = data.src;
  }
  return isSrc ? src: img;
}
function reject(c1, c2) {
  var size = 30; // Tamaño de los objetos (radio)
  var overlap = 0.1;
  var dx = c2.x - c1.x;
  var dy = c2.y - c1.y;
  var distance = Math.sqrt(dx * dx + dy * dy)
  if (distance <= size * 2 + overlap) {
    var overlapAmount = (size * 2 + overlap) - distance;
    var directionX = dx / distance;
    var directionY = dy / distance;
    c1.x -= directionX * (overlapAmount / 2);
    c1.y -= directionY * (overlapAmount / 2);
    c2.x += directionX * (overlapAmount / 2);
    c2.y += directionY * (overlapAmount / 2);
  }
}
var Circle = (function(isBackground, data) {
  this.x = verify("x", data) || 100;
  this.y = verify("y", data) || 100;
  this.size = verify("size", data) || 30;
  this.style = verify("style", data) || "rgba(94,95,229,0.486)";
  this.draw = function(ctx) {
    if (isBackground) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.style;
      ctx.fill();
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.strokeStyle = this.style;
      ctx.lineWidth = 5;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  }
});
var Square = (function(isBackground, data) {
  this.x = verify("x", data) || 100;
  this.y = verify("y", data) || 100;
  this.W = verify("W", data) || 30;
  this.H = verify("H", data) || 30;
  this.style = verify("style", data) || "rgba(94,95,229,0.486)";
  this.draw = function(ctx) {
    if (isBackground) {
      ctx.beginPath();
      ctx.fillStyle = this.style;
      ctx.fillRect(this.x, this.y, this.W, this.H);
      ctx.fill();
      ctx.closePath();
    } else {
      ctx.beginPath();
      ctx.strokeStyle = this.style;
      ctx.lineWidth = 5;
      ctx.strokeRect(this.x, this.y, this.W, this.H);
      ctx.stroke();
      ctx.closePath();
    }
  }
});
var TextView = (function(data) {
  this.x = verify("x", data) || 100;
  this.y = verify("y", data) || 100;
  this.text = verify("text", data) || "Text";
  this.size = verify("size", data) || 34;
  this.color = verify("color", data) || "#ffffff";
  this.draw = function(ctx) {
    ctx.font = (this.size) + "px bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
  }
});
var deb = new TextView( {
  y: 20,
  size: 20
});
var Element = (function(data) {
  this.W = verify("W", data) || 100;
  this.H = verify("H", data) || 100;
  this.x = verify("x", data) || 100;
  this.y = verify("y", data) || 100;
  this.speed = verify("speed", data) || 5;
  this.src = defaultImage(data, true);
  this.frameX = verify("frameX", data) || [0];
  this.frameY = verify("frameY", data) || [0];
  this.id = verify("id", data) || defaultId();
  this.image = verify("image", data) || defaultImage(data);
  if (verify("animation", data)) {
    this.animation = data.animation;
    this.animation.x = verify("x", this.animation) || 0;
    this.animation.y = verify("y", this.animation) || 0;
    this.animation.toX = this.animation.x != 0 ? this.animation.x: 0;
    this.animation.toY = this.animation.y != 0 ? this.animation.y: 0;
  }
  this.coordinates = verify("coordinates", data) || {
    x: this.x || 0,
    y: this.y || 0
  }
  this.isAutoMove = verify("isAutoMove", data) || false;
  this.floor = verify("floor", data) || {
    x: 500,
    y: 500,
    L_W: 800,
    L_H: 800
  };
  this.draw = function (ctx) {
    if (verify("animation", data)) {
      var W = this.image.width / this.animation.frameX.length;
      var H = this.image.height / this.animation.frameY.length;
      var scW = W * this.animation.scale;
      var scH = H * this.animation.scale;
      ctx.beginPath();
      ctx.arc(this.x, this.y + W / 2, 18, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(41,41,41,0.256)"
      ctx.fill();
      ctx.closePath();
      ctx.drawImage(this.image, this.animation.frameX[this.animation.toX] * W, this.animation.frameY[this.animation.toY] * H, W, H, this.x - scW / 2, this.y - scH / 2, scW, scH);
    } else {
      ctx.drawImage(this.image, this.x - (this.W / 2), this.y - (this.H / 2), this.W, this.H)
    }
  }
  var count_move = 0;
  this.autoMove = function() {
    if (this.isAutoMove) {
      this.move(this.coordinates);
      if (this.distance == 0) {
        let TIME_STOP_ENEMY = 50 * (Math.floor(Math.random() * 200));
        count_move++;
        if (count_move >= TIME_STOP_ENEMY) {
          this.coordinates.x = minMax(this.floor.CELL / 2, (this.floor.L_W - (this.floor.CELL / 2))) + this.floor.x;
          this.coordinates.y = minMax(this.floor.CELL / 2, (this.floor.L_H - (this.floor.CELL / 2))) + this.floor.y;
          count_move = 0;
        }
      }
    }
  }
  var count = 0;
  var direction = "bottom";
  var SPEED_FRAMES = 5;
  var count_stop = 0;
  this.distance = 0;
  this.move = function(touch) {
    var dx = touch.x - this.x;
    var dy = touch.y - this.y;
    var distance = this.distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.speed) {
      var angle = Math.atan2(dy, dx);
      this.x += this.speed * Math.cos(angle);
      this.y += this.speed * Math.sin(angle);
    } else {
      this.x = touch.x;
      this.y = touch.y;
    }
    if (distance > 0) {
      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx >= 0 ? "left": "right";
      } else {
        direction = dy >= 0 ? "bottom": "top";
      }
    }
    var isStop = distance == 0;
    var frames = isStop ? this.animation.stop[direction]: this.animation.run[direction];
    SPEED_FRAMES = 5;
    count++;
    if (count >= SPEED_FRAMES) {
      this.animation.toY = frames.y + this.animation.y;
      var toX = this.animation.x;
      if (isStop) {
        count_stop++;
        if (count_stop > (50 + Math.floor(Math.random()*200))) {
          toX = this.animation.toX >= frames.x + this.animation.x ? this.animation.x: this.animation.toX + 1;
          count_stop = 0;
        }
      } else {
        toX = this.animation.toX >= frames.x + this.animation.x ? this.animation.x: this.animation.toX + 1;
      }
      this.animation.toX = toX;
      count = 0;
    }
  }
});
var Engine = (function(id) {
  var content = document.getElementById(id);
  var cont_rect = content.getBoundingClientRect();
  this.canvas = document.createElement("canvas");
  this.W = this.canvas.width = cont_rect.width;
  this.H = this.canvas.height = cont_rect.height;
  this.ctx = this.canvas.getContext("2d");
  this.C_X = (this.W / 2);
  this.C_Y = (this.H / 2);
  this.BLOCK_LENGTH = 5;
  this.BLOCK = Math.min(this.W / this.BLOCK_LENGTH, this.H / this.BLOCK_LENGTH);
  content.appendChild(this.canvas);
  this.drawFrames = function(callback, isClear) {
    if (isClear) this.ctx.clearRect(0, 0, this.W, this.H);
    return window.requestAnimationFrame(callback);
  }
  var textFps = new TextView( {
    x: this.W - 80,
    y: 50,
    text: "FPS:"
  })
  var lastTime = 0;
  var COUNT_FPS = 0;
  this.updateFPS = (function() {
    var now = performance.now();
    var deltaTime = (now - lastTime) / 1000;
    fps = Math.round(1 / deltaTime);
    lastTime = now;
    textFps.draw(this.ctx);
    COUNT_FPS++;
    if (COUNT_FPS > 40) {
      textFps.text = "FPS:" + fps;
      COUNT_FPS = 0;
    }
  })
})
var Event = (function(eng) {
  var client_rect = eng.canvas.getBoundingClientRect();
  var canvas = eng.canvas;
  this.OnTouchMove = function(callback) {
    canvas.ontouchmove = function(ev) {
      ev.preventDefault();
      var pageX = ev.touches[0].pageX;
      var pageY = ev.touches[0].pageY;
      if (callback) {
        callback( {
          x: pageX - client_rect.left,
          y: pageY - client_rect.top
        });
      }
    };
    canvas.onmausemove = function(ev) {
      var pageX = ev.pageX;
      var pageY = ev.pageY;
      if (callback) {
        callback( {
          x: pageX - client_rect.left,
          y: pageY - client_rect.top
        });
      }
    };
  }
  this.OnClick = function(callback) {
    canvas.onclick = function(ev) {
      var pageX = ev.pageX;
      var pageY = ev.pageY;
      if (callback) {
        callback( {
          x: pageX - client_rect.left,
          y: pageY - client_rect.top
        });
      }
    };
  }
  this.OnClickAndTouchMove = function(callback) {
    this.OnClick(callback);
    this.OnTouchMove(callback);
  }
});

var Floor = (function(eng, data) {
  this.x = verify("x", data) || 0;
  this.y = verify("y", data) || 0;
  this.CELL = verify("CELL", data) || eng.BLOCK;
  this.W = verify("W", data) || eng.BLOCK_LENGTH * 3;
  this.H = verify("H", data) || eng.BLOCK_LENGTH * 3;
  this.speed = 3;
  this.src = verify("src", data) || defaultImage(data, true);
  this.image = verify("image", data) || defaultImage(data);
  this.elements = [];
  this.toward = new Circle(true);
  this.toward.coordinates = {
    x: eng.C_X,
    y: eng.C_Y
  }
  this.toward.speed = 5;
  this.L_W = this.W * this.CELL;
  this.L_H = this.H * this.CELL;
  this.draw = (function() {
    this.R_W = -this.L_W + eng.W;
    this.R_H = -this.L_H + eng.H;
    if (this.x > 0) {
      this.x = 0;
    } else if (this.x < this.R_W) {
      this.x = this.R_W;
    }
    if (this.y > 0) {
      this.y = 0;
    } else if (this.y < this.R_H) {
      this.y = this.R_H;
    }

    for (var ix = 0; ix < this.W; ix ++) {
      for (var iy = 0; iy < this.H; iy++) {
        var x = this.x + (ix * this.CELL);
        var y = this.y + (iy * this.CELL);
        if (x > -this.CELL && y > -this.CELL && x < eng.W && y < eng.H) {
          eng.ctx.drawImage(this.image, x, y, this.CELL, this.CELL);
        }
      }
    }
    this.toward.draw(eng.ctx);
    deb.draw(eng.ctx);
  });
  var order = [];
  this.drawElements = (function(isMx, isMy, c_x, c_y) {
    order.sort(function(a, b) {
      return (a.y + a.W / 2) - (b.y + b.H / 2);
    })
    for (var i = 0; i < order.length; i++) {
      order[i].draw(eng.ctx);
    }
    order = [];
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].x > -this.CELL && this.elements[i].y > -this.CELL && this.elements[i].x < eng.W + this.CELL && this.elements[i].y < eng.H + this.CELL) {
        this.elements[i].autoMove();
        if (order.indexOf(this.elements[i]) == -1) {
          order.push(this.elements[i]);
        }
      }
      this.elements[i].x += isMx ? c_x: 0;
      this.elements[i].coordinates.x += isMx && this.elements[i].coordinates ? c_x: 0;
      this.elements[i].y += isMy ? c_y: 0;
      this.elements[i].coordinates.y += isMy && this.elements[i].coordinates ? c_y: 0;
    }
  });
  this.coordinates = {
    x: eng.C_X,
    y: eng.C_Y
  };
  this.targetX = eng.C_X;
  this.targetY = eng.C_Y;
  this.isMoveX = true;
  this.isMoveY = true;
  this.fallowing = function(isCreature,
    creature) {
    var dx = this.targetX - this.toward.x;
    var dy = this.targetY - this.toward.y;
    if (isCreature) {
      creature.move({
        x: this.toward.x, y: this.toward.y
      });
    }
    var distance = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx);
    if (this.x >= 0 && this.toward.x < eng.C_X || this.x <= this.R_W && this.toward.x > eng.C_X) {
      this.targetX = this.toward.x;
      this.isMoveX = false;
    } else {
      this.targetX = eng.C_X;
      this.isMoveX = true;
    }
    if (this.y >= 0 && this.toward.y < eng.C_Y || this.y <= this.R_H && this.toward.y > eng.C_Y) {
      this.targetY = this.toward.y;
      this.isMoveY = false;
    } else {
      this.targetY = eng.C_Y;
      this.isMoveY = true;
    }
    if (isCreature) {
      if (creature.distance == 0) {
        this.toward.style = "transparent";
      } else {
        this.toward.style = "rgba(94,95,229,0.486)";
      }
    }
    if (distance > this.toward.speed) {
      var count_x = Math.floor(this.toward.speed * Math.cos(angle));
      var count_y = Math.floor(this.toward.speed * Math.sin(angle));
      this.toward.x += this.isMoveX ? count_x: 0;
      this.x += this.isMoveX ? count_x: 0;
      this.toward.y += this.isMoveY ? count_y: 0;
      this.y += this.isMoveY ? count_y: 0;
      this.drawElements(this.isMoveX, this.isMoveY, count_x, count_y)
    } else {
      this.toward.x = this.targetX;
      this.toward.y = this.targetY;
      this.drawElements(false, false, 0, 0)
    }
    //  deb.text = "x:" + parseInt((this.x * -1) + this.toward.x) + " y:" + parseInt((this.y * -1) + this.toward.y);
  }
  this.getById = (function(id) {
    let msg = {};
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].id == id) {
        msg = this.elements[i];
      }
    }
    return msg;
  });
})