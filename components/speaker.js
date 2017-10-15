AFRAME.registerComponent('speaker', {
  init: function () {
    var el = this.el;
    var loader = LOADERS.collada;
    loader.options.convertUpAxis = true;
    loader.load('assets/speaker/model.dae', function (collada) {
      el.setObject3D('mesh', collada.scene);
    });
  }
});
