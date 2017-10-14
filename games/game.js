var game = (function() {
  AFRAME.registerComponent('ball', {
    init: function() {
      this.el.addEventListener('click', function(e) {
        console.log(e);
      });
    },

    tick: function(time, timeDelta) {
      var cameraPos = this.el.sceneEl.camera.el.getAttribute('position');
      if(this.el.hasOwnProperty('body')) {
        this.el.body.velocity.set(0, 0, 0);
        this.el.body.angularVelocity.set(0, 0, 0);
        this.el.body.quaternion.set(0, 0, 0, 1);
        this.el.body.position.set(cameraPos.x + 2, cameraPos.y - 1, cameraPos.z - 2);
      }
    }
  });

  document.addEventListener("DOMContentLoaded", function() {
    var camera = document.querySelector('[camera]');
    var scene = document.querySelector('a-scene');
    var sphere = scene.querySelector('a-sphere');
  });
})()
