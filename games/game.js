var game = (function() {

  var hasShot = false;
  var isShooting = false;
  var currentPosition = new CANNON.Vec3(0, 0, 0);
  var lastPosition = new CANNON.Vec3(0, 0, 0);
  var isOverlapping = false;
  var shotTimer = null;
  var basket = null;
  var score = 0;
  var scoreText = null;

  var SHOT_VELOCITY_X = 0;
  var SHOT_VELOCITY_Y = 40;
  var SHOT_VELOCITY_Z = -20;

  function shootBall(ballElem) {
    ballElem.body.applyLocalImpulse(new CANNON.Vec3(SHOT_VELOCITY_X, SHOT_VELOCITY_Y, SHOT_VELOCITY_Z), new CANNON.Vec3(0, 0, 0));
  }

  function checkOverlap(overlapper) {
    if(
      lastPosition.x <= overlapper.body.position.x + 0.2 && lastPosition.x >= overlapper.body.position.x - 0.2 &&
      lastPosition.y <= overlapper.body.position.y + 0.2 && lastPosition.y >= overlapper.body.position.y - 0.2 &&
      lastPosition.z <= overlapper.body.position.z + 0.2 && lastPosition.z >= overlapper.body.position.z - 0.2
    ) {
      return true;
    } else {
      return false;
    }
  }

  function scorePoint() {
    isOverlapping = true;
    score += 3;
    scoreText.setAttribute('value', score.toString());
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
          shootBall(this.el);
          isShooting = true;
        }

        if(hasShot && isShooting) {
          if(shotTimer < Date.now()) {
            hasShot = false;
            isShooting = false;
            isOverlapping = false;
            shotTimer = Date.now() + 5000;
          }
        }

        lastPosition.copy(this.el.body.position);

        if(checkOverlap(basket)) {
          if(!isOverlapping) {
            scorePoint();
          }
        }
      }
    }
  });

  document.addEventListener("DOMContentLoaded", function() {
    var camera = document.querySelector('[camera]');
    var scene = document.querySelector('a-scene');
    var ball = document.querySelector('[ball]');
    basket = document.querySelector('#basket');
    scoreText = document.querySelector('#scoreText');

    scene.addEventListener('click', function(e) {
      if(!hasShot) {
        hasShot = true;
        shotTimer = Date.now() + 5000;
      }
    });
  });
})()
