"use strict";

import System from '../../src/core/system';
import SpatialComponent from '../../src/systems/spatial-component';
import GameObjectComponent from '../components/game-object-component';
import CollisionShapesComponent from '../../src/systems/physics/collision-shapes-component';
import RigidBodyComponent from '../../src/systems/physics/rigid-body-component';

class GameObjectSystem extends System {
  constructor(entitySystem, bounds) {
    super();
    this._entitySystem = entitySystem;
    this._bounds = bounds;
  }

  update(dt) {
    let set = this._entitySystem.getEntities(GameObjectComponent.type);

    set.each(entity => {
      let spatial = entity[SpatialComponent.type];
      if (!spatial) return;

      let shapes = entity[CollisionShapesComponent.type];
      let radius = 0;
      if (shapes && shapes.shapes.length > 0) {
        if (shapes.shapes[0].type === 'circle') {
          radius = shapes.shapes[0].radius;
        }
      }

      let body = entity[RigidBodyComponent.type];

      let component = entity[GameObjectComponent.type];


      if (component.isBound) {
        if (spatial.position.x - radius < this._bounds.left) {
          spatial.position.x = this._bounds.left + radius;
          if (body) body.linearVelocity.x *= -1;
        }
        if (spatial.position.x + radius > this._bounds.right) {
          spatial.position.x = this._bounds.right - radius;
          if (body) body.linearVelocity.x *= -1;
        }
        if (spatial.position.y - radius < this._bounds.top) {
          spatial.position.y = this._bounds.top + radius;
          if (body) body.linearVelocity.y *= -1;
        }
        if (spatial.position.y + radius > this._bounds.bottom) {
          spatial.position.y = this._bounds.bottom - radius;
          if (body) body.linearVelocity.y *= -1;
        }
      }
    });
  }
}

export default GameObjectSystem;
