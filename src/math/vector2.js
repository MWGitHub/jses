"use strict";

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Set the vector.
   * @param {Vector2|number} v the vector to set or the x coordinate.
   * @param {number=} y the y coordinate to set.
   */
  set(v, y) {
    if (v.x || v.y) {
      this.x = v.x;
      this.y = v.x;
    } else {
      this.x = v;
      this.y = y;
    }
    return this;
  }

  /**
   * Adds to the vector.
   * @param {Vector2|number} v the vector to add or the x coordinate.
   * @param {number=} y the y coordinate to add.
   */
  add(v, y) {
    if (v.x || v.y) {
      this.x += v.x;
      this.y += v.y;
    } else {
      this.x += v;
      this.y += y;
    }
    return this;
  }

  /**
   * Subtracts from the vector.
   * @param {Vector2|number} v the vector to subtract by or the x coordinate.
   * @param {number=} y the y coordinate to subtract by.
   */
  subtract(v, y) {
    if (v.x || v.y) {
      this.x -= v.x;
      this.y -= v.y;
    } else {
      this.x -= v;
      this.y -= y;
    }
    return this;
  }

  multiply(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  normal() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    let normal = this.normal();
    if (normal === 0) return this;

    this.multiply(1 / normal);
    return this;
  }

  equals(v) {
    return this.x === v.x && this.y === v.y;
  }

  perpendicular(isCounterClockwise) {
    let temp = this.x;
    if (isCounterClockwise) {
      this.x = this.y;
      this.y = -temp;
    } else {
      this.x = -this.y;
      this.y = temp;
    }
    return this;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v) {
    return -this.x * v.y + this.y * v.x;
  }

  project(v) {
    return this.dot(v) / v.normal();
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  toJSON() {
    return { x: this.x, y: this.y };
  }
}

const ZeroVector = new Vector2(0, 0);

export { ZeroVector };
export default Vector2;
