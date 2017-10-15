AFRAME.registerComponent('text-box', {
  init: function() {
    console.log('in init text-box');
  },

  toggle: function() {
    const el = this.el;
    console.log('hide');
    el.setAttribute('visible', !el.getAttribute('visible'));
  }
});