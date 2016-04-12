"use strict";

import Component from '../../src/core/component';

class GameObjectComponent extends Component {
  constructor(params) {
    super();

    this.isRemovedOnBounds = false;

    this.isBound = false;

    // this.setParams(params);
  }
}
GameObjectComponent.type = 'GameObjectComponent';

export default GameObjectComponent;
