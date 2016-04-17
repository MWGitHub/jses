"use strict";

class World {
  constructor(options) {
    this._bodies = [];
  }

  add(body) {
    this._bodies.push(body);
  }
}

export default World;
