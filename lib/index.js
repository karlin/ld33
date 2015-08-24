// import toxi from 'toxiclibsjs'
// import Processing from 'processing-js'
//
// Inspired by http://haptic-data.com/toxiclibsjs/examples/attraction2d

window.requestAnimFrame = (function(){ return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); }; })();

 var  VerletPhysics2D = toxi.physics2d.VerletPhysics2D,
      VerletParticle2D = toxi.physics2d.VerletParticle2D,
      AttractionBehavior = toxi.physics2d.behaviors.AttractionBehavior,
      GravityBehavior = toxi.physics2d.behaviors.GravityBehavior,
      PerlinNoise = toxi.math.noise.PerlinNoise,
      Vec2D = toxi.geom.Vec2D,
      Rect = toxi.geom.Rect;
var NUM_PARTICLES = 50;
var physics;
var enemyPhys;
var mouseAttractor;
var mousePos;
var maxDistance;
var zOffset = 0;
var perlin;
var font;
var bgcolor = 0xff1f1a20;
var stageTimer;
var clickedOnce = false;
var suck;
var score = 0;

function sketchProc(p) {
  function addParticle(phys) {
    var randLoc = Vec2D.randomVector().scale(2).addSelf(p.width / 2, 0);
    var ph = new VerletParticle2D(randLoc);

    phys.addParticle(ph);
    phys.addBehavior(new AttractionBehavior(ph, 30, -1.1, 0.02));
  }

  function addEnemy(phys) {
    var randLoc = Vec2D.randomVector().scale(7).addSelf(p.width / 2, p.height/2);
    var ph = new VerletParticle2D(randLoc);

    phys.addParticle(ph);
    phys.addBehavior(new AttractionBehavior(ph, 80, -1.5, 0.1));
  }

  function elap() {
    return Math.floor((p.millis() - stageTimer)/1000);
  }

  p.setup = function() {
//     p.frameRate(60);
    perlin = new PerlinNoise();
    stageTimer = p.millis();
    p.size(600, 600);
    // p.size(document.body.clientWidth, document.body.clientHeight);
    p.background(bgcolor);

    physics = new VerletPhysics2D();
    // enemyPhys = new VerletPhysics2D();

    physics.setDrag(0.04);
    // enemyPhys.setDrag(0.01);

    physics.setWorldBounds(new Rect(0, 0, p.width, p.height));
    // enemyPhys.setWorldBounds(new Rect(0, 0, p.width, p.height));

    physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.18)));

    p.noStroke();
    p.noSmooth();
    maxDistance = p.dist(0, 0, p.width, p.height);
    font = p.loadFont("Arial");
//     p.rafDraw();
  }

  function getAngle(origin, range, x, y, z) {
    origin = origin || 0;
    range = range || 10;

    var n = p.noise(x, y, z);
    var angle = p.map(n, 0, 1, origin-range, origin+range);

    return angle;
  }
