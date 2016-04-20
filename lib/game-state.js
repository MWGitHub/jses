"use strict";

import State from '../src/core/state';
import { Scene } from '../src/pixi/viewport';
import EntitySystem from '../src/entitysystem/entity-system';
import PIXISystem from '../src/systems/rendering/pixi-system';
import ControlSystem from './systems/control-system';
import PhysicsSystem from '../src/systems/physics/physics-system';
import GameObjectSystem from './systems/game-object-system';

import SpatialComponent from '../src/systems/spatial-component';
import ShapeComponent from '../src/systems/rendering/shape-component';
import ControlComponent from './components/control-component';
import GameObjectComponent from './components/game-object-component';
import RigidBodyComponent from '../src/systems/physics/rigid-body-component';
import CollisionShapesComponent from '../src/systems/physics/collision-shapes-component';

import ObjectCreator from '../src/core/object-creator';

import BallBlueprint from '../assets/json/ball.json';

function GameState(viewport, input) {
  Object.call(State, this);

  this._viewport = viewport;
  this._input = input;

  this._scene = new Scene();
  this._viewport.addScene(this._scene);
  this._viewport.camera.position.x = this._viewport.width / 2;
  this._viewport.camera.position.y = this._viewport.height / 2;

  // Create and add the layers
  this._layers = {
    main: new PIXI.Container()
  };
  this._scene.display.addChild(this._layers.main);

  // Create the entity system and systems
  this._entitySystem = new EntitySystem();
  this._systems = [
    new ControlSystem(this._entitySystem, input),
    new PhysicsSystem(this._entitySystem),
    new GameObjectSystem(this._entitySystem,
      {
        top: 0,
        right: this._viewport.width,
        bottom: this._viewport.height,
        left: 0
      }
    ),
		new PIXISystem(this._entitySystem, this._layers)
	];

  /**
   * Object creator for creating game objects.
   * @type {ObjectCreator}
   */
  this._objectCreator = new ObjectCreator(this._entitySystem);
  this._objectCreator.addComponent(SpatialComponent.type, SpatialComponent);
  this._objectCreator.addComponent(ShapeComponent.type, ShapeComponent);
  this._objectCreator.addComponent(ControlComponent.type, ControlComponent);
  this._objectCreator.addComponent(RigidBodyComponent.type, RigidBodyComponent);
  this._objectCreator.addComponent(GameObjectComponent.type, GameObjectComponent);
  this._objectCreator.addComponent(CollisionShapesComponent.type, CollisionShapesComponent);
  this._objectCreator.storeBlueprint('ball', BallBlueprint);
}
GameState.prototype = Object.create(State.prototype);

GameState.prototype.onEnter = function (params) {
	let entity = this._objectCreator.createFromBlueprint('ball');
  let spatial = entity[SpatialComponent.type];
  spatial.position.x = this._viewport.width / 2 - 5;
  spatial.position.y = this._viewport.height / 2 + 100;
  let body = entity[RigidBodyComponent.type];
  body.linearVelocity.y = -200;

	entity = this._objectCreator.createFromBlueprint('ball');
  spatial = entity[SpatialComponent.type];
  spatial.position.x = this._viewport.width / 2;
  spatial.position.y = this._viewport.height / 2 - 100;
  body = entity[RigidBodyComponent.type];
  body.linearVelocity.y = 200;

  let vel = 1000;
  for (let i = 0; i < 20; i++) {
    entity = this._objectCreator.createFromBlueprint('ball');
    spatial = entity[SpatialComponent.type];
    spatial.position.x = Math.random() * this._viewport.width;
    spatial.position.y = Math.random() * this._viewport.height;
    body = entity[RigidBodyComponent.type];
    body.linearVelocity.y = Math.random() * vel - vel / 2;
    body.linearVelocity.x = Math.random() * vel - vel / 2;
  }
};

GameState.prototype.update = function (dt) {
	for (let i = 0; i < this._systems.length; i++) {
		this._systems[i].update(dt);
	}

  this._entitySystem.flushChanges();
};

GameState.prototype.onLeave = function (params) {
	for (let i = 0; i < this._systems.length; i++) {
		this._systems[i].destroy();
	}
};

export default GameState;
