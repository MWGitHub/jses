"use strict";

import System from '../../core/system';
import MovementComponent from './movement-component';
import SpatialComponent from '../spatial-component';

class MovementSystem extends System {
  constructor(entitySystem) {
    super();

    this._entitySystem = entitySystem;
  }

  update(dt) {
    let set = this._entitySystem.getEntities(MovementComponent.type);

    set.each(entity => {
      let spatial = entity[SpatialComponent.type];
      if (!spatial) return;
      let movement = entity[MovementComponent.type];

      spatial.position.x += movement.speed.x * dt / 1000;
      spatial.position.y += movement.speed.y * dt / 1000;

      movement.speed.x *= movement.damping;
      movement.speed.y *= movement.damping;
    });
  }
}

export default MovementSystem;
