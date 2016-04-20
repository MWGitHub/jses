"use strict";

/**
 * Initializes an entity.
 * @param {number} permID permanent ID to assign to the entity.
 * @constructor
 */
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
  if (doesIdExist || (typeof _id !== 'number' && typeof _id !== 'string')) {
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
    get: function () {
      return _id;
    },
    set: function (val) {
      throw new Error('Cannot set entity ID after creation.');
    }
  });
}

export default Entity;
