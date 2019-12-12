var carr_material = new THREE.MeshBasicMaterial( { color: 0xee6666 } );
var carr_phong = new THREE.MeshPhongMaterial({color: 0xee6666, emissive: 0x0, specular: 0x878787, shininess: 50});
var carr_lambert = new THREE.MeshLambertMaterial({color: 0xee6666, emissive: 0x0});
var wheel_material = new THREE.MeshBasicMaterial( { color: 0x666666 } );

function Carr(position){
  var geometrybody = new THREE.BoxGeometry(12,5,5);
  var materialbody = carr_material;
  var geometrywheel = new THREE.TorusGeometry(1.2,1,7,15);
  var materialwheel = wheel_material;
  var meshbody = new THREE.Mesh( geometrybody, materialbody );
  var meshwheel1 = new THREE.Mesh(geometrywheel, materialwheel);
  var meshwheel2 = new THREE.Mesh(geometrywheel, materialwheel);
  var meshwheel3 = new THREE.Mesh(geometrywheel, materialwheel);
  var meshwheel4 = new THREE.Mesh(geometrywheel, materialwheel);
  meshbody.position.set(0,2,0);
  meshwheel1.position.set(3.5,1,3);
  meshwheel2.position.set(3.5,1,-3);
  meshwheel3.position.set(-3.5,1,3);
  meshwheel4.position.set(-3.5,1,-3);
  var carr = new THREE.Group();
  carr.add(meshbody);
  carr.add(meshwheel1);
  carr.add(meshwheel2);
  carr.add(meshwheel3);
  carr.add(meshwheel4);
  carr.rotation.x = Math.PI / 2;
  MovableObject.call(this, position, carr, carr_material, carr_lambert, carr_phong);
  SolidObject.call(this, position, carr, new SphereBox(2), carr_material, carr_lambert, carr_phong);

  this.speed = 5;
  this.direction = new THREE.Vector3(1,0,0);
  if (this.mesh.position.y==-40) {
    this.direction = new THREE.Vector3(-1,0,0);
  }
  

  this.collide = function(other) {
    var disp = other.mesh.position.clone().sub(this.mesh.position).normalize().divideScalar(40);
    disp.z = 0;
    if (disp.x == 0 && disp.y == 0) disp = new THREE.Vector3(1,0,0);
    while (this.hasCollision(other)) {
      this.mesh.position.sub(disp);
    }
    if (other instanceof Frog) return;
    this.speed = Math.max(this.speed / 2, Math.abs(other.speed / 2));
  };

  this.update = function(delta) {
    if (this.isOutside()) {
      if (this.direction.x == -1) {
        this.mesh.position.x= 100;
      }else{
        this.mesh.position.x=-100;
      }
      
    }

    if (this.mesh.position.z < -50) {
      this.remove();
    }
    this.move(delta);
  }

  UPDATE.push(this);
}
