"use strict";

import Core from './src/core/core';
import PIXILayer from './src/pixi/pixi-layer';
import { Viewport } from './src/pixi/viewport';
import Camera from './src/pixi/camera';
import StateSwitcher from './src/core/state-switcher';

var Game = function () {
  var width = 683, height = 384;

  var core = new Core(window);

  // Create the renderer.
  var pixiLayer = new PIXILayer(window.document.getElementById('content'));
  core.addRenderLayer(pixiLayer);

  // Create the main viewport and camera.
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

  core.addPreRenderCallback((dt) => {
    viewport.update();
  });

  this.start = function () {
    core.start();
  };

  this.stop = function() {
    core.stop();
  };
};

module.exports = Game;
