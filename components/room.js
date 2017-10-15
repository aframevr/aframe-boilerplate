/* var scene = AFRAME.scenes[0];

var room;

// loading manager
var loadingManager = new THREE.LoadingManager(function() {
  scene.add(room);
});

// collada
var loader = new THREE.ColladaLoader(loadingManager);
loader.options.convertUpAxis = true;
loader.load('../assets/nbc_room/room.dae', function (collada) {
  room = collada.scene;
}); */

AFRAME.registerComponent('room', {
  init: function () {
    var el = this.el;  // Entity.

    // collada
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('../assets/nbc_room/nbc_room.dae', function (collada) {
      room = collada.scene;
      el.setObject3D('mesh', room);
    });
  }
});
