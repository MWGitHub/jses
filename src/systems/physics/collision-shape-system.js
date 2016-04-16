"use strict";

import System from '../../core/system';
import CollisionShapesComponent from './collision-shapes-component';
import Circle from './geometries/circle';

class CollisionShapeSystem extends System {
  constructor(entitySystem) {
    super();

    this._entitySystem = entitySystem;

    this._entityShapes = {};
  }

  _addEntity(entity, component) {
    let shapesComponent = entity[CollisionShapesComponent.type];
    let shapes = shapesComponent.shapes;
    for (let i = 0; i < shapes.length; ++i) {
      let shapeData = shapes[i];
      let shape = null;
      switch (shapeData.type) {
        case 'circle':
          shape = new Circle({
            radius: shapeData.radius
          });
          break;
      }
      this._entityShapes[entity.id] = this._entityShapes[entity.id] || [];
      if (shape) {
        this._entityShapes[entity.id].push(shape);
      }
    }
  }

  update(dt) {
    let set = this._entitySystem.getEntities(CollisionShapesComponent.type);

    set.eachAdded(this._addEntity.bind(this));
  }
}

export default CollisionShapeSystem;
