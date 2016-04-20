"use strict";

import Component from '../../core/component';

class MovementComponent extends Component {
  constructor(params) {
    super();

    /**
     * Amount to move when the movement system is updated.
     * This value is usually calculated instead of set.
     * @type {{x: number, y: number}}
     */
    this.move = {x: 0, y: 0};

    /**
     * Velocity of the object.
     * @type {{x: number, y: number}}
     */
    this.velocity = {x: 0, y: 0};

    /**
     * Amount to damp the velocity by per update.
     * @type {number}
     */
    this.damping = 1.0;

    /**
     * Absolute maximum movement velocity.
     * A value of 0 signifies that it has no max.
     * @type {{x: number, y: number}}
     */
    this.maxVelocity = {x: 0, y: 0};

    /**
     * Amount to rotate by per second in radians.
     * @type {number}
     */
    this.angularSpeed = 0;

    this.setParams(params);
  }

  setParams(params) {
    if (params) {
      if (params.move) {
        this.move.x = Component.copyField(params.move.x, this.move.x);
        this.move.y = Component.copyField(params.move.y, this.move.y);
      }
      if (params.velocity) {
        this.velocity.x = Component.copyField(params.velocity.x, this.velocity.x);
        this.velocity.y = Component.copyField(params.velocity.y, this.velocity.y);
      }
      this.damping = Component.copyField(params.damping, this.damping);
      if (params.maxVelocity) {
          this.maxVelocity.x = Component.copyField(params.maxVelocity.x, this.maxVelocity.x);
          this.maxVelocity.y = Component.copyField(params.maxVelocity.y, this.maxVelocity.y);
      }
      this.angularSpeed = Component.copyField(params.angularSpeed, this.angularSpeed);
  }
  }
}
MovementComponent.type = 'MovementComponent';

export default MovementComponent;
