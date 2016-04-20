"use strict";

/**
 * Updates and switches states.
 */
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

export default StateSwitcher;