//   p.rafDraw = function() {
  p.draw = function() {
    p.background(bgcolor);

    if (clickedOnce) {
      if (physics.particles.length < NUM_PARTICLES) {
        addParticle(physics);
      }
      physics.update();
      // enemyPhys.update();
    }
    // if (physics.particles.length  NUM_PARTICLES) {
      for ( i=0;i<physics.particles.length;i++) {
        var ph = physics.particles[i];
        var noise = 0.5* (perlin.noise( ph.x, ph.y ) - 0.5);
        p.fill(0x9abbff00);
        p.ellipse(ph.x, ph.y, 5, 5);
        p.fill(0x8a88ff00);
        p.ellipse(ph.x, ph.y, 15, 15);
        p.fill(0x4588ff00);
        p.ellipse(ph.x, ph.y, 5+(26*noise), 5+(26*noise));
        p.fill(0x1088ff00);
        p.ellipse(ph.x, ph.y, 45+(10*noise), 45+(10*noise));
        p.fill(0x0888ff00);
        p.ellipse(ph.x, ph.y, 65+(24*noise), 65+(24*noise));
      }
    // }
    // for ( i=0;i<enemyPhys.particles.length;i++) {

//     if (p.mouseButton == p.LEFT) {


    if (p.__mousePressed && p.mouseButton === p.LEFT) {

      for(var i = 0; i <= p.width; i += 50) {
        for(var j = 0; j <= p.height; j += 50) {
          var size = p.dist(p.mouseX, p.mouseY, i, j);
          size = size/maxDistance * 132;
          if (size > 6) {
            p.fill(0x20000000);
            p.ellipse(i, j, size*6, size*6);
            // p.fill(0xb0000000);
            // p.ellipse(i, j, size, size);
          }
        }
      }

      var xOffset = p.mouseX*0.01;
      var yOffset = p.mouseY*0.01;
      p.pushMatrix();
        p.rotate(getAngle(6, 12, xOffset, yOffset, zOffset)/100);

        p.fill(0x80000000);
        p.ellipse(p.mouseX-30, p.mouseY-20, 20, 10);
        p.ellipse(p.mouseX+30, p.mouseY-20, 20, 10);
        p.fill(0x80ffe0e0);
        p.ellipse(p.mouseX-28, p.mouseY-22, 5, 4);
        p.ellipse(p.mouseX+30, p.mouseY-22, 5, 4);

        p.fill(0x03e0ffe0);
        p.ellipse(p.mouseX, p.mouseY, 140, 160);
        zOffset += 0.01;
      p.popMatrix();
    }

    p.fill(240);
    p.textFont(font, 20);

    if (!clickedOnce) {
      p.text("Point if you're ready.", 15, 20, 270, 70);
      stageTimer = p.millis();
    }

    if (clickedOnce) {
      var now = elap();
      if (now > 2 && now < 8) {
        p.text("I know I've been here for a long time.", 15, 20, 270, 70);
      } else if (now > 9 && now < 14) {
        p.text("Long enough to have lost what \"I\" once meant.", 15, 20, 270, 70);

      } else if (now > 15 && now < 19) {
        p.text("Now, even \"here\" is getting... fuzzy.", 15, 20, 270, 70);

      } else if (now > 20 && now < 24) {
        p.text("Sometimes I can", 25, 40, 300, 90);
        p.fill(0x7fff8822);
        p.text("PUSH", 180, 40, 300, 90);
        p.fill(240);
        p.text("to collect my thoughts", 240, 40, 300, 90);
      } else if (now > 25 && now < 29) {
        p.text("When I let go, things fall away.", 15, 20, 270, 70);
      } else if (now > 30) {
      // }
      // if (now > 3) {
        if (physics.particles.length < NUM_PARTICLES + 2) {
          var randLoc = Vec2D.randomVector().scale(2).addSelf(20, 20);
          var ph = new VerletParticle2D(randLoc);

          physics.addParticle(ph);
          physics.addBehavior(new AttractionBehavior(ph, 80, -1.5, 0.1));
          var randLoc2 = Vec2D.randomVector().scale(2).addSelf(20, 20);
          var ph2 = new VerletParticle2D(randLoc2);

          physics.addParticle(ph2);
          physics.addBehavior(new AttractionBehavior(ph2, 80, -1.5, 0.1));

        }
        for ( i=NUM_PARTICLES;i<NUM_PARTICLES+2;i++) {
          var ph = physics.particles[i];
          var noise = 2.5* (perlin.noise( ph.x, ph.y ) - 0.5);
          p.fill(0x8af84f10);
          p.ellipse(ph.x, ph.y, 15, 15);
          p.fill(0x10f80f00);
          p.ellipse(ph.x, ph.y, 45+(20*noise), 45+(20*noise));
        }

      } else if (now > 39) {
      // }
      // if (now > 3) {
        // physics.removeParticle(physics.particles[NUM_PARTICLES]);
        // physics.removeParticle(physics.particles[NUM_PARTICLES+1]);

        if (physics.particles.length < NUM_PARTICLES + 2) {
        // if (physics.particles.length != NUM_PARTICLES + 3) {
          var randLoc = Vec2D.randomVector().scale(5).addSelf(p.width / 3, p.height/3);
          var ph = new VerletParticle2D(randLoc);

          physics.addParticle(ph);
          suck = new AttractionBehavior(ph, 20, 1.61,0.01);
          physics.addBehavior(suck);
          // physics.addBehavior(new AttractionBehavior(ph, 80, -1.5, 0.1));
        }

        // for ( i=NUM_PARTICLES;i<NUM_PARTICLES+1;i++) {
          var ph = physics.particles[NUM_PARTICLES+2];
          // physics.removeBehavior()
          p.fill(0x8af84ff0);
          p.ellipse(ph.x, ph.y, 25, 25);
        // }
      }

      for ( i=0;i<physics.particles.length;i++) {
        var ph = physics.particles[i];
        var dx = p.mouseX - ph.x;
        var dy = p.mouseY - ph.y;
        var dist = Math.sqrt((dx*dx)+(dy*dy));
        if (dist < 100) {
          if (i < NUM_PARTICLES) {
            score -= 0.01;
          } else {
            score += 0.001;
          }
        }
      }

      p.fill(0x30ffffff);
      p.textFont(font, 40);
      p.text(""+elap(), 545, 10, 270, 70);

      p.fill(0x30ff7f7f);
      p.textFont(font, 30);
      p.text(""+Math.round(score), 505, 50, 270, 70);

    }


//    window.requestAnimFrame(p.rafDraw);
  }

  p.mousePressed = function() {
    clickedOnce = true;
    mousePos = new Vec2D(p.mouseX, p.mouseY);
    mouseAttractor = new AttractionBehavior(mousePos, 260, 0.59);
    physics.addBehavior(mouseAttractor);
  }

  p.mouseDragged = function() {
    mousePos.set(p.mouseX, p.mouseY);
  }

  p.mouseReleased = function() {
    physics.removeBehavior(mouseAttractor);
  }
}

var canvas = document.getElementById("canvas1");
var processingInstance = new Processing(canvas, sketchProc);
