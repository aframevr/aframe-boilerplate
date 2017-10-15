'use strict'

import MetadataAnalyzer from './MetadataAnalyzer.js'

AFRAME.registerComponent('speech-recognition', {
  schema: {
    videoEl: {type: 'string', default: '#video'},
    textEl: {type: 'string', default: '#descriptionText'},
    textBoxEl: {type: 'string', default: '#textBox'}
  },
  init: function () {
    //console.log("in annyang-speech-recognition init");
    this.analyzer = new MetadataAnalyzer()
    this.hideText()
  },

  getTextEl: function() {
    return document.querySelector(this.data.textEl);
  },
  getTextBoxEl: function() {
    return document.querySelector(this.data.textBoxEl)
  },
  getVideoEl: function() {
    return document.querySelector(this.data.videoEl)
  },
  getCurrentTime: function() {
    const videoElement = this.getVideoEl()
    if (videoElement) {
      return videoElement.currentTime
    }
  },

  hideText: function() {
    this.getTextEl().setAttribute('visible', false);
    this.getTextBoxEl().setAttribute('visible', false);
  },

  showText: function() {
    this.getTextEl().setAttribute('visible', true);
    this.getTextBoxEl().setAttribute('visible', true);
  },

  showPeople: function() {
    const time = Math.max(this.getCurrentTime() - 2, 1)
    console.log(`Show people at ${time}`)
    if (!time) { 
      return 
    }
    this.analyzer.getTag(time)
    .then(tag => {
      const characters = tag.data.CHARACTERS
      let text
      if (characters.length == 1) {
        text = `That was ${characters[0]}`
      } else if (characters.length == 2) {
        text = `They were ${characters[0]} and ${characters[1]}`
      } else {
        text = "They were " + characters.slice(0, characters.length - 2).reduce((character, str) => {
          return `${str}, ${character}`
        }) + ", " + characters[-1]
      }

      this.updateDescriptionText(text)
    })
  },

  showPerson: function(name) {
    console.log(`show name ${name}`)
  },

  showCurrentSpeaker: function() {
    console.log('show current speaker')
    this.updateDescriptionText('Some lady is talking')
  },

  showLocation: function() {
    const time = this.getCurrentTime()
    if (!time) { 
      return 
    }
    this.analyzer.getTag(time)
    .then(tag => {
      const location = tag.data.LOCATIONS[0]
      this.updateDescriptionText(`The scene is set in ${location}`)
    })
  },

  updateDescriptionText: function(newText) {
    console.log(`Setting text to ${newText}`)
    const descriptionText = document.querySelector(this.data.textEl);
    descriptionText.setAttribute('value', newText);
    this.showText()
    setTimeout(() => {
      this.hideText(this)
    }, 4000)
  },

  play: function() {
    if (!annyang) { 
      return 
    }
    let commands = {
      'who is talking': this.showCurrentSpeaker.bind(this),
      'who is speaking': this.showCurrentSpeaker.bind(this),
      'who is that': this.showPeople.bind(this),
      'who are they': this.showPeople.bind(this),
      'who is *name': this.showPerson.bind(this),
      'where is this': this.showLocation.bind(this),
      'where are they': this.showLocation.bind(this),
    }

    annyang.debug()
    annyang.addCommands(commands)
    annyang.setLanguage('en')


    // var speechCommandSystem = document.querySelector('a-scene').systems['speech-command'];
    // var commands = {};
    // var commandsMap = {};
    // for (var i = 0; i < speechCommandSystem.entities.length; i++) {
    //     var speechCommand = speechCommandSystem.entities[i];
    //     commandsMap[speechCommand.data.command] = speechCommand;
    //     // note: function empty here because real work is done in the resultMatch callback below
    //     commands[speechCommand.data.command] = function() { };
    // }
    // annyang.addCommands(commands);

    // annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
    //     //console.log("commandText: "+commandText); // sample output: 'hello (there)'
    //     var speechCommand = commandsMap[commandText];
    //     speechCommand.executeCommand();
    // });
    // Start listening. You can call this here, or attach this call to an event, button, etc.
    console.log('annyang starting')
    annyang.start();
  }
});