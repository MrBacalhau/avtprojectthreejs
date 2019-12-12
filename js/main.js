var SCENE;
var CAMERA1, CAMERA2, CAMERA3;
var CAMERAS = [CAMERA1, CAMERA2, CAMERA3];
var CAMERA = CAMERA1;
var STEREO_CAMERA;
var CONTROLLER;

var HEAD_ANGLE = 0;
var HEAD_HEIGHT = 0;

var STEREO_ON = false;

var RENDERER;
var FROG; // Needed to make camera follow frog.
var INITIAL_POSITION = new THREE.Vector3(0,-80,0);
var SUN;
var GRASS;
var RIVER;
var ROAD;


var PARTICLE_SYSTEM;

var NODE;

var LIVES = 5;
var SCORE = 0;
var GAME_OVER = false;

var UI_SCENE;
var UI_CAM;
var P_TXT, GO_TXT, L_DSP, SCORE_TXT;

var UPDATE = [];
var SOLIDS = [];
var CLOCK = new THREE.Clock();

var PAUSED = false;
var fogColor;

var WIDTH = 240, HEIGHT = 240;

function initScene(){
  'use strict';

  SCENE = new THREE.Scene();

  /*var uniforms_vertex = {
    ModelMatrix
    ViewMatrix
    ModelViewMatrix
    pvmMatrix
  }
  var uniforms_frag = {
    cubeMap
    colorMap
  }
  var skyBoxMaterial = new THREE.ShaderMaterial({
    vertexShader: getElementById('vertexShader').texContent,
    fragmentShader: getElementById('fragmentShader').texContent
  });*/

  fogColor = new THREE.Color(0xaaaaaa);
  SCENE.background = new THREE.CubeTextureLoader()
  .setPath( 'tex/SkyBox/' )
  .load( [
    'ashcanyon_lf.jpg',
    'ashcanyon_rt.jpg',
    'ashcanyon_up.jpg',
    'ashcanyon_dn.jpg',
    'ashcanyon_ft.jpg',
    'ashcanyon_bk.jpg'
  ] );
  
  SCENE.fog = new THREE.FogExp2(fogColor,0.005);




  CAMERA1 = new THREE.OrthographicCamera( WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 1, 1000  );
  RENDERER = new THREE.WebGLRenderer();
  RENDERER.autoClear = false;
  RENDERER.setSize( window.innerWidth, window.innerHeight );
  RENDERER.shadowMapEnabled = true; // CHANGE ME
  NODE = RENDERER.domElement;
  document.body.appendChild(RENDERER.domElement);
  CAMERA1.position.z = 200;

  CAMERA2 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 5, 800);
  CAMERA3 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 5, 800);
  CAMERA2.position.set(200, 200, 100);
  CAMERA2.up = new THREE.Vector3(0,0,1);
  CAMERA3.up = new THREE.Vector3(0,0,1);
  CAMERA3.position.set(0, 0, 10);
  CAMERA2.lookAt(new THREE.Vector3(0,0,0));

  CONTROLLER = new THREE.OrbitControls(CAMERA2);

  CONTROLLER.maxPolarAngle = Math.PI / 2 - 0.1;
  CONTROLLER.keyPanSpeed = 0;

  STEREO_CAMERA = new THREE.StereoCamera();
  STEREO_CAMERA.aspect = 0.5;

  CAMERAS = [CAMERA1, CAMERA2, CAMERA3];
  CAMERA = CAMERA1
}

function onResize(){
  'use strict';

  RENDERER.setSize(window.innerWidth, window.innerHeight);
  if (window.innerHeight > 0 && window.innerWidth > 0){
    var width = WIDTH, height = HEIGHT;
    var aspRatio = RENDERER.getSize().width/RENDERER.getSize().height;
    if (RENDERER.getSize().width > RENDERER.getSize().height){
      width = height*aspRatio;
    } else {
      height = width/aspRatio;
    }
    CAMERA1.left = width / -2;
    CAMERA1.right = width / 2;
    CAMERA1.top = height / 2;
    CAMERA1.bottom = height / - 2;
    CAMERA1.updateProjectionMatrix();
    UI_CAM.left = width / -2;
    UI_CAM.right = width / 2;
    UI_CAM.top = height / 2;
    UI_CAM.bottom = height / - 2;
    UI_CAM.updateProjectionMatrix();
    CAMERA2.aspect = aspRatio;
    CAMERA3.aspect = aspRatio;
    CAMERA2.updateProjectionMatrix();
    CAMERA3.updateProjectionMatrix();
  }
  RENDERER.render( SCENE, CAMERA );
}

