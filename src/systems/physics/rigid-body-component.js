"use strict";

import Component from '../../core/component';

class RigidBodyComponent extends Component {
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
    this.linearVelocity = {x: 0, y: 0};

    /**
     * Damping on the object.
     * @type {{x: number, y: number}}
     */
    this.linearDamping = {x: 0, y: 0};

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
      if (params.linearVelocity) {
        this.linearVelocity.x = Component.copyField(params.linearVelocity.x, this.linearVelocity.x);
        this.linearVelocity.y = Component.copyField(params.linearVelocity.y, this.linearVelocity.y);
      }
      if (params.linearDamping) {
        this.linearDamping.x = Component.copyField(params.linearDamping.x, this.linearDamping.x);
        this.linearDamping.y = Component.copyField(params.linearDamping.y, this.linearDamping.y);
      }
      this.angularSpeed = Component.copyField(params.angularSpeed, this.angularSpeed);
    }
  }
}
RigidBodyComponent.type = 'RigidBodyComponent';

export default RigidBodyComponent;
