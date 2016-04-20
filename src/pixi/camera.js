"use strict";

function Camera() {
  this.position = {
    x: 0,
    y: 0
  };

  this.rotation = 0;

  this.scale = {
    x: 1.0,
    y: 1.0
  };
}

export default Camera;
