"use strict";

import CollisionDetector from './collision-detector';
import CollisionResolver from './collision-resolver';

class World {
  constructor(options = {}) {
    /**
     * Bodies in the world.
     * @type {Array.<RigidBody>}
     */
    this._bodies = [];

    this._collisionDetector = new CollisionDetector();
    this._collisionResolver = new CollisionResolver();

    this._steps = options.steps || 1;
  }

  /**
   * Add a body.
   * @param {RigidBody} body the body to add.
   */
  add(body) {
    if (this._bodies.indexOf(body) !== -1) return;

    this._bodies.push(body);
  }

  remove(body) {
    let index = this._bodies.indexOf(body);
    if (index >= 0) {
      this._bodies.splice(index, 1);
    }
  }

  step(dt) {
    for (let step = 0; step < this._steps; ++step) {
      for (let i = 0; i < this._bodies.length; ++i) {
        let body = this._bodies[i];
        let rigid = body.body;
        let spatial = body.spatial;

        // Update velocity from acceleration
        let collisions = this._collisionDetector.checkCollisions(this._bodies);
        this._collisionResolver.resolve(collisions);

        spatial.position.x += rigid.linearVelocity.x * dt / 1000 / this._steps;
        spatial.position.y += rigid.linearVelocity.y * dt / 1000 / this._steps;

        rigid.linearVelocity.x *= 1 - rigid.linearDamping.x;
        rigid.linearVelocity.y *= 1 - rigid.linearDamping.y;
      }
    }
  }
}

export default World;
