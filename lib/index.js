// import toxi from 'toxiclibsjs'
// import Processing from 'processing-js'
//
// Inspired by http://haptic-data.com/toxiclibsjs/examples/attraction2d

window.requestAnimFrame = (function(){ return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); }; })();

 let  VerletPhysics2D = toxi.physics2d.VerletPhysics2D,
      VerletParticle2D = toxi.physics2d.VerletParticle2D,
      AttractionBehavior = toxi.physics2d.behaviors.AttractionBehavior,
      GravityBehavior = toxi.physics2d.behaviors.GravityBehavior,
      PerlinNoise = toxi.math.noise.PerlinNoise,
      Vec2D = toxi.geom.Vec2D,
      Rect = toxi.geom.Rect;
const NUM_PARTICLES = 60;
let physics;
let enemyPhys;
let mouseAttractor;
let mousePos;
let maxDistance;
let zOffset = 0;
let perlin;
let font;
const bgcolor = 0xff1f1a20;
let stageTimer;
let clickedOnce = false;
let suck = null;
let score = 0;
let nudge = null;
let holdTime = 6000;

function sketchProc(p) {
  function addParticle(phys) {
    let randLoc = Vec2D.randomVector().scale(2).addSelf(p.width / 2, 0);
    let ph = new VerletParticle2D(randLoc);

    phys.addParticle(ph);
    phys.addBehavior(new AttractionBehavior(ph, 30, -1.4, 0.01));
  }

  function addEnemy(phys) {
    let randLoc = Vec2D.randomVector().scale(7).addSelf(p.width / 2, p.height/2);
    let ph = new VerletParticle2D(randLoc);

    phys.addParticle(ph);
    phys.addBehavior(new AttractionBehavior(ph, 80, -1.5, 0.1));
  }

  function elap() {
    return Math.floor((p.millis() - stageTimer)/1000);
  }

  p.setup = function() {
    let bgm=document.getElementById("music");
    bgm.volume=0.3;
//     p.frameRate(60);
    perlin = new PerlinNoise();
    stageTimer = p.millis();
    p.size(600, 570);
    // p.size(document.body.clientWidth, document.body.clientHeight);
    p.background(bgcolor);

    physics = new VerletPhysics2D();
    // enemyPhys = new VerletPhysics2D();

    physics.setDrag(0.06);
    // enemyPhys.setDrag(0.01);

    physics.setWorldBounds(new Rect(0, 0, p.width, p.height));
    // enemyPhys.setWorldBounds(new Rect(0, 0, p.width, p.height));
    nudge = new toxi.physics2d.behaviors.ConstantForceBehavior(new Vec2D(0, 0.18));
    physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.15)));

    [[0,0], [p.width, 0], [p.width, p.height], [0, p.height]].map(function(corner){
      let cornerVec = new Vec2D(corner[0], corner[1]);
      let cornerP = new VerletParticle2D(cornerVec);
      cornerP.isLocked = true;
      physics.addParticle(cornerP);
      physics.addBehavior(new AttractionBehavior(cornerP, 120, -4, 0.01));
    })

    p.noStroke();
    p.noSmooth();
    maxDistance = p.dist(0, 0, p.width, p.height);
    font = p.loadFont("Arial");
