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
	
	var _gameState = __webpack_require__(11);
	
	var _gameState2 = _interopRequireDefault(_gameState);
	
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
	
	  var initialState = new _gameState2.default(viewport, input);
	  switcher.addState(initialState);
	  switcher.enterState(initialState);
	
	  core.addPreRenderCallback(function (dt) {
	    viewport.update();
	  });
	
	  core.addBeginCallback(function (dt) {
	    input.update(dt);
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

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _state = __webpack_require__(12);
	
	var _state2 = _interopRequireDefault(_state);
	
	var _viewport = __webpack_require__(7);
	
	var _entitySystem = __webpack_require__(13);
	
	var _entitySystem2 = _interopRequireDefault(_entitySystem);
	
	var _pixiSystem = __webpack_require__(17);
	
	var _pixiSystem2 = _interopRequireDefault(_pixiSystem);
	
	var _spatialComponent = __webpack_require__(21);
	
	var _spatialComponent2 = _interopRequireDefault(_spatialComponent);
	
	var _shapeComponent = __webpack_require__(19);
	
	var _shapeComponent2 = _interopRequireDefault(_shapeComponent);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function GameState(viewport, input) {
	  Object.call(_state2.default, this);
	
	  this._viewport = viewport;
	  this._input = input;
	
	  this._scene = new _viewport.Scene();
	  this._viewport.addScene(this._scene);
	
	  // Create and add the layers
	  this._layers = {
	    main: new PIXI.Container()
	  };
	  this._scene.display.addChild(this._layers.main);
	
	  // Create the entity system and systems
	  this._entitySystem = new _entitySystem2.default();
	  this._systems = [new _pixiSystem2.default(this._entitySystem, this._layers)];
	}
	GameState.prototype = Object.create(_state2.default.prototype);
	
	GameState.prototype.onEnter = function (params) {
	  var entity = this._entitySystem.createEntity();
	  this._entitySystem.setComponent(entity, _spatialComponent2.default.type, new _spatialComponent2.default());
	  this._entitySystem.setComponent(entity, _shapeComponent2.default.type, new _shapeComponent2.default({
	    shapes: [['beginFill', 12312], ['moveTo', 0, 0], ['lineTo', -50, 100], ['lineTo', 50, 100], ['endFill']],
	    layer: 'main'
	  }));
	};
	
	GameState.prototype.update = function (dt) {
	  for (var i = 0; i < this._systems.length; i++) {
	    this._systems[i].update(dt);
	  }
	};
	
	GameState.prototype.onLeave = function (params) {
	  for (var i = 0; i < this._systems.length; i++) {
	    this._systems[i].destroy();
	  }
	};
	
	exports.default = GameState;

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Base state class.
	 * @constructor
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function CoreState() {
	  /**
	   * Name of the state used for switching to.
	   * @type {string}
	   */
	  this.type = 'default';
	
	  /**
	   * Switcher for switching states.
	   * @type {StateSwitcher}
	   */
	  this.switcher = null;
	}
	
	/**
	 * Runs when the state is added to a switcher.
	 * @param {{}=} params parameters to pass on the add.
	 */
	CoreState.prototype.onAdd = function (params) {};
	
	/**
	 * Runs when the state is entered.
	 * @param {{}=} params parameters to pass on entering.
	 */
	CoreState.prototype.onEnter = function (params) {};
	
	/**
	 * Updates the state.
	 * @param {Number} dt the time between updates in ms.
	 */
	CoreState.prototype.update = function (dt) {};
	
	/**
	 * Updates before rendering.
	 * @param {Number} dt the time between updates in ms.
	 */
	CoreState.prototype.preRender = function (dt) {};
	
	/**
	 * Updates after rendering.
	 * @param {Number} dt the time between updates in ms.
	 */
	CoreState.prototype.postRender = function (dt) {};
	
	/**
	 * Runs when the state is left.
	 * @param {{}=} params parameters to pass on leaving.
	 */
	CoreState.prototype.onLeave = function (params) {};
	
	/**
	 * Runs when the state is removed from a switcher.
	 * @param {{}=} params parameters to pass on leaving.
	 */
	CoreState.prototype.onRemove = function (params) {};
	
	/**
	 * Runs on destruction.
	 */
	CoreState.prototype.destroy = function () {};
	
	exports.default = CoreState;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _entity = __webpack_require__(14);
	
	var _entity2 = _interopRequireDefault(_entity);
	
	var _entitySet = __webpack_require__(15);
	
	var _entitySet2 = _interopRequireDefault(_entitySet);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Entity system to create entities and handle component setting and removing.
	 * Entities are given the same component as a key for ease of access. Removed
	 * components from the entity will still keep all the components tied to it
	 * when accessed through the entity.
	 */
	
	/**
	 * Initializes the entity system.
	 * @constructor
	 */
	function EntitySystem() {
	  /**
	   * True to have sets be created lazily.
	   * @type {boolean}
	   */
	  this.isLazySets = false;
	
	  /**
	   * UUID generator function.
	   * @type {function}
	   */
	  this.generateUUID = function () {
	    var current = counter;
	    counter++;
	    return current;
	  };
	
	  /**
	   * Counter for assigning entity IDs.
	   * @type {Number}
	   */
	  var counter = 0;
	
	  /**
	   * @type {Object.<String, Entity>}
	   * Entities in the system.
	   */
	  var entities = {};
	
	  /**
	   * Maps the component to entity relationship by entity ID.
	   * @dict
	   * Type is Map<String, Map<ComponentName, Component>>.
	   */
	  var entityComponentMap = {};
	
	  /**
	   * Maps the component to entity relationship for removed entities by entity ID.
	   * @dict
	   * Type is Map<String, Map<ComponentName, Component>>.
	   */
	  var removedEntityComponentMap = {};
	
	  /**
	   * Stores entity sets.
	   * @dict
	   * Type is Map<ComponentName, EntitySet>.
	   */
	  var entitySets = {};
	
	  /**
	   * Creates an entity.
	   * @param {Number|String=} id the ID of the entity to set.
	   * @return {Entity} the created entity.
	   */
	  this.createEntity = function (id) {
	    var entity = new _entity2.default(this.generateUUID());
	    entities[entity.id] = entity;
	
	    // Add the entity to the component map.
	    entityComponentMap[entity.id] = {};
	
	    return entity;
	  };
	
	  /**
	   * Checks if the system has the specified entity.
	   * @param {Entity} entity the entity to check for.
	   * @return {boolean} true if the entity is in the system.
	   */
	  this.hasEntity = function (entity) {
	    var ent = entities[entity.id];
	    if (!ent) return false;
	    return ent === entity;
	  };
	
	  /**
	   * Retrieves an entity by ID.
	   * @param {String|Number} id the ID of the entity.
	   * @returns {Entity} the entity matching the ID or null if none found.
	   */
	  this.getEntityByID = function (id) {
	    return entities[id] ? entities[id] : null;
	  };
	
	  /**
	   * Retrieves an entity by name.
	   * @param {string} name the name of the entity.
	   * @returns {Entity} the entity or null if none found.
	   */
	  this.getEntityByName = function (name) {
	    for (var key in entities) {
	      if (entities.hasOwnProperty(key)) {
	        if (entities[key].name === name) {
	          return entities[key];
	        }
	      }
	    }
	    return null;
	  };
	
	  /**
	   * Removes an entity.
	   * @param {Entity} entity the entity to remove.
	   */
	  this.removeEntity = function (entity) {
	    var storedEntity = entities[entity.id];
	    if (!storedEntity) {
	      return;
	    }
	
	    // Move the entity's components to the removed map.
	    removedEntityComponentMap[entity.id] = entityComponentMap[entity.id];
	
	    // Notify all sets of the removed entity.
	    for (var componentName in entitySets) {
	      entitySets[componentName].remove(entity);
	    }
	
	    // Remove the entity.
	    delete entities[entity.id];
	  };
	
	  /**
	   * Retrieves a component.
	   * @param {Entity} entity the entity to retrieve the component from.
	   * @param {string} componentName the name of the component to retrieve.
	   * @returns {*} the component.
	   */
	  this.getComponent = function (entity, componentName) {
	    var componentList = null;
	    // Get the component of the entity if the active version has it.
	    if (entityComponentMap[entity.id]) {
	      componentList = entityComponentMap[entity.id];
	      if (componentList[componentName]) {
	        return componentList[componentName];
	      } else {
	        componentList = null;
	      }
	    }
	    // Get the component of the removed version if there is no active.
	    if (componentList === null) {
	      if (removedEntityComponentMap[entity.id]) {
	        componentList = removedEntityComponentMap[entity.id];
	        if (componentList[componentName]) {
	          return componentList[componentName];
	        }
	      }
	    }
	    return null;
	  };
	
	  /**
	   * Sets a component and updates the set to add to the added or changed list.
	   * @param {Entity} entity the entity to set the component.
	   * @param {string} componentName the name of the component.
	   * @param {*} component the component.
	   */
	  this.setComponent = function (entity, componentName, component) {
	    // Do not set components for entities outside of the system.
	    if (!entities[entity.id]) {
	      return;
	    }
	    var components = entityComponentMap[entity.id];
	    // Give a reference to the component into the entity for easy access.
	    entity[componentName] = component;
	    // Update the set that matches the component if created.
	    var entitySet;
	    // Create a new set if no sets are found.
	    if (!entitySets[componentName]) {
	      // Set does not exist so component will not be set.
	      if (this.isLazySets) {
	        // Set the component for the entity map for lazy setting.
	        components[componentName] = component;
	        return;
	      }
	      entitySet = new _entitySet2.default();
	      entitySets[componentName] = entitySet;
	    } else {
	      entitySet = entitySets[componentName];
	    }
	    // Update the set states.
	    if (components[componentName]) {
	      entitySet.change(entity);
	    } else {
	      entitySet.add(entity);
	    }
	    // Set the component for the entity map.
	    components[componentName] = component;
	  };
	
	  /**
	   * Checks if an entity has a component.
	   * @param {Entity} entity the entity to check.
	   * @param {string} componentName the name of the component.
	   * @returns {boolean} true if the entity has the component matching the name.
	   */
	  this.hasComponent = function (entity, componentName) {
	    // Entities not in the system will not be checked.
	    if (!entityComponentMap[entity.id]) {
	      return false;
	    }
	    var components = entityComponentMap[entity.id];
	    return components[componentName];
	  };
	
	  /**
	   * Removes a component from the entity.
	   * @param {Entity} entity the entity to remove the component from.
	   * @param {string} componentName the name of the component.
	   */
	  this.removeComponent = function (entity, componentName) {
	    if (!entityComponentMap[entity.id]) {
	      return;
	    }
	    // Keep the component in case a system needs it before flush.
	    var components = entityComponentMap[entity.id];
	    if (!removedEntityComponentMap[entity.id]) {
	      removedEntityComponentMap[entity.id] = {};
	    }
	    removedEntityComponentMap[entity.id][componentName] = components[componentName];
	
	    // Remove the component from the active component list.
	    delete entityComponentMap[entity.id][componentName];
	
	    // Update the sets that have the component.
	    if (entitySets[componentName]) {
	      entitySets[componentName].remove(entity);
	    }
	  };
	
	  /**
	   * Retrieves all the entities matching the component name.
	   * @param {String} componentName the name of the component.
	   * @returns {EntitySet} the set of entities with the given component.
	   */
	  this.getEntities = function (componentName) {
	    // Lazy creation of entity sets do not support removal before retrieval.
	    if (!entitySets[componentName]) {
	      var entitySet = new _entitySet2.default();
	      // Add existing entities that match the component.
	      for (var key in entities) {
	        if (this.hasComponent(entities[key], componentName)) {
	          entitySet.add(entities[key]);
	        }
	      }
	      entitySets[componentName] = entitySet;
	    }
	
	    return entitySets[componentName];
	  };
	
	  /**
	   * Retrieves all entities.
	   * @returns {Object.<String, Entity>}
	   */
	  this.getAllEntities = function () {
	    return entities;
	  };
	
	  /**
	   * Flushes the entity set changes.
	   */
	  this.flushChanges = function () {
	    for (var componentName in entitySets) {
	      if (entitySets.hasOwnProperty(componentName)) {
	        entitySets[componentName].flush();
	      }
	    }
	    removedEntityComponentMap = {};
	  };
	
	  /**
	   * Removes all entities from the system.
	   */
	  this.removeAllEntities = function () {
	    for (var key in entities) {
	      if (entities.hasOwnProperty(key)) {
	        this.removeEntity(entities[key]);
	      }
	    }
	  };
	}
	
	exports.default = EntitySystem;

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Initializes an entity.
	 * @param {number} permID permanent ID to assign to the entity.
	 * @constructor
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function Entity(permID) {
	  /**
	   * ID of the entity which can be either a number or unique string.
	   * @type {Number|String}
	   */
	  var _id = permID;
	
	  /**
	   * Name of the entity.
	   * @type {string}
	   */
	  this.name = "";
	
	  /**
	   * Data that systems do not need to keep track of.
	   * Allows for quick setting and retrieval.
	   * @dict
	   */
	  this.userData = {};
	
	  var doesIdExist = _id === undefined || _id === null;
	  if (doesIdExist || typeof _id !== 'number' && typeof _id !== 'string') {
	    throw new TypeError("Invalid ID");
	  }
	  /**
	   * String representation of the entity.
	   * @returns {string}
	   */
	  this.toString = function () {
	    return "entity" + _id;
	  };
	
	  Object.defineProperty(this, 'id', {
	    get: function get() {
	      return _id;
	    },
	    set: function set(val) {
	      throw new Error('Cannot set entity ID after creation.');
	    }
	  });
	}
	
	exports.default = Entity;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _set = __webpack_require__(16);
	
	var _set2 = _interopRequireDefault(_set);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * A set of entities with components in common.
	 */
	function EntitySet() {
	  /**
	   * All the entities in the set.
	   * @type {DSSet.<Entity>}
	   */
	  var entities = new _set2.default();
	
	  /**
	   * Newly added entities to the set.
	   * @type {DSSet.<Entity>}
	   */
	  var addedEntities = new _set2.default();
	
	  /**
	   * Newly changed entities in the set.
	   * @type {DSSet.<Entity>}
	   */
	  var changedEntities = new _set2.default();
	
	  /**
	   * Newly removed entities from the set.
	   * @type {DSSet.<Entity>}
	   */
	  var removedEntities = new _set2.default();
	
	  /**
	   * Callbacks to run when an entity is added.
	   * @type {Array.<Function(Entity)>}
	   */
	  var addedCallbacks = [];
	
	  /**
	   * Callbacks to run when an entity is changed.
	   * @type {Array.<Function(Entity)>}
	   */
	  var changedCallbacks = [];
	
	  /**
	   * Callbacks to run when an entity is removed.
	   * @type {Array.<Function(Entity)>}
	   */
	  var removedCallbacks = [];
	
	  /**
	   * Adds an entity.
	   * An added entity will not be in the removed or changed sets unless set to change also.
	   * @param {Entity} entity the entity to add.
	   */
	  this.add = function (entity) {
	    if (entities.add(entity)) {
	      removedEntities.remove(entity);
	      changedEntities.remove(entity);
	      addedEntities.add(entity);
	
	      // Run the callback functions.
	      for (var i = 0; i < addedCallbacks.length; i++) {
	        addedCallbacks[i](entity);
	      }
	    }
	  };
	
	  /**
	   * Add a changed entity.
	   * @param {Entity} entity the entity to change.
	   */
	  this.change = function (entity) {
	    if (entities.contains(entity)) {
	      changedEntities.add(entity);
	
	      // Run the callback functions.
	      for (var i = 0; i < changedCallbacks.length; i++) {
	        changedCallbacks[i](entity);
	      }
	    }
	  };
	
	  /**
	   * Removes an entity.
	   * A removed entity will not longer be in the added or changed sets.
	   * @param {Entity} entity the entity to remove.
	   */
	  this.remove = function (entity) {
	    if (entities.remove(entity)) {
	      addedEntities.remove(entity);
	      changedEntities.remove(entity);
	      removedEntities.add(entity);
	
	      // Run the callback functions.
	      for (var i = 0; i < removedCallbacks.length; i++) {
	        removedCallbacks[i](entity);
	      }
	    }
	  };
	
	  /**
	   * Iterates over all entities.
	   * @param {function(T, *)} func the function to call on each iteration.
	   * @param {*=} context context variables to pass in.
	   */
	  this.each = function (func, context) {
	    entities.each(func, context);
	  };
	
	  /**
	   * Iterates over the newly added entities.
	   * @param {function(T, *)} func the function to call on each iteration.
	   * @param {*=} context context variables to pass in.
	   */
	  this.eachAdded = function (func, context) {
	    addedEntities.each(func, context);
	  };
	
	  /**
	   * Iterates over the newly changed entities.
	   * @param {function(T, *)} func the function to call on each iteration.
	   * @param {*=} context context variables to pass in.
	   */
	  this.eachChanged = function (func, context) {
	    changedEntities.each(func, context);
	  };
	
	  /**
	   * Iterates over the newly removed entities.
	   * @param {function(T, *)} func the function to call on each iteration.
	   * @param {*=} context context variables to pass in.
	   */
	  this.eachRemoved = function (func, context) {
	    removedEntities.each(func, context);
	  };
	
	  /**
	   * Checks if the set contains an entity.
	   * @param {Entity} entity the entity to check if the set contains.
	   * @return {boolean} true if the set contains the entity.
	   */
	  this.contains = function (entity) {
	    return entities.contains(entity);
	  };
	
	  /**
	   * Retrieves the number of entities in the set.
	   * @returns {Number} the number of entities in the set.
	   */
	  this.size = function () {
	    return entities.size();
	  };
	
	  /**
	   * Flushes all the sets.
	   */
	  this.flush = function () {
	    addedEntities.clear();
	    changedEntities.clear();
	    removedEntities.clear();
	  };
	
	  /**
	   * Retrieves all the entities in the set as a new array.
	   * @returns {Array.<Entity>}
	   */
	  this.getAll = function () {
	    return entities.getAll();
	  };
	
	  /**
	   * Retrieves all the entities in the set.
	   * Do not modify the array directly.
	   * @returns {Array.<Entity>}
	   */
	  this.getAllRaw = function () {
	    return entities._objects;
	  };
	
	  /**
	   * Adds an add callback.
	   * @param {function(Entity)} func the callback function.
	   */
	  this.addAddedCallback = function (func) {
	    addedCallbacks.push(func);
	  };
	  /**
	   * Removes an add callback.
	   * @param {function(Entity)} func the callback function to remove.
	   */
	  this.removeAddedCallback = function (func) {
	    var index = addedCallbacks.indexOf(func);
	    if (index >= 0) {
	      addedCallbacks.splice(index, 1);
	    }
	  };
	  /**
	   * Adds a changed callback.
	   * @param {function(Entity)} func the callback function.
	   */
	  this.addChangedCallback = function (func) {
	    changedCallbacks.push(func);
	  };
	  /**
	   * Removes a changed callback.
	   * @param {function(Entity)} func the callback function to remove.
	   */
	  this.removeChangedCallback = function (func) {
	    var index = changedCallbacks.indexOf(func);
	    if (index >= 0) {
	      changedCallbacks.splice(index, 1);
	    }
	  };
	  /**
	   * Adds a removed callback.
	   * @param {function(Entity)} func the callback function.
	   */
	  this.addRemovedCallback = function (func) {
	    removedCallbacks.push(func);
	  };
	  /**
	   * Removes a removed callback.
	   * @param {function(Entity)} func the callback function to remove.
	   */
	  this.removeRemovedCallback = function (func) {
	    var index = removedCallbacks.indexOf(func);
	    if (index >= 0) {
	      removedCallbacks.splice(index, 1);
	    }
	  };
	
	  /**
	   * Clears the set and all the callbacks.
	   */
	  this.clear = function () {
	    entities.clear();
	    this.flush();
	    addedCallbacks = [];
	    changedCallbacks = [];
	    removedCallbacks = [];
	  };
	}
	
	exports.default = EntitySet;

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Initializes the set.
	 * @constructor
	 * @template T
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function DSSet() {
	  /**
	   * Objects in the set.
	   * Retrieval of the objects is safe but modifying it directly will
	   * not check for duplicates.
	   * @type {Array.<T>}
	   * @private
	   */
	  this._objects = [];
	}
	
	/**
	 * Adds an object to the set as long as it is unique.
	 * @param {T} object the object to add.
	 * @return {boolean} true if the object was added.
	 */
	DSSet.prototype.add = function (object) {
	  if (!this.contains(object)) {
	    this._objects.push(object);
	    return true;
	  }
	  return false;
	};
	
	/**
	 * Removes an object from the set.
	 * @param {T} object the object to remove.
	 * @return {boolean} true if the object was removed.
	 */
	DSSet.prototype.remove = function (object) {
	  var index = this._objects.indexOf(object);
	  if (index > -1) {
	    this._objects.splice(index, 1);
	    return true;
	  }
	  return false;
	};
	
	/**
	 * Iterates over the objects and calls the given function.
	 * @param {function(T, *)} func the function to call on each iteration.
	 * @param {*=} context context variables to pass.
	 */
	DSSet.prototype.each = function (func, context) {
	  for (var i = 0; i < this._objects.length; i++) {
	    func(this._objects[i], context);
	  }
	};
	
	/**
	 * Checks if the set contains an object.
	 * @param {T} object the object to check if the set contains.
	 * @return {boolean} true if the set contains the object.
	 */
	DSSet.prototype.contains = function (object) {
	  return this._objects.indexOf(object) > -1;
	};
	
	/**
	 * Retrieves the number of objects in the set.
	 * @returns {Number} the number of objects in the set.
	 */
	DSSet.prototype.size = function () {
	  return this._objects.length;
	};
	
	/**
	 * Retrieves the objects in the set as a new array.
	 * Modifications to the array does not affect the set.
	 * @returns {Array.<T>}
	 */
	DSSet.prototype.getAll = function () {
	  var objects = [];
	  objects = objects.concat(this._objects);
	  return objects;
	};
	
	/**
	 * Clears the set.
	 */
	DSSet.prototype.clear = function () {
	  this._objects = [];
	};
	
	exports.default = DSSet;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _system = __webpack_require__(18);
	
	var _system2 = _interopRequireDefault(_system);
	
	var _shapeComponent = __webpack_require__(19);
	
	var _shapeComponent2 = _interopRequireDefault(_shapeComponent);
	
	var _spatialComponent = __webpack_require__(21);
	
	var _spatialComponent2 = _interopRequireDefault(_spatialComponent);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Renders graphics components with Pixi.
	 * @param {EntitySystem} entitySystem the entity system to retrieve from.
	 * @param {Dictionary} layers the layers to add to.
	 */
	var PIXISystem = function PIXISystem(entitySystem, layers) {
		_system2.default.call(this);
	
		this._entitySystem = entitySystem;
		this._layers = layers;
	
		// Object with entity id as the key and an array of graphics.
		this._entityGraphics = {};
	};
	PIXISystem.prototype = Object.create(_system2.default.prototype);
	
	PIXISystem.prototype.update = function (dt) {
		var _this = this;
	
		var entitySet = this._entitySystem.getEntities(_shapeComponent2.default.type);
	
		// Create component
		entitySet.eachAdded(function (entity) {
			var shapeComponent = _this._entitySystem.getComponent(entity, _shapeComponent2.default.type);
	
			// Create shape if provided
			var shapes = shapeComponent.shapes;
			if (shapes.length > 0) {
				var graphics = new PIXI.Graphics();
				for (var i = 0; i < shapes.length; i++) {
					var command = shapes[i][0];
					var args = shapes[i].slice(1);
					Object.getPrototypeOf(graphics)[command].apply(graphics, args);
				}
				_this._layers[shapeComponent.layer].addChild(graphics);
				_this._entityGraphics[entity.id] = _this._entityGraphics[entity.id] || [];
				_this._entityGraphics[entity.id].push(graphics);
			}
		});
	
		// Update all components
		entitySet.each(function (entity) {
			var shapeComponent = _this._entitySystem.getComponent(entity, _shapeComponent2.default.type);
			var spatial = _this._entitySystem.getComponent(entity, _spatialComponent2.default.type);
			var graphicsArray = _this._entityGraphics[entity.id];
			if (spatial) {
				for (var i = 0; i < graphicsArray.length; i++) {
					var graphics = graphicsArray[i];
					graphics.x = spatial.position.x;
					graphics.y = spatial.position.y;
					graphics.scale.x = spatial.scale.x;
					graphics.scale.y = spatial.scale.y;
					graphics.rotation = spatial.rotation;
				}
			}
		});
	
		// Remove deleted components
		entitySet.eachRemoved(function (entity) {
			var graphicsArray = _this._entityGraphics[entity.id];
			for (var i = 0; i < graphicsArray.length; i++) {
				var graphics = graphicsArray[i];
				var parent = graphics.parent;
				if (parent) {
					parent.removeChild(graphics);
				}
			}
		});
	};
	
	exports.default = PIXISystem;

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Initializes the base system class.
	 * @constructor
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function System() {}
	
	/**
	 * Updates the system before the normal update.
	 * Used before game logic updates.
	 * @param {Number} dt the time between updates.
	 */
	System.prototype.preUpdate = function (dt) {};
	
	/**
	 * Updates the system.
	 * @param {Number} dt the time between updates.
	 */
	System.prototype.update = function (dt) {};
	
	/**
	 * Destroys the system.
	 */
	System.prototype.destroy = function () {};
	
	exports.default = System;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _component = __webpack_require__(20);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Component for pixi graphics objects.
	 * @constructor
	 */
	function ShapeComponent(params) {
		_component2.default.call(this);
	
		this.layer = null;
	
		/**
	  * Shapes commands given in order for drawing.
	  * Arguments for the drawing command is passed in as an array.
	  * @type {[[*]]}
	  */
		this.shapes = [];
	
		this.setParams(params);
	}
	ShapeComponent.prototype = Object.create(_component2.default.prototype);
	ShapeComponent.type = 'ShapeComponent';
	
	ShapeComponent.prototype.setParams = function (params) {
		this.layer = _component2.default.copyField(params.layer, this.layer);
		this.shapes = JSON.parse(JSON.stringify(params.shapes)) || [];
	};
	
	exports.default = ShapeComponent;

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Optional base class for components.
	 * Components do not have to extend this. They only need to implement
	 * the class methods to be compatible with systems.
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Component = function Component() {};
	
	/**
	 * Type of component which is used for component retrieval and setting.
	 * @type {string}
	 */
	Component.type = 'Component';
	
	/**
	 * Sets parameters onto the component.
	 * @param {Object} params the parameters to set.
	 */
	Component.prototype.setParams = function (params) {};
	
	/**
	 * Makes a copy of the component.
	 * @type {{}} component the component to copy into.
	 * @type {{}} params the params or component to copy from.
	 */
	Component.copy = function (component) {
	  return JSON.parse(JSON.stringify(component));
	};
	
	/**
	 * Returns the new value or the default value depending on if the new
	 * value exists.
	 * @param {*} newValue the new value to set if it exists.
	 * @param {*} defaultValue the default value to fall back on.
	 * @returns {*} the final value based on the value checks.
	 */
	Component.copyField = function (newValue, defaultValue) {
	  if (newValue === null || newValue === undefined) return defaultValue;
	  return newValue;
	};
	
	/**
	 * Copies an array if the copied array exists.
	 * @param {Array} newArray the array to copy into.
	 * @param {Array} arrayToCopy the array to copy.
	 * @returns {Array} the copied array or the new array if no copy exists.
	 */
	Component.copyPrimitiveArray = function (newArray, arrayToCopy) {
	  var arr = newArray ? newArray : [];
	
	  if (arrayToCopy) {
	    return arr.concat(arrayToCopy);
	  }
	  return arr;
	};
	
	exports.default = Component;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(20);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function SpatialComponent(params) {
	  _component2.default.call(this);
	
	  /**
	   * Position of the spatial.
	   * @type {{x: Number, y: Number }}
	   */
	  this.position = { x: 0, y: 0 };
	
	  /**
	   * Scale for the spatial.
	   * @type {{x: Number, y: Number}}
	   */
	  this.scale = { x: 1, y: 1 };
	
	  /**
	   * Rotation in radians.
	   * @type {Number}
	   */
	  this.rotation = 0;
	
	  this.setParams(params);
	}
	SpatialComponent.prototype = Object.create(_component2.default.prototype);
	SpatialComponent.type = 'SpatialComponent';
	
	SpatialComponent.prototype.setParams = function (params) {
	  if (params) {
	    if (params.position) {
	      this.position.x = _component2.default.copyField(params.position.x, this.position.x);
	      this.position.y = _component2.default.copyField(params.position.y, this.position.y);
	    }
	    if (params.scale) {
	      this.scale.x = _component2.default.copyField(params.scale.x, 1);
	      this.scale.y = _component2.default.copyField(params.scale.y, 1);
	    }
	    this.rotation = _component2.default.copyField(params.rotation, this.rotation);
	  }
	};
	
	exports.default = SpatialComponent;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map