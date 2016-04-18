"use strict"

class RigidBody {
  constructor(options = {}) {
    this.bodyComponent = options.bodyComponent || {};
    this.geometry = options.geometry;
  }
}

export default RigidBody;
