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
 * Cleans up the system.
 * Other systems should not depend on the cleanup of another.
 */
System.prototype.cleanup = function() {};

/**
 * Destroys the system.
 */
System.prototype.destroy = function() {};

export default System;
