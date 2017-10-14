var game = (function() {
  AFRAME.registerComponent('ball', {
    init: function() {
      console.log(this);
      this.el.addEventListener('click', function(e) {
        console.log(e);
      });
    },

    tick: function(time, timeDelta) {
      var cameraPos = this.el.sceneEl.camera.el.getAttribute('position');
      this.el.setAttribute('position', {x: cameraPos.x + 2, y: cameraPos.y - 1, z: cameraPos.z - 2});
      // if(this.el.hasOwnProperty('body')) {
      //
      // }
    }
  });

  document.addEventListener("DOMContentLoaded", function() {
    var camera = document.querySelector('[camera]');
    var scene = document.querySelector('a-scene');
    var sphere = scene.querySelector('a-sphere');
  });
})()
