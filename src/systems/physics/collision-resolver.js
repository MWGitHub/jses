"use strict";

import Vector2 from '../../math/vector2';

class CollisionResolver {
  constructor() {

  }

  resolveSingle(collision) {
    let normal = new Vector2(collision.normalized.x, collision.normalized.y);
    let collide = new Vector2(collision.position.x, collision.position.y);
    let transit = new Vector2(collision.transit.x, collision.transit.y);

    let body1 = collision.body1;
    let body2 = collision.body2;
    let spatial1 = body1.spatial;
    let spatial2 = body2.spatial;
    let perpendicular = normal.clone().perpendicular();
    let collide1 = collide.clone();
    let collide2 = collide.clone().add(spatial1.position.x, spatial1.position.y)
      .subtract(spatial2.position.x, spatial2.position.y);

    let velocityTo2 = new Vector2(body2.body.linearVelocity.x, body2.body.linearVelocity.y)
      .add(collide2.clone().perpendicular())
      .subtract(new Vector2(body1.body.linearVelocity.x, body1.body.linearVelocity.y))
      .subtract(collide1.clone().perpendicular());

    let project1 = collide1.project(normal);
    let perp1 = collide1.project(perpendicular);
    let project2 = collide2.project(normal);
    let perp2 = collide2.project(perpendicular);
    let proj = velocityTo2.project(normal);
    let perp = velocityTo2.project(perpendicular);

    transit.multiply(0.5);

    // Moving away, no change needed
    if (proj >= 0) {
      return;
    }

    let impulse = -proj / (1 + perp1 * perp1 + perp2 * perp2);

    impulse = normal.multiply(impulse);

    body2.body.linearVelocity.x += impulse.x;
    body2.body.linearVelocity.y += impulse.y;
    body1.body.linearVelocity.x -= impulse.x;
    body1.body.linearVelocity.y -= impulse.y;
  }

  resolve(collisions) {
    for (let i = 0; i < collisions.length; ++i) {
      let collision = collisions[i];
      this.resolveSingle(collision);
    }
  }
}

export default CollisionResolver;
