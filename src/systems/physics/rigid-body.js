"use strict"

let id = 0;
class RigidBody {
  constructor(options = {}) {
    this.id = id;
    this.entity = options.entity,
    this.spatial = options.spatial || {};
    this.body = options.body || {};
    this.geometry = options.geometry;

    id++;
  }
}

export default RigidBody;
