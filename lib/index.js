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
var mouseAttractor;
var mousePos;
var maxDistance;
var zOffset = 0;
var perlin;
var bgcolor = 0xff1f1a20;

function sketchProc(p) {
  function addParticle() {
    var randLoc = Vec2D.randomVector().scale(5).addSelf(p.width / 2, 0);
    var ph = new VerletParticle2D(randLoc);
    perlin = new PerlinNoise();

    physics.addParticle(ph);
    // add a negative attraction force field around the new particle
    physics.addBehavior(new AttractionBehavior(ph, 30, -1.1, 0.02));
  }

  p.setup = function() {
//     p.frameRate(60);
    p.size(600, 600);
    //p.size(document.body.clientWidth, document.body.clientHeight);
    p.background(bgcolor);
    // setup physics with 10% drag
    physics = new VerletPhysics2D();
    physics.setDrag(0.03);
    physics.setWorldBounds(new Rect(0, 0, p.width, p.height));
    // the NEW way to add gravity to the simulation, using behaviors
    physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.18)));
    p.noStroke();
    p.noSmooth();
//     p.angleMode(p.DEGREES);
    maxDistance = p.dist(0, 0, p.width, p.height);
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

    if (physics.particles.length < NUM_PARTICLES) {
      addParticle();
    }
    physics.update();
    for ( i=0;i<physics.particles.length;i++) {
      var ph = physics.particles[i];
      var noise = 0.5* (perlin.noise( ph.x, ph.y ) - 0.5);
      p.fill(0x9abbff00);
      p.ellipse(ph.x, ph.y, 5, 5);
      p.fill(0x8a88ff00);
      p.ellipse(ph.x, ph.y, 15, 15);
      p.fill(0x6588ff00);
      p.ellipse(ph.x, ph.y, 5+(26*noise), 5+(26*noise));
      p.fill(0x1088ff00);
      p.ellipse(ph.x, ph.y, 45+(10*noise), 45+(10*noise));
      p.fill(0x0888ff00);
      p.ellipse(ph.x, ph.y, 65+(24*noise), 65+(24*noise));
    }

//     if (p.mouseButton == p.LEFT) {


    if (p.__mousePressed && p.mouseButton === p.LEFT) {

      for(var i = 0; i <= p.width; i += 60) {
        for(var j = 0; j <= p.height; j += 60) {
          var size = p.dist(p.mouseX, p.mouseY, i, j);
          size = size/maxDistance * 132;
          if (size > 6) {
            p.fill(0x10000000);
            p.ellipse(i, j, size*5, size*5);
            p.fill(0x30000000);
            p.ellipse(i, j, size*2, size*2);
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
        p.fill(0x80f0f0f0);
        p.ellipse(p.mouseX-28, p.mouseY-22, 5, 4);
        p.ellipse(p.mouseX+30, p.mouseY-22, 5, 4);

        p.fill(0x05e0ffe0);
        p.ellipse(p.mouseX, p.mouseY, 140, 160);
        zOffset += 0.01;
      p.popMatrix();
    }
//    window.requestAnimFrame(p.rafDraw);
  }

  p.mousePressed = function() {
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
