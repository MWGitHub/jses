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
     * Speed to move during an update.
     * @type {{x: number, y: number}}
     */
    this.speed = {x: 0, y: 0};

    /**
     * Amount to damp the speed by per update.
     * @type {number}
     */
    this.damping = 1.0;

    /**
     * Absolute maximum movement speed.
     * A value of 0 signifies that it has no max.
     * @type {{x: number, y: number}}
     */
    this.maxSpeed = {x: 0, y: 0};

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
      if (params.speed) {
        this.speed.x = Component.copyField(params.speed.x, this.speed.x);
        this.speed.y = Component.copyField(params.speed.y, this.speed.y);
      }
      this.damping = Component.copyField(params.damping, this.damping);
      if (params.maxSpeed) {
          this.maxSpeed.x = Component.copyField(params.maxSpeed.x, this.maxSpeed.x);
          this.maxSpeed.y = Component.copyField(params.maxSpeed.y, this.maxSpeed.y);
      }
      this.angularSpeed = Component.copyField(params.angularSpeed, this.angularSpeed);
  }
  }
}
MovementComponent.type = 'MovementComponent';

export default MovementComponent;
