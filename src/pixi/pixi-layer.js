"use strict";

import RenderLayer from '../core/render-layer';
import { WebGLRenderer, Container } from 'pixi.js';

/**
 * Pixi rendering layer which uses WebGL.
 * @param {HTMLElement} element to attach the layer to.
 * @constructor
 * @extends RenderLayer
 */
function PIXILayer (element) {
  RenderLayer.call(this);

  /**
   * Renderer for the layer.
   * @type {PIXI.WebGLRenderer}
   */
  this.renderer = new WebGLRenderer(1366, 768);

  /**
   * Stage to add objects to.
   * @type {PIXI.Stage}
   */
  this.stage = new Container();

  element.appendChild(this.renderer.view);
}
PIXILayer.prototype = Object.create(RenderLayer.prototype);

PIXILayer.prototype.render = function (dt) {
  this.renderer.render(this.stage);
};

PIXILayer.prototype.resize = function (width, height) {
  this.renderer.resize(width, height);
};

export default PIXILayer;
