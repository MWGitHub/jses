"use strict";

import { Sprite, Graphics } from 'pixi.js';
import System from '../../core/system';
import ShapeComponent from './shape-component';
import SpatialComponent from '../spatial-component';

/**
 * Renders graphics components with Pixi.
 * @param {EntitySystem} entitySystem the entity system to retrieve from.
 * @param {Dictionary} layers the layers to add to.
 */
var PIXISystem = function (entitySystem, layers) {
	System.call(this);

	this._entitySystem = entitySystem;
	this._layers = layers;

	// Object with entity id as the key and an array of graphics.
	this._entityGraphics = {};
};
PIXISystem.prototype = Object.create(System.prototype);

function convertArguments(args) {
  return args.map(arg => {
    if (typeof arg === 'string') {
      if (arg[0] === '#') {
        if (arg === '#random') {
          return Math.floor(Math.random() * 0xFFFFFF);
        } else {
          return parseInt('0x' + arg.slice(1));
        }
      }
    }
    return arg;
  });
}

PIXISystem.prototype._createShape = function(entity, component) {
  // Create shape if provided
  let shapes = component.shapes;
  if (shapes.length > 0) {
    let graphics = new Graphics();
    for (let i = 0; i < shapes.length; i++) {
      let command = shapes[i][0];
      let args = convertArguments(shapes[i].slice(1));
      Object.getPrototypeOf(graphics)[command].apply(graphics, args);
    }
    this._entityGraphics[entity.id] = this._entityGraphics[entity.id] || [];
    if (component.isAntiAliased) {
      let texture = graphics.generateTexture();
      let sprite = new Sprite(texture);
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      this._layers[component.layer].addChild(sprite);
      this._entityGraphics[entity.id].push(sprite);
    } else {
      this._layers[component.layer].addChild(graphics);
      this._entityGraphics[entity.id].push(graphics);
    }
  }
};

PIXISystem.prototype.update = function (dt) {
	let entitySet = this._entitySystem.getEntities(ShapeComponent.type);

	// Create component
	entitySet.eachAdded((entity) => {
		let shapeComponent = this._entitySystem.getComponent(entity,
      ShapeComponent.type);
    if (shapeComponent) {
      this._createShape(entity, shapeComponent);
    }
	});

	// Update all components
	entitySet.each((entity) => {
		let shapeComponent = this._entitySystem.getComponent(entity,
      ShapeComponent.type);
		let spatial = this._entitySystem.getComponent(entity,
      SpatialComponent.type);
		let graphicsArray = this._entityGraphics[entity.id];
		if (spatial) {
			for (let i = 0; i < graphicsArray.length; i++) {
				let graphics = graphicsArray[i];
				graphics.x = spatial.position.x;
				graphics.y = spatial.position.y;
				graphics.scale.x = spatial.scale.x;
				graphics.scale.y = spatial.scale.y;
				graphics.rotation = spatial.rotation;
			}
		}
	});

	// Remove deleted components
	entitySet.eachRemoved((entity) => {
		let graphicsArray = this._entityGraphics[entity.id];
		for (let i = 0; i < graphicsArray.length; i++) {
			let graphics = graphicsArray[i];
			let parent = graphics.parent;
			if (parent) {
				parent.removeChild(graphics);
			}
		}
	});
};

export default PIXISystem;
