"use strict";

import System from '../../core/system';
import ShapeComponent from './shape-component';
import SpatialComponent from '../spatial-component';

function getShapeFunction(graphics, op) {
	switch (op) {
		case "arc":
		case "arcTo":
		case "beginFill":
		case "bezierCurveTo":
		case "clear":
		case "destroy":
		case "drawCircle":
		case "drawEllipse":
		case "drawPolygon":
		case "drawRect":
		case "drawRoundedRect":
		case "drawShape":
		case "endFill":
		case "generateTexture":
		case "getBounds":
		case "getChildAt":
		case "getChildIndex":
		case "getLocalBounds":
		case "lineStyle":
		case "lineTo":
		case "moveTo":
		case "quadraticCurveTo":
	}
}

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

PIXISystem.prototype.update = function (dt) {
	let entitySet = this._entitySystem.getEntities(ShapeComponent.type);

	// Create components
	entitySet.eachAdded((entity) => {
		let shapeComponent = entity.getComponent(ShapeComponent.type);

		// Create shape if provided
		var shapes = shapeComponent.shapes;
		if (shapes.length > 0) {
			let graphics = new PIXI.Graphics();
			for (let i = 0; i < shapes.length; i++) {
				let command = shapes[i];
				
				graphics[command[0]].apply(graphics, command);
			}
			this._layers[shapeComponent.layer].addChild(graphics);
			this._entityGraphics[entity.id] = this._entityGraphics[entity.id] || [];
			this._entityGraphics.push(graphics);
		}
	});

	// Update all components
	entitySet.each((entity) => {
		let shapeComponent = entity.getComponent(ShapeComponent.type);
		let spatial = entity.getComponent(SpatialComponent.type);
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
