"use strict";

import System from '../../core/system';
import CollisionShapesComponent from './collision-shapes-component';
import RigidBodyComponent from './rigid-body-component';
import SpatialComponent from '../spatial-component';
import World from './world';
import RigidBody from './rigid-body';
import Circle from './geometries/circle';

class PhysicsSystem extends System {
  /**
   * Creates the physics system.
   * @param  {EntitySystem} entitySystem the entity system to use.
   * @param  {World=} world the world to use, if none given uses a default.
   */
  constructor(entitySystem, world) {
    super();

    this._entitySystem = entitySystem;

    this._entityBodies = {};

    this._world = world || new World();
  }

  _addBody(entity) {
    let bodyComponent = entity[RigidBodyComponent.type];
    if (!bodyComponent) return;
    let rigidBody = new RigidBody({
      entity: entity,
      spatial: entity[SpatialComponent.type],
      body: bodyComponent
    });
    this._addShape(entity, rigidBody);
    this._entityBodies[entity.id] = this._entityBodies[entity.id] || [];
    this._entityBodies[entity.id].push(rigidBody);
    this._world.add(rigidBody);
  }

  _addShape(entity, body) {
    let shapesComponent = entity[CollisionShapesComponent.type];
    // Only support circles for now
    let shapes = shapesComponent.shapes;
    for (let i = 0; i < shapes.length; ++i) {
      let shapeData = shapes[i];
      let shape = null;
      switch (shapeData.type) {
        case 'circle':
          shape = new Circle({
            radius: shapeData.radius
          });
          break;
      }
      body.geometry = shape;
    }
  }

  _remove(entity) {
    let bodies = this._entityBodies[entity.id];
    if (!bodies) return;

    for (let i = 0; i < bodies.length; ++i) {
      this._world.remove(bodies[i]);
    }

    delete this._entityBodies[entity.id];
  }

  update(dt) {
    let set = this._entitySystem.getEntities(RigidBodyComponent.type);
    set.eachAdded(this._addBody.bind(this));
    set.eachRemoved(this._remove.bind(this));

    this._world.step(dt);
  }
}

export default PhysicsSystem;
