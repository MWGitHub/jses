"use strict";

import Component from '../component';

function SpatialComponent(params) {
  Component.call(this);

  /**
   * Position of the spatial.
   * @type {{x: Number, y: Number }}
   */
  this.position = {x: 0, y: 0};

  /**
   * Scale for the spatial.
   * @type {{x: Number, y: Number}}
   */
  this.scale = {x: 1, y: 1};

  /**
   * Rotation in radians.
   * @type {Number}
   */
  this.rotation = 0;

  this.setParams(params);
}
SpatialComponent.prototype = Object.create(Component.prototype);

SpatialComponent.prototype.setParams = function (params) {
  if (params) {
    if (params.position) {
      this.position.x = Component.copyField(params.position.x, this.position.x);
      this.position.y = Component.copyField(params.position.y, this.position.y);
    }
    if (params.scale) {
      this.scale.x = Component.copyField(params.scale.x, 1);
      this.scale.y = Component.copyField(params.scale.y, 1);
    }
  this.rotation = Component.copyField(params.rotation, this.rotation);
  }
};

export default SpatialComponent;
