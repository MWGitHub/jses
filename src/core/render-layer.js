"use strict";

/**
 * Base object for rendering layers.
 */
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

export default RenderLayer;
