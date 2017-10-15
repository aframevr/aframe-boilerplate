var game = (function() {

  var hasShot = false;
  var isShooting = false;
  var currentPosition = new CANNON.Vec3(0, 0, 0);
  var lastPosition = new CANNON.Vec3(0, 0, 0);
  var shotTimer = null;

  var SHOT_VELOCITY_X = 0;
  var SHOT_VELOCITY_Y = 40;
  var SHOT_VELOCITY_Z = -22;

  function shootBall(timeDelta, ballElem) {
    ballElem.body.applyLocalImpulse(new CANNON.Vec3(SHOT_VELOCITY_X, SHOT_VELOCITY_Y, SHOT_VELOCITY_Z), new CANNON.Vec3(0, 0, 0));
  }

  AFRAME.registerComponent('ball', {
    schema: {
      radius: {type: 'number', default: 1},
      color: {type: 'color', default: '#F00'}
    },

    init() {
      this.geometry = new THREE.SphereBufferGeometry(this.data.radius);
      this.material = new THREE.MeshStandardMaterial({color: this.data.color});
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.el.setObject3D('mesh', this.mesh);
    },

    tick: function(time, timeDelta) {
      var cameraPos = this.el.sceneEl.camera.el.getAttribute('position');

      if(this.el.hasOwnProperty('body')) {
        if(!hasShot && !isShooting) {
          this.el.body.velocity.set(0, 0, 0);
          this.el.body.angularVelocity.set(0, 0, 0);
          this.el.body.quaternion.set(0, 0, 0, 1);
          this.el.body.position.set(cameraPos.x, cameraPos.y - 0.25, cameraPos.z - 0.5);
        }

        if(hasShot && !isShooting) {
          currentPosition.copy(this.el.body.position);
          shootBall(timeDelta / 1000.0, this.el);
          isShooting = true;
        }

        if(hasShot && isShooting) {
          if(shotTimer < Date.now()) {
            hasShot = false;
            isShooting = false;
            shotTimer = Date.now() + 5000;
          }
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
      if(!hasShot) {
        hasShot = true;
        shotTimer = Date.now() + 5000;
      }
    });
  });
})()
