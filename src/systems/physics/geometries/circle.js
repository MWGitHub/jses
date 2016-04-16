import Geometry from '../geometry';

class Circle extends Geometry {
  constructor(options) {
    super(options);

    this.radius = options.radius || 1.0;
  }
}

export default Circle;
