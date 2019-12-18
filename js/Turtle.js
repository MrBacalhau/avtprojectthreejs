var turtle_material = new THREE.MeshBasicMaterial( { color: 0x33ee33 } );
var turtle_phong = new THREE.MeshPhongMaterial({color: 0x33ee33, emissive: 0x0, specular: 0x878787, shininess: 50});
var turtle_lambert = new THREE.MeshLambertMaterial({color: 0x33ee33, emissive: 0x0});

function Turtle(position){
  var geometrybody = new THREE.CylinderGeometry(6,8,2,10);
  var materialbody = turtle_material;
  var meshA = new THREE.Mesh( geometrybody, materialbody );
  var geometryhead = new THREE.SphereGeometry(4,5,5);
  var meshB = new THREE.Mesh(geometryhead, materialbody);
  meshB.position.set(6,2,0);
  var turtle = new THREE.Group();
  turtle.add(meshA);
  turtle.add(meshB);
  turtle.rotation.x = Math.PI / 2;
  MovableObject.call(this, position, turtle, turtle_material, turtle_lambert, turtle_phong);
  SolidObject.call(this, position, turtle, new SphereBox(3), turtle_material, turtle_lambert, turtle_phong);

  this.speed = 5;
  this.direction = new THREE.Vector3(1,0,0);

  this.collide = function(other) {
    if (other instanceof Frog) return; // Disable collision with oranges for performance.
    var disp = other.mesh.position.clone().sub(this.mesh.position).normalize().divideScalar(40);
    disp.z = 0;
    if (disp.x == 0 && disp.y == 0) disp = new THREE.Vector3(1,0,0);
    while (this.hasCollision(other)) {
      this.mesh.position.sub(disp);
    }
    this.speed = Math.max(this.speed / 2, Math.abs(other.speed / 2));
  };

  this.update = function(delta) {
    if (this.isOutside()) {
      this.mesh.position.x=-100;
    }

    if (this.mesh.position.z < -50) {
      this.remove();
    }
    this.move(delta);
  }

  UPDATE.push(this);
}
