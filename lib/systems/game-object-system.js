"use strict";

import System from '../../src/core/system';
import SpatialComponent from '../../src/systems/spatial-component';
import GameObjectComponent from '../components/game-object-component';

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

      let component = entity[GameObjectComponent.type];
      if (component.isBound) {
        if (spatial.position.x < this._bounds.left) {
          spatial.position.x = this._bounds.left;
        }
        if (spatial.position.x > this._bounds.right) {
          spatial.position.x = this._bounds.right;
        }
        if (spatial.position.y < this._bounds.top) {
          spatial.position.y = this._bounds.top;
        }
        if (spatial.position.y > this._bounds.bottom) {
          spatial.position.y = this._bounds.bottom;
        }
      }
    });
  }
}

export default GameObjectSystem;
