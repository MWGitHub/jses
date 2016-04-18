"use strict";

class World {
  constructor(options) {
    this._bodies = [];
  }

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
    
  }
}

export default World;
