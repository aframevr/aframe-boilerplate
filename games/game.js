var game = (function() {

  var hasShot = false;
  var currentPosition = new CANNON.Vec3(0, 0, 0);
  var lastPosition = new CANNON.Vec3(0, 0, 0);

  function shootBall(timeDelta, ballElem) {
    // hasShot = false;
    // var velocity = currentPosition.vsub(lastPosition).scale(1 / timeDelta);
    ballElem.body.applyLocalImpulse(new CANNON.Vec3(0, 5, -10), new CANNON.Vec3(0, 0, 0));
  }

  AFRAME.registerComponent('ball', {
    tick: function(time, timeDelta) {
      var cameraPos = this.el.sceneEl.camera.el.getAttribute('position');

      if(this.el.hasOwnProperty('body')) {
        if(!hasShot) {
          this.el.body.velocity.set(0, 0, 0);
          this.el.body.angularVelocity.set(0, 0, 0);
          this.el.body.quaternion.set(0, 0, 0, 1);
          this.el.body.position.set(cameraPos.x + 2, cameraPos.y - 1, cameraPos.z - 2);
        }

        if(hasShot) {
          currentPosition.copy(this.el.body.position);
          shootBall(timeDelta / 1000.0, this.el);
        }

        lastPosition.copy(this.el.body.position);
      }
    }
  });

  document.addEventListener("DOMContentLoaded", function() {
    var camera = document.querySelector('[camera]');
    var scene = document.querySelector('a-scene');
    var ball = document.querySelector('[ball]');

    scene.addEventListener('click', function(e) {
      hasShot = true;
    });
  });
})()
