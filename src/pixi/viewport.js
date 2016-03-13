"use strict";

/**
 * Represents a viewport for pixi.
 * A viewport is not shown until added to a displayable object such as stage.
 * If a width and height is provided the viewport will center at the halves.
 */

/**
 * Represents a scene for the viewport.
 * @constructor
 */
function Scene() {
  /**
   * Display used for updating with the camera.
   * @type {PIXI.Container}
   */
  this.display = new PIXI.Container();

  /**
   * True to lock the scene to no longer be scrollable.
   * @type {boolean}
   */
  this.isLocked = false;
}

/**
 * Creates a viewport.
 * @param {Camera} camera the camera to use.
 * @param {Number} width the width of the viewport.
 * @param {Number} height the height of the viewport.
 * @constructor
 */
function Viewport(camera, width, height) {
  /**
   * Main display of the viewport.
   * @type {PIXI.Container}
   */
  this.display = new PIXI.Container();

  /**
   * Scenes for the viewport.
   * @type {Array.<Scene>}
   */
  this.scenes = [];

  /**
   * Camera to use for offsetting the scenes.
   * @type {Camera}
   */
  this.camera = camera;

  /**
   * Width of the viewport.
   * @type {number}
   */
  this.width = width;

  /**
   * Height of the viewport.
   * @type {number}
   */
  this.height = height;

  /**
   * True to floor the camera.
   * @type {boolean}
   */
  this.isFloored = true;
}

/**
 * Retrieves the calculated camera X position.
 * @returns {number}
 */
Viewport.prototype.getCalculatedCameraX = function() {
  var x = -this.camera.position.x * this.camera.scale.x + this.width / 2;
  if (this.isFloored) {
    return Math.floor(x);
  } else {
    return x;
  }
};

/**
 * Retrieves the calculated camera Y position.
 * @returns {number}
 */
Viewport.prototype.getCalculatedCameraY = function() {
  var y = -this.camera.position.y * this.camera.scale.y + this.height / 2;
  if (this.isFloored) {
    return Math.floor(y);
  } else {
    return y;
  }
};

/**
 * Floors all displays and children positions.
 * @param {PIXI.Container|PIXI.DisplayObject} display the display to floor.
 */
function floorDisplays(display) {
  display.position.x = Math.floor(display.position.x);
  display.position.y = Math.floor(display.position.y);

  if (display instanceof PIXI.Container) {
    for (var i = 0; i < display.children.length; i++) {
      floorDisplays(display.children[i]);
    }
  }
}

/**
 * Updates the viewport.
 */
Viewport.prototype.update = function() {
  if (!this.camera) return;

  // Update the view properties.
  for (var i = 0; i < this.scenes.length; i++) {
    var scene = this.scenes[i];
    var display = scene.display;
    display.position.x = this.getCalculatedCameraX();
    display.position.y = this.getCalculatedCameraY();
    display.scale.x = this.camera.scale.x;
    display.scale.y = this.camera.scale.y;
    display.rotation = this.camera.rotation;

    if (scene.isLocked) {
      display.position.x = this.width / 2;
      display.position.y = this.height / 2;
    }
  }
};

/**
 * Add a scene to the viewport.
 * Scenes added will have their parent changed to the viewport display.
 * @param {Scene} scene the scene to add.
 */
Viewport.prototype.addScene = function(scene) {
  this.display.addChild(scene.display);
  this.scenes.push(scene);
};

/**
 * Remove a scene from the viewport.
 * Scenes removed will no longer have a parent.
 * @param {ViewportScene} scene the scene to remove.
 */
Viewport.prototype.removeScene = function(scene) {
  this.display.removeChild(scene.display);
  var index = this.scenes.indexOf(scene);
  if (index !== -1) {
    this.scenes.splice(index, 1);
  }
};

/**
 * Add the viewport to an object.
 * @param {PIXI.Container}
 */
Viewport.prototype.addTo = function(object) {
  object.addChild(this.display);
};

/**
 * Removes the viewport from the parent.
 */
Viewport.prototype.removeFromParent = function() {
  if (this.display.parent) this.display.parent.removeChild(this.display);
};

module.exports.Viewport = Viewport;
module.exports.Scene = Scene;
