AFRAME.registerComponent('tv', {
  schema: {
    src: {type: 'string', default: ''},
    height: {type: 'number', default: 13.5},
    width: {type: 'number', default: 24},
  },
  init() {
    const { data: { src, height, width } } = this;
    const video = document.querySelector(src)
    this.videoEl = video
    this.el.setAttribute('material', `shader: flat; src: ${src}`)
    this.el.setAttribute('geometry', `primitive: plane; width: ${width}; height: ${height}`)
    this.el.addEventListener('click', () => {
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    })
  }
});