function createTrack(){
  'use strict';

  function turtleLine(start, end) {
    var distance = start.distanceTo(end);
    var count = distance/(40+ Math.random()*50); // Density
    var deltaTurtle = (end.sub(start)).divideScalar(count);
    var lastTurtle = start;
    for (var i=0; i<count-1; i++){
      lastTurtle = lastTurtle.add(deltaTurtle);
      new Turtle(lastTurtle);
    }
  }

  function woodLine(start, end) {
    var distance = start.distanceTo(end);
    var count = distance/(40+ Math.random()*50); // Density
    var deltaWood = (end.sub(start)).divideScalar(count);
    var lastWood = start;
    for (var i=0; i<count-1; i++){
      lastWood = lastWood.add(deltaWood);
      new Wood(lastWood);
    }
  }

  function carLine(start, end) {
    var distance = start.distanceTo(end);
    var count = distance/(40+ Math.random()*50); // Density
    var deltaCar = (end.sub(start)).divideScalar(count);
    var lastCar = start;
    for (var i=0; i<count-1; i++){
      lastCar = lastCar.add(deltaCar);
      new Carr(lastCar);
    }
  }

  // Create TurtleLines
  turtleLine(new THREE.Vector3(-100,+55,0.5), new THREE.Vector3(+100,+55,0.5));
  turtleLine(new THREE.Vector3(-100,+25,0.5), new THREE.Vector3(+100,+25,0.5));

  // Create woodLines
  woodLine(new THREE.Vector3(-100,+40,0), new THREE.Vector3(+100,+40,0));


  carLine(new THREE.Vector3(-100,-40,1), new THREE.Vector3(+100,-40,1));
  carLine(new THREE.Vector3(-100,-55,1), new THREE.Vector3(+100,-55,1));
  carLine(new THREE.Vector3(-100,-25,1), new THREE.Vector3(+100,-25,1));

  new Candle(new THREE.Vector3(75, 0, 0));
  new Candle(new THREE.Vector3(-75,0 ,0));
  new Candle(new THREE.Vector3(75, -80, 0));
  new Candle(new THREE.Vector3(-75, -80, 0));
  new Candle(new THREE.Vector3(75, 80, 0));
  new Candle(new THREE.Vector3(-75, 80, 0));

    // Create the flags.
    UPDATE.push(new Flag(new THREE.Vector3(35,70,0)));
    UPDATE.push(new Flag(new THREE.Vector3(85,70,0)));
    UPDATE.push(new Flag(new THREE.Vector3(-35,70,0)));
    UPDATE.push(new Flag(new THREE.Vector3(-85,70,0)));

    PARTICLE_SYSTEM = new ParticleSystem();
    UPDATE.push(PARTICLE_SYSTEM);
}

function initializeMirrors(){
  var geom1 = new THREE.PlaneBufferGeometry(200, 30, 1, 1);
  new Mirror(SCENE, geom1, (mirror) => {
    mirror.position.x = 0;
    mirror.position.y = 100;
    mirror.position.z = 15;
    mirror.rotateX( Math.PI / 2 );
  });


  var geom1 = new THREE.PlaneBufferGeometry(30, 200, 1, 1);
  new Mirror(SCENE, geom1, (mirror) => {
    mirror.position.x = 100;
    mirror.position.y = 0;
    mirror.position.z = 15;
    mirror.rotateY( - Math.PI / 2 );
  });
}

function gameStart() {
  'use strict';

  initializeMirrors();
  ROAD = new Road();
  RIVER = new River();
  GRASS = new Grass();
  createTrack();
  FROG = new Frog(INITIAL_POSITION, new THREE.Vector3(0,1,0));
  UPDATE.push(FROG);

  SUN = new THREE.DirectionalLight(0xf7e7c0, 1.2);
  SUN.position.set(200, 200, 10);
  SUN.target = GRASS.mesh;
  SCENE.add(SUN);

  var l = new THREE.TextureLoader();

  var flare1 = l.load('tex/Flare1.png');
  var flare2 = l.load('tex/Flare5.png');
  var flare3 = l.load('tex/Flare6.png');
  var shine1 = l.load('tex/Shine2.png');


  var lensflare = new THREE.Lensflare();
  lensflare.addElement( new THREE.LensflareElement(shine1, 200, 0, new THREE.Color(0xffffff)) );
  lensflare.addElement( new THREE.LensflareElement(flare1, 100, 0.3, new THREE.Color(0xb5dae0)) );
  lensflare.addElement( new THREE.LensflareElement(flare2, 180, 0.5, new THREE.Color(0x58e2b9)) );
  lensflare.addElement( new THREE.LensflareElement(flare3, 140, 0.65, new THREE.Color(0xb5dae0)) );

  SUN.add(lensflare);

  SCENE.add(new THREE.AmbientLight(0x6985b2, 0.1));
}

