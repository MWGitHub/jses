"use strict";

/**
 * Base state class.
 * @constructor
 */
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

export default CoreState;
