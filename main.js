"use strict";

import Core from './src/core/core';

var Game = function () {
  this._core = new Core(window);

  this._core.addUpdateCallback((dt) => {
    console.log(dt);
  });
};

Game.prototype.start = function () {
  this._core.start();
};

var game = new Game();
game.start();