function updateFollowCamera(delta) {
  if (CAMERA != CAMERA3 && !STEREO_ON) return;
  var pos = new THREE.Vector3(FROG.mesh.position.x, FROG.mesh.position.y, FROG.mesh.position.z);
  var dir = FROG.direction.clone();
  dir.applyAxisAngle(new THREE.Vector3(0,0,1), HEAD_ANGLE);
  dir.multiplyScalar(80);
  var pos2 = pos.clone();
  pos2.sub(dir);
  pos2.z = 30 + HEAD_HEIGHT;
  CAMERA3.position.lerp(pos2, 3 * delta);
  CAMERA3.lookAt(pos);
}

function setupUI() {
  UI_SCENE = new THREE.Scene();
  UI_CAM = new THREE.OrthographicCamera( WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 1, 1000  );
  UI_CAM.position.set(0,0,400);
  P_TXT = new PauseTxt();
  GO_TXT = new GameOverTxt();
  L_DSP = new HitPoints();
  SCORE_TXT = new ScoreTxt();

  var light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(0,0,100);
  UI_SCENE.add(light);

}

function animate() {
  'use strict';

  var delta = CLOCK.getDelta();
  if (PAUSED) delta = 0;

  // Collision checking.
  var unchecked = [].concat(SOLIDS);
  SOLIDS.forEach(function() {
    var obj = unchecked.pop();
    unchecked.forEach(function(other) {
      if (obj.hasCollision(other)) {
        obj.collide(other);
        other.collide(obj);
      }
    });
  });

  // Update each object
  UPDATE.forEach(function(ob) {
    if (ob.update) ob.update(delta);
  });

  updateFollowCamera(delta);
  STEREO_CAMERA.update(CAMERA3);

  // Render
  if (!STEREO_ON) {
    RENDERER.clear();
    RENDERER.render(SCENE, CAMERA);
    RENDERER.clearDepth();
    RENDERER.render(UI_SCENE, UI_CAM);
  }
  else
    stereoRender();

  CONTROLLER.update();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", onResize);
window.addEventListener("keydown", function(key) {
  switch (key.key) {
    case "1":
      CAMERA = CAMERA1;
      break;

    case "2":
      CAMERA = CAMERA2;
      break;

    case "3":
      CAMERA = CAMERA3;
      break

    case "N":
    case "n":
      SUN.visible = !SUN.visible;
      break;

    case "S":
    case "s":
      if (!GAME_OVER) PAUSED = !PAUSED;
      break;

    case "F":
    case "f":
        if(SCENE.fog != null){
            SCENE.fog = null;
        }
        else{
            SCENE.fog = new THREE.FogExp2(fogColor,0.005);
        }
        break;

    case "L":
    case "l":
      GRASS.mesh.receiveShadow = !GRASS.mesh.receiveShadow;
      ROAD.mesh.receiveShadow = !ROAD.mesh.receiveShadow;
      RIVER.mesh.receiveShadow = !RIVER.mesh.receiveShadow;
      break;

  }



});

function stereoRender() {
  var size = RENDERER.getSize();
  RENDERER.setScissorTest(true);

  SCENE.updateMatrixWorld();
  STEREO_CAMERA.update(CAMERA3);

  RENDERER.clear();

  RENDERER.setScissor( 0, 0, size.width / 2, size.height );
	RENDERER.setViewport( 0, 0, size.width / 2, size.height );
  RENDERER.render( SCENE, STEREO_CAMERA.cameraL );

  RENDERER.setScissor( size.width / 2, 0, size.width / 2, size.height );
	RENDERER.setViewport( size.width / 2, 0, size.width / 2, size.height );
  RENDERER.render( SCENE, STEREO_CAMERA.cameraR );

  RENDERER.setScissorTest(false);
  RENDERER.setViewport(0,0, size.width, size.height);
}

function restartGame() {
  // Reset Global Vars.
  CAMERA = CAMERA1;
  INITIAL_POSITION = new THREE.Vector3(0,-80,0);
  LIVES = 5;
  GAME_OVER = false;

  UPDATE = [];
  SOLIDS = [];
  CLOCK = new THREE.Clock();

  PAUSED = false;

  WIDTH = 240, HEIGHT = 240;

  IN_WIREFRAME = false;
  ILUMINATE = true;
  PHONG_SWITCH = true;

  // Reset the Renderer
  RENDERER.dispose();
  document.body.removeChild(NODE);

  // Re-initialize the game.
  initScene();
  gameStart();
  setupUI();
  onResize();
}

window.addEventListener("keydown", function(key) {
  if (!GAME_OVER) return;
  if (key.key == "R" || key.key == "r") {
    restartGame();
  }
});

window.addEventListener("deviceorientation", function(event) {
  HEAD_ANGLE = (event.alpha / 360) * 2 * Math.PI;
  HEAD_HEIGHT = Math.max((event.gamma / 360) * 200, - 20);
}, true);

initScene();
gameStart();
setupUI();
onResize();
animate();

function setStereo() {
  document.documentElement.webkitRequestFullScreen();
  window.screen.orientation.lock("landscape-primary");
}
