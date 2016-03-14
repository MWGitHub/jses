"use strict";

import State from '../src/core/state';
import { Scene } from '../src/pixi/viewport';
import EntitySystem from '../src/entitysystem/entity-system';

function GameState(viewport, input) {
  Object.call(State, this);

  this._viewport = viewport;
  this._input = input;

  this._scene = new Scene();
  this._viewport.addScene(this._scene);

  // Create and add the layers
  this._layers = {
    main: new PIXI.Container()
  };
  this._scene.display.addChild(this._layers.main);

  // Create the entity system and systems
  this._entitySystem = new EntitySystem();
  this.systems = [];
}
GameState.prototype = Object.create(State.prototype);

GameState.prototype.onEnter = function (params) {
};

GameState.prototype.update = function (dt) {
};

GameState.prototype.onLeave = function (params) {
};

export default GameState;
