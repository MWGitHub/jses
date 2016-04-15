"use strict";

import System from '../../core/system';
import RigidBodyComponent from './rigid-body-component';
import SpatialComponent from '../spatial-component';

class DynamicsSystem extends System {
  constructor(entitySystem) {
    super();

    this._entitySystem = entitySystem;
  }

  update(dt) {
    let set = this._entitySystem.getEntities(RigidBodyComponent.type);

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

export default DynamicsSystem;
