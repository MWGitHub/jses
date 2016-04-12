"use strict";

import State from '../src/core/state';
import { Scene } from '../src/pixi/viewport';
import EntitySystem from '../src/entitysystem/entity-system';
import PIXISystem from '../src/systems/rendering/pixi-system';
import SpatialComponent from '../src/systems/spatial-component';
import ShapeComponent from '../src/systems/rendering/shape-component';
import ObjectCreator from '../src/core/object-creator';

import ShipBlueprint from '../assets/json/ship.json';

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
  this._systems = [
		new PIXISystem(this._entitySystem, this._layers)
	];

  /**
   * Object creator for creating game objects.
   * @type {ObjectCreator}
   */
  this._objectCreator = new ObjectCreator(this._entitySystem);
  this._objectCreator.addComponent(SpatialComponent.type, SpatialComponent);
  this._objectCreator.addComponent(ShapeComponent.type, ShapeComponent);
  this._objectCreator.storeBlueprint('ship', ShipBlueprint);
}
GameState.prototype = Object.create(State.prototype);

GameState.prototype.onEnter = function (params) {
	var entity = this._objectCreator.createFromBlueprint('ship');
};

GameState.prototype.update = function (dt) {
	for (let i = 0; i < this._systems.length; i++) {
		this._systems[i].update(dt);
	}
};

GameState.prototype.onLeave = function (params) {
	for (let i = 0; i < this._systems.length; i++) {
		this._systems[i].destroy();
	}
};

export default GameState;
