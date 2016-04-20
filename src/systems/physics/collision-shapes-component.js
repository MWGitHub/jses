"use strict";

import Component from '../../core/component';

class CollisionShapesComponent extends Component {
  constructor(params) {
    super();

    /**
     * Array of shape objects in the forms of
     * Circle: {
     * 	type: "circle",
     * 	radius: number
     * }
     * @type {Array}
     */
    this.shapes = [];

    this.setParams(params);
  }

  setParams(params) {
    if (params) {
      this.shapes = JSON.parse(JSON.stringify(params.shapes));
    }
  }
}
CollisionShapesComponent.type = 'CollisionShapesComponent';

export default CollisionShapesComponent;
