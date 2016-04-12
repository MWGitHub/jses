"use strict";

import Core from './src/core/core';
import PIXILayer from './src/pixi/pixi-layer';
import { Viewport } from './src/pixi/viewport';
import Camera from './src/pixi/camera';
import StateSwitcher from './src/core/state-switcher';
import Input from './src/core/input';
import GameState from './lib/game-state';

var Game = function () {
  var width = 1024, height = 576;
  var gameElement = document.getElementById('content');

  var core = new Core(window);

  // Create the renderer
  var pixiLayer = new PIXILayer(gameElement);
  core.addRenderLayer(pixiLayer);

  // Create the input
  var input = new Input(window, gameElement);

  // Create the main viewport and camera
  var camera = new Camera();
  var viewport = new Viewport(camera, width, height);
  viewport.addTo(pixiLayer.stage);
  viewport.isFloored = false;
  core.resize(width, height);

  // Create the states
  var switcher = new StateSwitcher();
  core.addUpdateCallback(switcher.update.bind(switcher));
  core.addPreRenderCallback(switcher.preRender.bind(switcher));
  core.addPostRenderCallback(switcher.postRender.bind(switcher));

  var initialState = new GameState(viewport, input);
  switcher.addState(initialState);
  switcher.enterState(initialState);

  core.addPreRenderCallback((dt) => {
    viewport.update();
  });

  core.addBeginCallback((dt) => {
    input.update(dt);
  });

  core.addEndCallback((dt) => {
    input.flush();
  });

  this.start = function () {
    core.start();
  };

  this.stop = function() {
    core.stop();
  };
};

module.exports = Game;
