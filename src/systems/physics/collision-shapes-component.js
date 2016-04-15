"use strict";

import Component from '../../core/component';

class CollisionShapesComponent extends Component {
  constructor(params) {
    super();

    this.shapes = [];

    this.setParams(params);
  }

  setParams(params) {
    if (params) {
      if (params.shapes) {
        let shapes = [];
        for (let i = 0; i < params.shapes.length; ++i) {
          let shape = params.shapes[i];
          let shapeData = {};
          for (let key in shape) {
            if (!shape.hasOwnProperty(key)) continue;
            shapeData[key] = shape[key];
          }
          shapes.push(shapeData);
        }
      }
    }
  }
}
CollisionShapesComponent.type = 'CollisionShapesComponent';

export default CollisionShapesComponent;