//     p.rafDraw();
  }

  function getAngle(origin, range, x, y, z) {
    origin = origin || 0;
    range = range || 10;

    let n = p.noise(x, y, z);
    let angle = p.map(n, 0, 1, origin-range, origin+range);

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
      let numParticles = Math.min(physics.particles.length, NUM_PARTICLES);
      for ( i=4;i<numParticles;i++) {
        let ph = physics.particles[i];
        let noise = 0.5* (perlin.noise( ph.x, ph.y ) - 0.5);
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
      physics.particles.map(function(ph, i) {
        let dx = p.mouseX - ph.x;
        let dy = p.mouseY - ph.y;
        let dist = Math.sqrt((dx*dx)+(dy*dy));
        let delta = 0.0;
        if (dist < 100) {
          if (i > 3 && i < NUM_PARTICLES) {
            delta += 0.002;
          } else if (i >= NUM_PARTICLES) {
            delta -= 0.01;
          }
        }
        delta *= elap()/20;
        score += delta;
      });

      for(var i = 0; i <= p.width; i += 50) {
        for(let j = 0; j <= p.height; j += 50) {
          let size = p.dist(p.mouseX, p.mouseY, i, j);
          size = size/maxDistance * 132;
          if (size > 6) {
            p.fill(0x20000000);
            p.ellipse(i, j, size*6, size*6);
            // p.fill(0xb0000000);
            // p.ellipse(i, j, size, size);
          }
        }
      }

      let xOffset = p.mouseX*0.01;
      let yOffset = p.mouseY*0.01;
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
      let now = elap();
      if (now > 2 && now < 8) {
        p.text("I know I've been here for a long time.", 15, 20, 270, 70);
      } else if (now > 9 && now < 14) {
        p.text("Long enough to have lost what \"I\" once meant.", 15, 20, 270, 70);

      } else if (now > 15 && now < 19) {
        p.text("Now, even \"here\" is getting... fuzzy.", 15, 20, 270, 70);

      } else if (now > 20 && now < 24) {

        // STAGE 1

        p.text("Sometimes I can", 25, 40, 300, 90);
        p.fill(0x7fff8822);
        p.text("PUSH", 180, 40, 300, 90);
        p.fill(240);
        p.text("to collect my thoughts for a bit", 240, 40, 300, 90);
      } else if (now > 25 && now < 27) {
        p.text("When I let go, things fall away.", 15, 20, 270, 70);
      } else if (now > 29 && now < 38) {

        // STAGE 2

        if (physics.particles.length == NUM_PARTICLES) {
          holdTime = 3000;
          let randLoc = Vec2D.randomVector().scale(2).addSelf(20, 20);
          let ph = new VerletParticle2D(randLoc);

          physics.addParticle(ph);
          physics.addBehavior(new AttractionBehavior(ph, 80, -1.5, 0.1));
          let randLoc2 = Vec2D.randomVector().scale(2).addSelf(20, 20);
          var ph2 = new VerletParticle2D(randLoc2);

          physics.addParticle(ph2);
          physics.addBehavior(new AttractionBehavior(ph2, 80, -1.5, 0.1));
        }
        p.text("It's easy to lose track, and my memories steal focus.", 15, 20, 270, 70);
      } else if (now > 39 && now < 44) {

        // STAGE 3

        if (physics.particles.length == NUM_PARTICLES + 2) {
          // if (physics.particles.length != NUM_PARTICLES + 3) {
          let loc = Vec2D.randomVector().scale(5).addSelf(p.width / 3, p.height/3);
          let ph = new VerletParticle2D(loc);

          physics.addParticle(ph);

          suck = new AttractionBehavior(ph, 160, 0.11, 0.1);
          // suck = new AttractionBehavior(ph, 40, 2, 0.001);
          physics.addBehavior(suck);
          // physics.addBehavior(new AttractionBehavior(ph, 80, -1.5, 0.1));
        }

      } else if (now > 44 && now < 46) {
        p.text("The longer I stay here..., the harder it gets", 15, 20, 270, 70);
      } else if (now > 46 && now < 48) {
        p.text("...the harder it gets to hold it together.", 15, 20, 270, 70);
      }
      physics.particles.slice(NUM_PARTICLES,NUM_PARTICLES+2).map(function(ph) {
        let noise = 2.5* (perlin.noise( ph.x, ph.y ) - 0.5);
        p.fill(0xaaf84ff0);
        p.ellipse(ph.x, ph.y, 20, 20);
        p.fill(0x20f80ff0);
        p.ellipse(ph.x, ph.y, 45+(20*noise), 45+(20*noise));
      });

      physics.particles.slice(NUM_PARTICLES+2,NUM_PARTICLES+3).map(function(ph) {
        p.fill(0x8f504fff);
        p.ellipse(ph.x, ph.y, 15, 15);
      })

      //p.fill(0x30ffffff);
      //p.textFont(font, 40);
      //p.text(""+elap(), 545, 10, 270, 70);

      p.fill(0x30ff7f7f);
      p.textFont(font, 30);
      p.text("Self: ", 460, 50, 270, 70);
      p.text(""+Math.round(score), 525, 50, 270, 70);

    }


//    window.requestAnimFrame(p.rafDraw);
  }

  function releaseMouse() {
    if (suck !== null) {
      physics.addBehavior(suck);
      physics.setDrag(0.06);

    }
    physics.removeBehavior(mouseAttractor);
  }

  p.mousePressed = function() {
    clickedOnce = true;
    mousePos = new Vec2D(p.mouseX, p.mouseY);
    mouseAttractor = new AttractionBehavior(mousePos, 250, 0.9);

    if (suck !== null) {
      // if (physics.particles.length == NUM_PARTICLES + 2) {
        // let nf = 10.5 * (perlin.noise(physics.particles[10].x, mousePos.y ) - 0.5);
        // nudge.setForce(new Vec2D(nf, nf));
        // nudge.setStrength(nf);
      // }
      physics.addBehavior(nudge);
      physics.removeBehavior(suck);
      physics.setDrag(0.16);
    }

    physics.addBehavior(mouseAttractor);
    document.clickTimer = setTimeout(releaseMouse, holdTime);
  }

  p.mouseDragged = function() {
    mousePos.set(p.mouseX, p.mouseY);
  }

  p.mouseReleased = function() {
    clearTimeout(document.clickTimer);
    physics.removeBehavior(nudge);

    releaseMouse();
  }
}

let canvas = document.getElementById("canvas");
let processingInstance = new Processing(canvas, sketchProc);
