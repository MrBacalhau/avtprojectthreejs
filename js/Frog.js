var black_bas = new THREE.MeshBasicMaterial({color: 0x0});
var black_phong = new THREE.MeshPhongMaterial({color: 0x0, emissive: 0x0, specular: 0x878787, shininess: 3});
var black_lamb = new THREE.MeshLambertMaterial({color: 0x101010, emissive: 0x0});

function Frog(position, direction) {
  'use strict';

  var self = this;

  this.midLap = false;

  var mesh = new THREE.Object3D();

  var protec=false;

  var phong = new THREE.MeshPhongMaterial({color: 0x796b26, emissive: 0x0, specular: 0xd5e3af, shininess: 5});
  var lambert = new THREE.MeshLambertMaterial({color: 0x796b26, emissive: 0x0});

  // Add cockpit

  var geometry = new THREE.SphereGeometry(4,10,10); //new THREE.BoxGeometry( 6, 6, 6 );
  var material = phong;
  var bodymesh = new THREE.Mesh( geometry, material );
  bodymesh.position.set(0, 0, 2);
  mesh.add(bodymesh);

  // Add nose
  geometry = new THREE.SphereGeometry(3,10,10); //new THREE.BoxGeometry( 4, 6, 4 );
  var headmesh = new THREE.Mesh( geometry, material);
  headmesh.position.set(0, 3, 2.5);
  mesh.add(headmesh);

  this.light1 = new THREE.SpotLight(0xfffffffff, 1, 100, Math.PI/6, 0.7, 1);
  this.light1.position.set(0, 0.5, 0);
  this.light1.shadowCameraNear = 0.01;
  this.light1.castShadow = true;
  this.light1.shadowDarkness = 0.5;

  headmesh.add(this.light1);

  SCENE.add(this.light1.target);



  MovableObject.call(this, position, mesh, material, lambert, phong);
  SolidObject.call(this, position, mesh, new SphereBox(6), material, lambert, phong);
  this.direction = direction;
  this.potAngularSpd = 0;

  this.target = [bodymesh, headmesh];

  this.target.material = ILUMINATE ? this.lightMat : this.basicMat;

  this.lightMat2 = PHONG_SWITCH ? black_phong : black_lamb;

  this.targets = [[50, -80], [50, 0], [20, 0], [0, 80]];
  this.currentTarget = 0;

  // Movement
  this.keypress = function(key) {
    switch (key.key) {
      case "ArrowUp":
        self.speed = 30;
        break;

      case "ArrowDown":
        self.speed = - 30;
        break;

      case "ArrowLeft":
        var zz = new THREE.Vector3(0,0,1);
        self.potAngularSpd = Math.PI;
        break;

      case "ArrowRight":
        var zz = new THREE.Vector3(0,0,1);
        self.potAngularSpd = -Math.PI;
        break;
    }
  }

  this.keyup = function(key) {
    switch(key.key) {
      case "ArrowUp":
      case "ArrowDown":
        self.speed = 0;
        break;

      case "ArrowLeft":
      case "ArrowRight":
        self.potAngularSpd = 0;
        break;
    }
  }

  this.followPath = function() {
    var target = new THREE.Vector3(this.targets[this.currentTarget][0], this.targets[this.currentTarget][1], 0);
    var lineToTarget = target.clone().sub(this.mesh.position);
    var direction = this.direction.clone();
    var angle = direction.angleTo(lineToTarget);

    this.speed =30

    var dist = this.mesh.position.distanceTo(target);
    if (dist < 5) {
      this.speed=0;
      this.currentTarget = (this.currentTarget + 1) % this.targets.length;
    }

    if (angle > 0.3) {
      this.angularSpd = Math.PI;
    }
    if (angle > Math.PI) {
      this.angularSpd = - Math.PI;
    }
    if (angle < 0.3 || angle > 2*Math.PI -0.3){
      this.angularSpd=0;
    }

  }

  this.update = function(delta) {
    this.angularSpd = this.potAngularSpd;
    if (STEREO_ON) this.followPath();

    var disp = this.move(delta);
    disp.divideScalar(20);
    if (this.isOutside() ||(this.mesh.position.y>20 && this.mesh.position.y<65 && !protec)) {
      console.log("Sploosh!");
      LIVES--;
      L_DSP.updateLives(LIVES);
      
      if (LIVES <= 0) {
        PAUSED = true;
        GAME_OVER = true;
        GO_TXT.mesh.visible = true;
      }
      this.speed = 0;
      this.currentTarget=0;
      this.mesh.position.copy(INITIAL_POSITION);
    }
    protec=false;
    this.light1.target.position.copy(this.mesh.position).add(this.direction.clone().multiplyScalar(100));



    if (this.mesh.position.y>75) {

      SCORE++;
      SCORE_TXT.updateScore(SCORE);
      console.log('Win!');
      this.midLap = false;
      PARTICLE_SYSTEM.reset();
      this.speed = 0;
      this.currentTarget=0;
      this.mesh.position.copy(INITIAL_POSITION);
    }
  };

  this.collide = function(other) {
    if (other instanceof Carr) {
      console.log("Hit car!");
      LIVES--;
      L_DSP.updateLives(LIVES);
      this.midLap = false;

      if (LIVES <= 0) {
        PAUSED = true;
        GAME_OVER = true;
        GO_TXT.mesh.visible = true;
      }
      this.speed = 0;
      this.currentTarget=0;
      this.mesh.position.copy(INITIAL_POSITION);
    }

    
    if (other instanceof Wood || other instanceof Turtle) {
        this.mesh.position.x+=other.mesh.position.x-this.mesh.position.x;
        protec=true;
    }
  };
  window.addEventListener("keydown", this.keypress);
  window.addEventListener("keyup", this.keyup);

  window.addEventListener("keydown", function(key) {
    if (key.key == "H" || key.key == "h") {
      self.light1.visible = !self.light1.visible;
    }
  });
}
