"use strict";

import Core from './src/core/core';
import PIXILayer from './src/pixi/pixi-layer';

var Game = function () {
  var core = new Core(window);
  var pixiLayer = new PIXILayer(window.document.getElementById('content'));
  core.addRenderLayer(pixiLayer);
  


  core.addUpdateCallback((dt) => {
    console.log(dt);
  });

  this.start = function () {
    core.start();
  };

  this.stop = function() {
    core.stop();
  };
};

var game = new Game();
game.start();
