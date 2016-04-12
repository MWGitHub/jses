"use strict";

import System from '../../src/core/system';
import Input from '../../src/core/input';
import ControlComponent from '../components/control-component';
import MovementComponent from '../../src/systems/physics/movement-component';

class ControlSystem extends System {
  constructor(entitySystem, input) {
    super();

    this._entitySystem = entitySystem;
    this._input = input;

    this._input.addHotkey(Input.charToKeyCode('W'), 'up');
    this._input.addHotkey(Input.CharCodes.Up, 'up');
    this._input.addHotkey(Input.charToKeyCode('D'), 'right');
    this._input.addHotkey(Input.CharCodes.Right, 'right');
    this._input.addHotkey(Input.charToKeyCode('S'), 'down');
    this._input.addHotkey(Input.CharCodes.Down, 'down');
    this._input.addHotkey(Input.charToKeyCode('A'), 'left');
    this._input.addHotkey(Input.CharCodes.Left, 'left');
  }

  update(dt) {
    let set = this._entitySystem.getEntities(ControlComponent.type);

    set.each(entity => {
      let control = entity[ControlComponent.type];
      let movement = entity[MovementComponent.type];
      if (this._input.keysDown.up) {
        movement.speed.y = -control.velocity.y;
      }
      if (this._input.keysDown.right) {
        movement.speed.x = control.velocity.x;
      }
      if (this._input.keysDown.down) {
        movement.speed.y = control.velocity.y;
      }
      if (this._input.keysDown.left) {
        movement.speed.x = -control.velocity.x;
      }
    });

  }
}

export default ControlSystem;
