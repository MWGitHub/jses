var Game =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	var _pixiLayer = __webpack_require__(5);
	
	var _pixiLayer2 = _interopRequireDefault(_pixiLayer);
	
	var _viewport = __webpack_require__(7);
	
	var _camera = __webpack_require__(8);
	
	var _camera2 = _interopRequireDefault(_camera);
	
	var _stateSwitcher = __webpack_require__(9);
	
	var _stateSwitcher2 = _interopRequireDefault(_stateSwitcher);
	
	var _input = __webpack_require__(10);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Game = function Game() {
	  var width = 683,
	      height = 384;
	  var gameElement = document.getElementById('content');
	
	  var core = new _core2.default(window);
	
	  // Create the renderer
	  var pixiLayer = new _pixiLayer2.default(gameElement);
	  core.addRenderLayer(pixiLayer);
	
	  // Create the input
	  var input = new _input.Input(window, gameElement);
	
	  // Create the main viewport and camera
	  var camera = new _camera2.default();
	  var viewport = new _viewport.Viewport(camera, width, height);
	  viewport.addTo(pixiLayer.stage);
	  viewport.isFloored = false;
	  core.resize(width, height);
	
	  // Create the states
	  var switcher = new _stateSwitcher2.default();
	  core.addUpdateCallback(switcher.update.bind(switcher));
	  core.addPreRenderCallback(switcher.preRender.bind(switcher));
	  core.addPostRenderCallback(switcher.postRender.bind(switcher));
	
	  core.addPreRenderCallback(function (dt) {
	    viewport.update();
	  });
	
	  core.addUpdateCallback(function (dt) {
	    console.log(input.keysDown[_input.Input.charToKeyCode('W')]);
	  });
	
	  core.addEndCallback(function (dt) {
	    input.flush();
	  });
	
	  this.start = function () {
	    core.start();
	  };
	
	  this.stop = function () {
	    core.stop();
	  };
	};
	
	module.exports = Game;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _loop = __webpack_require__(4);
	
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
	  this._requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
	    window.setTimeout(callback, 1000 / 60);
	  };
	  this._requestAnimFrame = this._requestAnimFrame.bind(window);
	
	  /**
	   * Loop to use for updating the logic.
	   * @type {LoopInterface}
	   */
	  this.updateLoop = new _loop.Loop(60);
	
	  /**
	   * Loop to use for  updating the rendering.
	   * @type {LoopInterface}
	   */
	  this.renderLoop = new _loop.Loop(60);
	
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
	  var runner = function runner() {
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
	
	exports.default = Core;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(3).setImmediate))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(2).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).setImmediate, __webpack_require__(3).clearImmediate))

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Interface for loops.
	 */
	
	var LoopInterface = function LoopInterface() {};
	
	/**
	 * Resets the loop.
	 */
	LoopInterface.prototype.reset = function () {};
	
	/**
	 * Updates the loop's timer.
	 * @param {Function(Number)} callback the callback to run when ready.
	 */
	LoopInterface.prototype.update = function (callback) {};
	
	module.exports.LoopInterface = LoopInterface;
	
	/**
	 * Naive loop implementation that only limits max updates.
	 * Delta times will always be based on the max per seconds.
	 * @param {Number} maxUpdatePerSecond the max the game will update per second.
	 * @extends LoopInterface
	 */
	var Loop = function Loop(maxUpdatesPerSecond) {
	  LoopInterface.call(this);
	
	  this._maxUpdatesPerSecond = maxUpdatesPerSecond || 60;
	
	  this._lastUpdate = Date.now();
	};
	Loop.prototype = Object.create(LoopInterface.prototype);
	
	Loop.prototype.reset = function () {
	  this._lastUpdate = Date.now();
	};
	
	Loop.prototype.update = function (callback) {
	  var now = Date.now();
	  var updateDelta = now - this._lastUpdate;
	
	  var timeBetweenUpdates = 1000 / this._maxUpdatesPerSecond;
	
	  if (updateDelta >= timeBetweenUpdates && callback) {
	    callback(Math.floor(timeBetweenUpdates));
	    this._lastUpdate = Date.now();
	  }
	};
	
	module.exports.Loop = Loop;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _renderLayer = __webpack_require__(6);
	
	var _renderLayer2 = _interopRequireDefault(_renderLayer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Pixi rendering layer which uses WebGL.
	 * @param {HTMLElement} element to attach the layer to.
	 * @constructor
	 * @extends RenderLayer
	 */
	function PIXILayer(element) {
	  _renderLayer2.default.call(this);
	
	  /**
	   * Renderer for the layer.
	   * @type {PIXI.WebGLRenderer}
	   */
	  this.renderer = new PIXI.WebGLRenderer(1366, 768);
	
	  /**
	   * Stage to add objects to.
	   * @type {PIXI.Stage}
	   */
	  this.stage = new PIXI.Container();
	
	  element.appendChild(this.renderer.view);
	}
	PIXILayer.prototype = Object.create(_renderLayer2.default.prototype);
	
	PIXILayer.prototype.render = function (dt) {
	  this.renderer.render(this.stage);
	};
	
	PIXILayer.prototype.resize = function (width, height) {
	  this.renderer.resize(width, height);
	};
	
	exports.default = PIXILayer;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Base object for rendering layers.
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function RenderLayer() {}
	
	/**
	 * Renders the layer.
	 * @param {Number} dt time between renders.
	 */
	RenderLayer.prototype.render = function (dt) {};
	
	/**
	 * Resizes the rendering layer.
	 * @params {Number} width the width of the layer.
	 * @params {Number} height the height of the layer.
	 */
	RenderLayer.prototype.resize = function (width, height) {};
	
	exports.default = RenderLayer;

/***/ },
/* 7 */
/***/ function(module, exports) {

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
	Viewport.prototype.getCalculatedCameraX = function () {
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
	Viewport.prototype.getCalculatedCameraY = function () {
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
	Viewport.prototype.update = function () {
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
	Viewport.prototype.addScene = function (scene) {
	  this.display.addChild(scene.display);
	  this.scenes.push(scene);
	};
	
	/**
	 * Remove a scene from the viewport.
	 * Scenes removed will no longer have a parent.
	 * @param {ViewportScene} scene the scene to remove.
	 */
	Viewport.prototype.removeScene = function (scene) {
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
	Viewport.prototype.addTo = function (object) {
	  object.addChild(this.display);
	};
	
	/**
	 * Removes the viewport from the parent.
	 */
	Viewport.prototype.removeFromParent = function () {
	  if (this.display.parent) this.display.parent.removeChild(this.display);
	};
	
	module.exports.Viewport = Viewport;
	module.exports.Scene = Scene;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
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
	
	exports.default = Camera;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Updates and switches states.
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function StateSwitcher() {
	  /**
	   * States that can be switched to.
	   * @type {Array.<State>}
	   * @private
	   */
	  this._states = [];
	
	  /**
	   * Currently active states that update in add order.
	   * @type {Array.<State>}
	   * @private
	   */
	  this._activeStates = [];
	}
	
	/**
	 * Update all the active states.
	 * @param {Number} dt the time between frames.
	 */
	StateSwitcher.prototype.update = function (dt) {
	  for (var i = 0; i < this._activeStates.length; i++) {
	    this._activeStates[i].update(dt);
	  }
	};
	
	/**
	 * Calls pre-render on all states.
	 * @param {Number} dt the time between frames.
	 */
	StateSwitcher.prototype.preRender = function (dt) {
	  for (var i = 0; i < this._activeStates.length; i++) {
	    this._activeStates[i].preRender(dt);
	  }
	};
	
	/**
	 * Calls post-render on all states.
	 * @param {Number} dt the time between frames.
	 */
	StateSwitcher.prototype.postRender = function (dt) {
	  for (var i = 0; i < this._activeStates.length; i++) {
	    this._activeStates[i].postRender(dt);
	  }
	};
	
	/**
	 * Adds a state to the switcher.
	 * @param {State} state the state to add.
	 * @param {{}=} params optional parameters to pass to the state.
	 */
	StateSwitcher.prototype.addState = function (state, params) {
	  if (this._states.indexOf(state) === -1) {
	    this._states.push(state);
	    if (!state.switcher) {
	      state.switcher = this;
	    }
	    state.onAdd(params);
	  }
	};
	
	/**
	 * Remove a state from the switcher.
	 * A removed state must not be active.
	 * @param {State} state the state to remove.
	 * @param {{}=} params optional parameters to pass to the state.
	 * @returns {Boolean} true if the state has been removed.
	 */
	StateSwitcher.prototype.removeState = function (state, params) {
	  var index = this._activeStates.indexOf(state);
	  if (index === -1) return false;
	
	  state.onRemove(params);
	  this._states.splice(index, 1);
	
	  return true;
	};
	
	/**
	 * Retrieves the first state found by name or null if none found.
	 * @param {String} name the name of the state to retrieve.
	 * @returns {State} the state or null if none found.
	 */
	StateSwitcher.prototype.retrieveState = function (name) {
	  for (var i = 0; i < this._states.length; i++) {
	    var state = this._states[i];
	    if (state.type === name) {
	      return state;
	    }
	  }
	
	  return null;
	};
	
	/**
	 * Switches a state with another state.
	 * Both states must already be valid states to switch to and the state to switch must be active.
	 * @param {State} state the state to switch out.
	 * @param {State} newState the state to switch in to replace in the array.
	 * @param {{}=} leaveParams the parameters to input for the left state.
	 * @param {{}=} enterParams the parameters to input for the entering state.
	 * @returns {Boolean} true if the state has been switched to.
	 */
	StateSwitcher.prototype.switchState = function (state, newState, leaveParams, enterParams) {
	  var index = this._activeStates.indexOf(state);
	
	  // Check if invalid state to switch to.
	  if (index < 0) return false;
	  if (this._states.indexOf(newState) < 0) return false;
	
	  // Switch the states (replaces the spot in the array to keep update order)
	  state.onLeave(leaveParams);
	  this._activeStates[index] = newState;
	  newState.onEnter(enterParams);
	
	  return true;
	};
	
	/**
	 * Enter a state and adds it to the end of the active states.
	 * @param {State} state the state to push in.
	 * @param {{}=} enterParams optional parameters to pass to enter.
	 * @returns {Boolean} true if the state has been entered.
	 */
	StateSwitcher.prototype.enterState = function (state, enterParams) {
	  if (this._states.indexOf(state) === -1) return false;
	  if (this._activeStates.indexOf(state) !== -1) return false;
	
	  this._activeStates.push(state);
	  state.onEnter(enterParams);
	
	  return true;
	};
	
	/**
	 * Leaves a state and removes it from the active states.
	 * @param {CoreState} state the state to leave.
	 * @param {{}=} leaveParams optional parameters to pass to leave.
	 * @returns {Boolean} true if the state has been left.
	 */
	StateSwitcher.prototype.leaveState = function (state, leaveParams) {
	  if (this._states.indexOf(state) === -1) return false;
	
	  var index = this._activeStates.indexOf(state);
	  if (index === -1) return false;
	
	  state.onLeave(leaveParams);
	  this._activeStates.splice(index, 1);
	
	  return true;
	};
	
	exports.default = StateSwitcher;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	
	var isBrowser = true;
	if (process && process.argv.length !== 0) {
	  isBrowser = false;
	}
	
	/**
	 * Handles keyboard, mouse, and game pad inputs.
	 * @param {HTMLElement} window the window to use.
	 * @param {HTMLElement=} element the element to retrieve input events from.
	 * @constructor
	 */
	function Input(window, element) {
	  /**
	   * Document to get inputs from.
	   * @type {HTMLElement}
	   */
	  this._document = element || window.document;
	
	  /**
	   * Navigator used for gamepads.
	   * @type {*}
	   */
	  this._navigator = window.navigator;
	
	  /**
	   * Element that is being focused by the mouse.
	   * @type {HTMLElement}
	   */
	  this._focusElement = null;
	
	  /**
	   * Mouse offsets for finding the relative position.
	   * @type {number}
	   */
	  this.offsetX = 0.0;
	  this.offsetY = 0.0;
	
	  /**
	   * Width and height of the element to retrieve inputs from.
	   * @type {number}
	   */
	  this.width = element ? element.offsetWidth : 0;
	  this.height = element ? element.offsetHeight : 0;
	
	  /**
	   * True when the mouse is just clicked.
	   * @type {{left: boolean, middle: boolean, right: boolean}}
	   */
	  this.isMouseClicked = {
	    left: false,
	    middle: false,
	    right: false
	  };
	
	  /**
	   * True when the mouse is just released.
	   * @type {{left: boolean, middle: boolean, right: boolean}}
	   */
	  this.isMouseReleased = {
	    left: false,
	    middle: false,
	    right: false
	  };
	
	  /**
	   * True when the mouse is being held down.
	   * @type {{left: boolean, middle: boolean, right: boolean}}
	   */
	  this.isMouseDown = {
	    left: false,
	    middle: false,
	    right: false
	  };
	
	  /**
	   * Position of the mouse relative to the center of the canvas.
	   * Left ie negative X and right is positive X.
	   * Up is positive Y and down is negative Y.
	   * Ranges from -1 to 1.
	   * @type {number}
	   */
	  this.mouseX = 0;
	  this.mouseY = 0;
	
	  /**
	   * Holds if a key is down.
	   * @dict
	   */
	  this.keysDown = {};
	
	  /**
	   * Holds if a key is up for the current frame.
	   * @dict
	   */
	  this.keysUp = {};
	
	  /**
	   * Holds if a key is pressed for the current frame.
	   * @dict
	   */
	  this.keysJustDown = {};
	
	  /**
	   * Hotkeys are keys that map to one or more hotkeys.
	   * Hotkeys names are added to the keysDown and keysUp input.
	   * @dict
	   */
	  this.hotkeys = {};
	
	  /**
	   * True to enable game pad support.
	   * @type {boolean}
	   */
	  this.enableGamePads = true;
	
	  /**
	   * Dead zone for game pads.
	   * @type {number}
	   */
	  this.deadZone = 0.25;
	
	  /**
	   * Connected game pads.
	   * @type {Array.<Gamepad>}
	   */
	  this.gamepads = [];
	
	  /**
	   * Buttons for the gamepad in the previous frame.
	   * @type {Array.<GamepadButton>}
	   */
	  this.gamepadsButtonsPrevious = [];
	
	  /**
	   * Check if game pad support is available.
	   * @type {Boolean}
	   */
	  this.gamepadSupportAvailable = this._navigator.getGamepads || !!this._navigator.webkitGetGamepads || !!this._navigator.webkitGamepads;
	
	  /**
	   * True to force all gamepads to use a single pad code.
	   * @type {boolean}
	   */
	  this.forceSingleGamepad = true;
	
	  /********************************************
	   * Initialize the inputs.
	   *******************************************/
	  // Don't listen to events if no element is given.
	  if (!element) return;
	
	  // Calculate the offsets.
	  var obj = element;
	  if (obj.offsetParent) {
	    do {
	      this.offsetX += obj.offsetLeft;
	      this.offsetY += obj.offsetTop;
	    } while (obj = obj.offsetParent);
	  }
	
	  // Disable default behavior.
	  this.disableDefaults(element);
	
	  // Keep track of the focused element.
	  element.ownerDocument.addEventListener('mousedown', function (event) {
	    this._focusElement = event.target;
	  }.bind(this), false);
	
	  // Add the events.
	  element.addEventListener('mousedown', this._onMouseDown.bind(this), false);
	  element.addEventListener('mouseup', this._onMouseUp.bind(this), false);
	  element.addEventListener('mousemove', this._onMouseMove.bind(this), false);
	
	  // Set up the keycode.
	  element.ownerDocument.addEventListener('keydown', this._onKeyDown.bind(this));
	  element.ownerDocument.addEventListener('keyup', this._onKeyUp.bind(this));
	}
	
	/**
	 * Updates the input.
	 * @param {number} dt the time between frames.
	 */
	Input.prototype.update = function (dt) {
	  // Update the gamepads.
	  if (this.gamepadSupportAvailable && this.enableGamePads) {
	    this.updateGamePads();
	  }
	};
	
	/**
	 * Runs when the mouse is down.
	 * @param {MouseEvent} event the mouse event.
	 */
	Input.prototype._onMouseDown = function (event) {
	  var code = null;
	  switch (event.button) {
	    case Input.MouseButtons.Left:
	      this.isMouseClicked.left = true;
	      this.isMouseDown.left = true;
	      code = Input.MouseCodes.Left;
	      break;
	    case Input.MouseButtons.Middle:
	      this.isMouseClicked.middle = true;
	      this.isMouseDown.middle = true;
	      code = Input.MouseCodes.Middle;
	      break;
	    case Input.MouseButtons.Right:
	      this.isMouseClicked.right = true;
	      this.isMouseDown.right = true;
	      code = Input.MouseCodes.Right;
	      break;
	  }
	  if (code) {
	    this.keysDown[code] = true;
	    this.keysJustDown[code] = true;
	
	    // Update every hotkey.
	    if (this.hotkeys[code]) {
	      for (var i = 0; i < this.hotkeys[code].length; i++) {
	        this.keysDown[this.hotkeys[code][i]] = true;
	        this.keysJustDown[this.hotkeys[code][i]] = this.keysJustDown[code];
	      }
	    }
	  }
	};
	
	/**
	 * Runs when the mouse is released.
	 * @param {MouseEvent} event the mouse event.
	 */
	Input.prototype._onMouseUp = function (event) {
	  var code = null;
	  switch (event.button) {
	    case Input.MouseButtons.Left:
	      this.isMouseDown.left = false;
	      this.isMouseReleased.left = true;
	      code = Input.MouseCodes.Left;
	      break;
	    case Input.MouseButtons.Middle:
	      this.isMouseDown.middle = false;
	      this.isMouseReleased.middle = true;
	      code = Input.MouseCodes.Middle;
	      break;
	    case Input.MouseButtons.Right:
	      this.isMouseDown.right = false;
	      this.isMouseReleased.middle = true;
	      code = Input.MouseCodes.Right;
	      break;
	  }
	  if (code) {
	    this.keysDown[code] = false;
	    this.keysUp[code] = true;
	
	    // Update every hotkey.
	    if (this.hotkeys[code]) {
	      for (var i = 0; i < this.hotkeys[code].length; i++) {
	        this.keysDown[this.hotkeys[code][i]] = false;
	        this.keysUp[this.hotkeys[code][i]] = true;
	      }
	    }
	  }
	};
	
	/**
	 * Runs when the mouse has moved.
	 * @param {MouseEvent} event the mouse event.
	 */
	Input.prototype._onMouseMove = function (event) {
	  this.mouseX = (event.pageX - this.offsetX - this.width / 2) / (this.width / 2);
	  this.mouseY = -(event.pageY - this.offsetY - this.height / 2) / (this.height / 2);
	};
	
	Input.prototype._onKeyDown = function (event) {
	  var charCode = event.keyCode;
	  // Only add to just down if it isn't down already.
	  if (!this.keysDown[charCode]) {
	    this.keysJustDown[charCode] = true;
	  }
	  this.keysDown[charCode] = true;
	
	  // Update every hotkey.
	  if (this.hotkeys[charCode]) {
	    for (var i = 0; i < this.hotkeys[charCode].length; i++) {
	      this.keysDown[this.hotkeys[charCode][i]] = true;
	      this.keysJustDown[this.hotkeys[charCode][i]] = this.keysJustDown[charCode];
	    }
	  }
	
	  return false;
	};
	
	Input.prototype._onKeyUp = function (event) {
	  var charCode = event.keyCode;
	  this.keysDown[charCode] = false;
	  this.keysUp[charCode] = true;
	
	  // Update every hotkey.
	  if (this.hotkeys[charCode]) {
	    for (var i = 0; i < this.hotkeys[charCode].length; i++) {
	      this.keysDown[this.hotkeys[charCode][i]] = false;
	      this.keysUp[this.hotkeys[charCode][i]] = true;
	    }
	  }
	};
	
	/**
	 * Updates the gamepads.
	 */
	Input.prototype.updateGamePads = function () {
	  if (!this.gamepadSupportAvailable || !this.enableGamePads) return;
	
	  // Retrieve all available pads.
	  var rawGamepads = navigator.getGamepads && navigator.getGamepads() || navigator.webkitGetGamepads && navigator.webkitGetGamepads();
	
	  var i;
	  if (rawGamepads) {
	    this.gamepads = [];
	    for (i = 0; i < rawGamepads.length; i++) {
	      if (rawGamepads[i]) {
	        this.gamepads.push(rawGamepads[i]);
	      }
	    }
	  }
	
	  // Set buttons down and up for the pad.
	  var k, j;
	  for (i = 0; i < this.gamepads.length; i++) {
	    var gamepad = this.gamepads[i];
	    if (!gamepad) continue;
	
	    var buttons = [];
	    // Create a previous state if needed.
	    if (!this.gamepadsButtonsPrevious[i]) {
	      this.gamepadsButtonsPrevious[i] = [];
	      for (j = 0; j < gamepad.buttons.length; j++) {
	        this.gamepadsButtonsPrevious[i][j] = 0;
	      }
	    }
	    // Set the buttons to values.
	    for (j = 0; j < gamepad.buttons.length; j++) {
	      buttons[j] = gamepad.buttons[j].value;
	    }
	    // Simulate key pressed on gamepad analog.
	    if (gamepad.axes[0] < -this.deadZone) {
	      buttons[14] = 1;
	    } else if (gamepad.axes[0] > this.deadZone) {
	      buttons[15] = 1;
	    }
	    if (gamepad.axes[1] < -this.deadZone) {
	      buttons[12] = 1;
	    } else if (gamepad.axes[1] > this.deadZone) {
	      buttons[13] = 1;
	    }
	    // Check if a button is pressed based on the last button state.
	    for (j = 0; j < buttons.length; j++) {
	      var isPressed = false;
	      var isUp = false;
	
	      if (this.gamepadsButtonsPrevious[i][j] <= this.deadZone && buttons[j] > this.deadZone) {
	        isPressed = true;
	      }
	      if (this.gamepadsButtonsPrevious[i][j] > this.deadZone && buttons[j] <= this.deadZone) {
	        isUp = true;
	      }
	      var padCode = 'GP' + (i + 1) + '-' + j;
	      if (this.forceSingleGamepad) {
	        padCode = padName + j;
	      }
	      if (isPressed) {
	        // Handle first press.
	        if (!this.keysDown[padCode]) {
	          this.keysJustDown[padCode] = true;
	          this.keysDown[padCode] = true;
	        }
	
	        // Update every hotkey.
	        if (this.hotkeys[padCode] && this.keysJustDown[padCode]) {
	          for (k = 0; k < this.hotkeys[padCode].length; k++) {
	            this.keysDown[this.hotkeys[padCode][k]] = true;
	            this.keysJustDown[this.hotkeys[padCode][k]] = this.keysJustDown[padCode];
	          }
	        }
	      }
	      if (isUp) {
	        // Signal a button is no longer pressed.
	        if (this.keysDown[padCode]) {
	          this.keysDown[padCode] = false;
	          this.keysUp[padCode] = true;
	        }
	
	        // Update every hotkey.
	        if (this.hotkeys[padCode]) {
	          for (k = 0; k < this.hotkeys[padCode].length; k++) {
	            if (this.keysDown[this.hotkeys[padCode][k]]) {
	              this.keysDown[this.hotkeys[padCode][k]] = false;
	              this.keysUp[this.hotkeys[padCode][k]] = true;
	            }
	          }
	        }
	      }
	      // Update the previous pad state.
	      this.gamepadsButtonsPrevious[i][j] = buttons[j];
	    }
	  }
	};
	
	/**
	 * Cleans up the input system for use with the next update.
	 */
	Input.prototype.flush = function () {
	  this.isMouseClicked.left = false;
	  this.isMouseClicked.middle = false;
	  this.isMouseClicked.right = false;
	  this.isMouseReleased.left = false;
	  this.isMouseReleased.middle = false;
	  this.isMouseReleased.right = false;
	  this.keysUp = {};
	  this.keysJustDown = {};
	};
	
	/**
	 * Adds a hotkey to a key.
	 * @param {String} key the key to assign to a hotkey.
	 * @param {String} hotkey the hotkey name.
	 */
	Input.prototype.addHotkey = function (key, hotkey) {
	  if (!this.hotkeys[key]) this.hotkeys[key] = [];
	
	  if (this.hotkeys[key].indexOf(hotkey) === -1) {
	    this.hotkeys[key].push(hotkey);
	  }
	};
	
	/**
	 * Removes a key from the hotkey.
	 * @param {String} key the key to remove a hotkey from.
	 * @param {String} hotkey the hotkey name.
	 */
	Input.prototype.removeHotkey = function (key, hotkey) {
	  if (this.hotkeys[key]) {
	    var index = this.hotkeys[key].indexOf(hotkey);
	    if (index !== -1) {
	      this.hotkeys[key].splice(index, 1);
	    }
	  }
	};
	
	/**
	 * Removes all hotkeys.
	 */
	Input.prototype.removeAllHotkeys = function () {
	  this.hotkeys = {};
	};
	
	/**
	 * Prevent default inputs on the element.
	 * @param {HTMLElement} element the element to prevent default inputs of.
	 */
	Input.prototype.disableDefaults = function (element) {
	  // Disable the context menu.
	  element.addEventListener('contextmenu', function (e) {
	    e.preventDefault();
	  }, false);
	  // Disable scrolling when in canvas.
	  function onWheelScroll(e) {
	    e.preventDefault();
	  }
	  element.addEventListener('DOMMouseScroll', function (e) {
	    onWheelScroll(e);
	  }, false);
	  element.onmousewheel = onWheelScroll;
	  // Disable key scrolling.
	  element.ownerDocument.addEventListener('keydown', function (e) {
	    if (this._focusElement !== this._document) return;
	    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
	      e.preventDefault();
	    }
	  }.bind(this), false);
	};
	
	/**
	 * Converts a character to a key code.
	 * @param {String} input the character to convert.
	 * @return {Number} the key code.
	 */
	Input.charToKeyCode = function (input) {
	  return input.charCodeAt(0);
	};
	
	/**
	 * Mouse buttons hold the raw input numbers for the mouse.
	 * @type {{Left: number, Middle: number, Right: number}}
	 */
	Input.MouseButtons = {
	  Left: 0,
	  Middle: 1,
	  Right: 2
	};
	
	var mouseName = 'MB1-';
	/**
	 * Mouse codes are used to treat mouse buttons as normal keyboard buttons.
	 * @type {{Left: string, Middle: string, Right: string}}
	 */
	Input.MouseCodes = {
	  Left: mouseName + '0',
	  Middle: mouseName + '1',
	  Right: mouseName + '2'
	};
	
	Input.CharCodes = {
	  Space: 32,
	  Left: 37,
	  Up: 38,
	  Right: 39,
	  Down: 40,
	  Shift: 16,
	  Ctrl: 17,
	  Alt: 18,
	  Tab: 9,
	  CapsLock: 20
	};
	
	var padName = 'GP1-';
	Input.P1PadCodes = {
	  AxisX: padName + 'AX',
	  AxisY: padName + 'AY',
	  AxisZ: padName + 'AZ',
	  Left: padName + 14,
	  Up: padName + 12,
	  Right: padName + 15,
	  Down: padName + 13,
	  ButtonLeft: padName + 2,
	  ButtonUp: padName + 3,
	  ButtonRight: padName + 1,
	  ButtonDown: padName + 0,
	  L1: padName + 4,
	  R1: padName + 5,
	  L2: padName + 6,
	  R2: padName + 7,
	  L3: padName + 10,
	  R3: padName + 11,
	  Select: padName + 8,
	  Start: padName + 9
	};
	
	module.exports.Input = Input;
	module.exports.MouseButtons = Input.MouseButtons;
	module.exports.MouseCodes = Input.MouseCodes;
	module.exports.CharCodes = Input.CharCodes;
	module.exports.P1PadCodes = Input.P1PadCodes;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map