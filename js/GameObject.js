IN_WIREFRAME = false;
ILUMINATE = true;
PHONG_SWITCH = true;
window.addEventListener("keydown", function(key) {
    if (key.key == "A" || key.key == "a") IN_WIREFRAME = !IN_WIREFRAME;
    if (key.key == "L" || key.key == "l") ILUMINATE = !ILUMINATE;
    if (key.key == "G" || key.key == "g") PHONG_SWITCH = !PHONG_SWITCH;
});

function GameObject(position, mesh, basicMat, lambertMat, phongMat) {
    var self = this;
    
    this.mesh = mesh;
    this.mesh.position.set(position.x, position.y, position.z);
    this.wireframe = false;
    SCENE.add( this.mesh );
    this.mesh.castShadow = true;
    this.basicMat = basicMat;
    this.phongMat = phongMat;
    this.lambertMat = lambertMat;

    this.lightMat = PHONG_SWITCH ? this.phongMat : this.lambertMat;
    this.mesh.material = ILUMINATE ? this.lightMat : this.basicMat;

    this.isGameObject = true;

    this.target = this.mesh;
    this.remove = function() {
        SCENE.remove(this.mesh);
        if (UPDATE.indexOf(this) >= 0) UPDATE.splice(UPDATE.indexOf(this), 1);
        if (SOLIDS.indexOf(this) >= 0) SOLIDS.splice(SOLIDS.indexOf(this), 1);
    }
    
}
