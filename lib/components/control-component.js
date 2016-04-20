"use strict";

import Component from '../../src/core/component';

class ControlComponent extends Component {
  constructor(params) {
    super();

    /**
     * Velocity to set when moving.
     * @type {{x: Number, y: Number}}
     */
    this.velocity = {
      x: 0,
      y: 0
    };

    this.setParams(params);
  }

  setParams(params) {
    this.merge(params);
  }
}
ControlComponent.type = 'ControlComponent';

export default ControlComponent;
