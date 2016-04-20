"use strict";

/**
 * Initializes the base system class.
 * @constructor
 */
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
System.prototype.update = function(dt) {};

/**
 * Destroys the system.
 */
System.prototype.destroy = function() {};

export default System;
