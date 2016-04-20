"use strict";

import Component from '../../core/component';

/**
 * Component for pixi graphics objects.
 * @constructor
 */
function ShapeComponent(params) {
	Component.call(this);

	this.layer = null;

	/**
	 * Shapes commands given in order for drawing.
	 * Arguments for the drawing command is passed in as an array.
	 * @type {[[*]]}
	 */
	this.shapes = [];

  /**
   * Set to true to anti alias the shapes.
   * @type {Boolean}
   */
  this.isAntiAliased = true;

  this.setParams(params);
}
ShapeComponent.prototype = Object.create(Component.prototype);
ShapeComponent.type = 'ShapeComponent';

ShapeComponent.prototype.setParams = function (params) {
	this.layer = Component.copyField(params.layer, this.layer);
	this.shapes = JSON.parse(JSON.stringify(params.shapes)) || [];
  this.isAntiAliased = Component.copyField(params.isAntiAliased, this.isAntiAliased);
};


export default ShapeComponent;
