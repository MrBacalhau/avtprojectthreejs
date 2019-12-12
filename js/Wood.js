var wood_material = new THREE.MeshBasicMaterial( { color: 0x996633 } );
var wood_phong = new THREE.MeshPhongMaterial({color: 0x996633, emissive: 0x0, specular: 0x878787, shininess: 50});
var wood_lambert = new THREE.MeshLambertMaterial({color: 0x996633, emissive: 0x0});

function Wood(position){
  var geometry = new THREE.CylinderGeometry(5,5,15,10);
  var material = wood_material;
  var mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.z = Math.PI / 2;
  MovableObject.call(this, position, mesh, wood_material, wood_lambert, wood_phong);
  SolidObject.call(this, position, mesh, new SphereBox(2), wood_material, wood_lambert, wood_phong);

  this.speed = 5;
  this.direction = new THREE.Vector3(-1,0,0);

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
      this.mesh.position.x=100;
    }

    if (this.mesh.position.z < -50) {
      this.remove();
    }
    this.move(delta);
  }

  UPDATE.push(this);
}
