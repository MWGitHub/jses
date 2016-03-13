"use strict";

import { Loop } from './loop';

var isBrowser = true;
if (process && process.argv.length !== 0) {
  isBrowser = false;
}

/**
 * Initialize the main update loop.
 * @param {Window} window the window to use for updating the frame.
 * @constructor
 */
function Core(window) {
  /**
   * Cross browser request animation frame.
   * @type {*|Function}
   */
  this._requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback){
          window.setTimeout(callback, 1000 / 60);
      };
  this._requestAnimFrame = this._requestAnimFrame.bind(window);

  /**
   * Loop to use for updating the logic.
   * @type {LoopInterface}
   */
  this.updateLoop = new Loop(60);

  /**
   * Loop to use for  updating the rendering.
   * @type {LoopInterface}
   */
  this.renderLoop = new Loop(60);

  /**
   * Rendering layers.
   * @type {Array.<RenderLayer>}
   */
  this._renderLayers = [];

  /**
   * Called when the logic updates.
   * @type {Array.<function(number)>}
   */
  this._onUpdate = [];

  /**
   * Called before the renderer updates.
   * @type {Array.<function(number)>}
   */
  this._onPreRender = [];

  /**
   * Called after the renderer updates.
   * @type {Array.<function(number)>}
   */
  this._onPostRender = [];

  /**
   * True to run the loop.
   * @type {boolean}
   */
  this._isRunning = false;

  /**
   * Callbacks for the beginning of the update loop.
   * @type {Array.<Function(Number)>}
   */
  this._beginCallbacks = [];
  /**
   * Callbacks for the end of the update loop.
   * @type {Array.<Function(Number)>}
   */
  this._endCallbacks = [];

  this._boundUpdate = this._update.bind(this);
  this._boundRender = this._render.bind(this);
}

/**
 * Renders the scene.
 * @param {Number} dt time between updates.
 */
Core.prototype._render = function (dt) {
  this._onPreRender.forEach(function (element) {
    element(dt);
  });
  this._renderLayers.forEach(function (element) {
    element.render(dt);
  });
  this._onPostRender.forEach(function (element) {
    element(dt);
  });
};

/**
 * Updates the game.
 * @param {number} dt the time step of the update.
 */
Core.prototype._update = function (dt) {
  this._onUpdate.forEach(function (element) {
    element(dt);
  });
};

/**
 * Updates the game logic and renders the scene.
 */
Core.prototype._run = function () {
  var that = this;
  var previous = Date.now();
  var runner = function () {
    if (!that._isRunning) return;

    var now = Date.now();
    var dt = now - previous;
    previous = now;

    that._beginCallbacks.forEach(function (element) {
      element(dt);
    });

    that.updateLoop.update(that._boundUpdate);
    that.renderLoop.update(that._boundRender);

    that._endCallbacks.forEach(function (element) {
      element(dt);
    });

    if (isBrowser) {
      that._requestAnimFrame(runner);
    } else {
      setImmediate(runner);
    }
  };
  runner();
};

/**
 * Starts the game.
 */
Core.prototype.start = function () {
  this._isRunning = true;
  this.updateLoop.reset();
  this.renderLoop.reset();
  this._run();
};

/**
 * Stops the game.
 */
Core.prototype.stop = function () {
  this._isRunning = false;
};

/**
 * Resizes each rendering layer.
 * @param {Number} width the width to resize the renderers.
 * @param {Number} height the height to resize the renderers.
 */
Core.prototype.resize = function (width, height) {
  this._renderLayers.forEach(function (element) {
    element.resize(width, height);
  });
};

/**
 * Add render a layer.
 * @param {RenderLayer} layer the render layer to add.
 */
Core.prototype.addRenderLayer = function (layer) {
  this._renderLayers.push(layer);
};

/**
 * Remove a render layer.
 * @param {RenderLayer} layer the render layer to remove.
 */
Core.prototype.removeRenderLayer = function (layer) {
  var index = this._onPostRender.indexOf(layer);
  if (index >= 0) {
    this._renderLayers.splice(index, 1);
  }
};

/**
 * Add and remove callbacks from the renders.
 */

Core.prototype.addPreRenderCallback = function (cb) {
  this._onPreRender.push(cb);
};
Core.prototype.removePreRenderCallback = function (cb) {
  var index = this._onPostRender.indexOf(cb);
  if (index >= 0) {
    this._onPreRender.splice(index, 1);
  }
};
Core.prototype.addPostRenderCallback = function (cb) {
  this._onPostRender.push(cb);
};
Core.prototype.removePostRenderCallback = function (cb) {
  var index = this._onPostRender.indexOf(cb);
  if (index >= 0) {
    this._onPostRender.splice(index, 1);
  }
};

/**
 * Add and remove callbacks for beginning and end of an update loop.
 */
Core.prototype.addUpdateCallback = function (cb) {
  this._onUpdate.push(cb);
};
Core.prototype.removeUpdateCallback = function (cb) {
  var index = this._onUpdate.indexOf(cb);
  if (index >= 0) {
    this._onUpdate.splice(index, 1);
  }
};
Core.prototype.addBeginCallback = function (cb) {
  this._beginCallbacks.push(cb);
};
Core.prototype.removeBeginCallback = function (cb) {
  var index = this._beginCallbacks.indexOf(cb);
  if (index >= 0) {
    this._beginCallbacks.splice(index, 1);
  }
};
Core.prototype.addEndCallback = function (cb) {
  this._endCallbacks.push(cb);
};
Core.prototype.removeEndCallback = function (cb) {
  var index = this._endCallbacks.indexOf(cb);
  if (index >= 0) {
    this._endCallbacks.splice(index, 1);
  }
};

/**
 * Retrieves if the core is running.
 * @returns {boolean}
 */
Core.prototype.getIsRunning = function () {
  return this._isRunning;
};

export default Core;
