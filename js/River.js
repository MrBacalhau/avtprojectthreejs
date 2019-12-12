function River(){
  var position = new THREE.Vector3( 0, 40, 0.1);

  // Table Geometry
  var geometry = new THREE.PlaneGeometry(200, 50)

  geometry.verticesNeedUpdate = true;
  geometry.elementsNeedUpdate = true;
  geometry.uvsNeedUpdate = true;
  geometry.computeFaceNormals();

  this.texture = new THREE.TextureLoader().load('tex/river.jpg');
  /* this.bumpTex = new THREE.TextureLoader().load('tex/bump.jpg') */


  var material = new THREE.MeshBasicMaterial( { map: this.texture } );
  var phong = new THREE.MeshPhongMaterial({map: this.texture, emissive: 0x0, specular: 0x878787, shininess: 3, /* bumpMap: this.bumpTex */});
  var lambert = new THREE.MeshLambertMaterial({map: this.texture, emissive: 0x0 });
  var mesh = new THREE.Mesh( geometry, material );

  //SolidObject.call(this, position, mesh, new AxisAlignedBox(new THREE.Vector3(-200,-22.5,0),new THREE.Vector3(200,22.5,2)), material, lambert, phong);
  GameObject.call(this, position, mesh, material, lambert, phong);
  mesh.receiveReflections = true;
  mesh.receiveShadows = false;
}
