"use strict";

import System from '../../core/system';
import CollisionShapesComponent from './collision-shapes-component';
import RigidBodyComponent from './rigid-body-component';
import SpatialComponent from '../spatial-component';
import World from './world';
import RigidBody from './rigid-body';

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
      bodyComponent: bodyComponent
    });
    this._addShape(entity, rigidBody);
    this._entityBodies[entity.id] = this._entityBodies[entity.id] || [];
    this._entityBodies[entity.id].push(rigidBody);
    this._world.add(bodyComponent);
  }

  _addShape(entity, body) {
    let shapesComponent = entity[CollisionShapesComponent.type];
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

  update(dt) {
    let set = this._entitySystem.getEntities(RigidBodyComponent.type);
    set.eachAdded(this._addBody.bind(this));

    this._world.step(dt);

    set.each(entity => {
      let spatial = entity[SpatialComponent.type];
      if (!spatial) return;
      let rigidBody = entity[RigidBodyComponent.type];

      spatial.position.x += rigidBody.linearVelocity.x * dt / 1000;
      spatial.position.y += rigidBody.linearVelocity.y * dt / 1000;

      rigidBody.linearVelocity.x *= 1 - rigidBody.linearDamping.x;
      rigidBody.linearVelocity.y *= 1 - rigidBody.linearDamping.y;
    });
  }
}

export default PhysicsSystem;
