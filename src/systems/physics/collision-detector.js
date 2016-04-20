"use strict";

import Vector2, { ZeroVector } from '../../math/vector2';

class CollisionDetector {
  checkCollision(body1, body2) {
    let pos1 = new Vector2(body1.spatial.position.x, body1.spatial.position.y);
    let pos2 = new Vector2(body2.spatial.position.x, body2.spatial.position.y);
    let r1 = body1.geometry.radius;
    let r2 = body2.geometry.radius;

    let vector = new Vector2(pos2.x, pos2.y).subtract(pos1);
    let overlap = vector.normal() - (r1 + r2);

    // Overlap, choose direction
    if (vector.equals(ZeroVector)) {
      vector.set(1, 0);
    }

    let collision = null;
    if (overlap <= 0) {
      collision = {
        body1: body1,
        body2: body2,
        normalized: vector.normalize().toJSON(),
        transit: vector.clone().multiply(-overlap).toJSON(),
        position: vector.multiply(-r1).toJSON()
      };
    }
    return collision;
  }

  checkCollisions(bodies) {
    let hash = {};
    let collisions = [];
    for (let i = 0; i < bodies.length; ++i) {
      let body1 = bodies[i];
      for (let j = 0; j < bodies.length; ++j) {
        if (i === j) continue;
        let body2 = bodies[j];
        if (hash[body1.id + '-' + body2.id]) continue;

        let result = this.checkCollision(bodies[i], bodies[j]);
        hash[body1.id + '-' + body2.id] = true;
        hash[body2.id + '-' + body1.id] = true;
        if (result) {
          collisions.push(result);
        }
      }
    }
    return collisions;
  }
}

export default CollisionDetector;
