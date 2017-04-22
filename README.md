# JSES

JSES is a framework for creating interactive applications. It uses a composition based architecture with entities, components, and systems to handle logic. The framework comes with optional systems that can be used, the main ones being a rendering system and a physics system.

Check out some examples at [mwgithub.github.io/jses](https://mwgithub.github.io/jses)

### Balls Example:

![balls]

### Technical Details:
* JSES uses a composition based architecture by having entities be pure data objects living in an entity system. An entity system is the hub for retrieving entities by sets. The sets are then iterated through by systems, which operate on each individual entity within the set. Having an entity as pure data allows them to be constructed with JSON, allowing behaviors to be changed without having to write code. The loader to construct the entities can be seen below.

```
/**
 * Creates an entity from JSON data.
 * @param  {Object}   data the data to create with.
 * @return {Entity}        the created entity.
 */
createFromData(data) {
  let entity = this._entitySystem.createEntity();

  // Copy non component setup data into the entity.
  for (let key in data) {
      if (!data.hasOwnProperty(key)) continue;

      if (key === 'components') continue;

      entity[key] = data[key];
  }

  // Set values of components.
  let components = data.components;
  for (let objectKey in components) {
      if (!components.hasOwnProperty(objectKey)) continue;

      let componentData = components[objectKey];
      let storedComponent = this._componentStore[objectKey];
      if (!storedComponent) continue;

      let ComponentClass = storedComponent.cls;

      let type = ComponentClass.type;
      // Create or update component as needed.
      let component = entity[type];
      if (!component) {
          component = new ComponentClass(componentData);
      } else {
          component.setParams(componentData);
      }
      // Run the pre component creation callback
      if (storedComponent.preSet) {
        storedComponent.preSet(entity, component);
      }

      this._entitySystem.setComponent(entity, type, component);

      if (storedComponent.postSet) {
        storedComponent.postSet(entity, component);
      }
  }

  return entity;
}
```

* Such an entity can be operated on by systems, such as the physics system which handles the addition, updating, and removal of entities so the 'world' can operate on them.

```
_addBody(entity) {
  let bodyComponent = entity[RigidBodyComponent.type];
  if (!bodyComponent) return;
  let rigidBody = new RigidBody({
    entity: entity,
    spatial: entity[SpatialComponent.type],
    body: bodyComponent
  });
  this._addShape(entity, rigidBody);
  this._entityBodies[entity.id] = this._entityBodies[entity.id] || [];
  this._entityBodies[entity.id].push(rigidBody);
  this._world.add(rigidBody);
}

_remove(entity) {
  let bodies = this._entityBodies[entity.id];
  if (!bodies) return;

  for (let i = 0; i < bodies.length; ++i) {
    this._world.remove(bodies[i]);
  }

  delete this._entityBodies[entity.id];
}

update(dt) {
  let set = this._entitySystem.getEntities(RigidBodyComponent.type);
  set.eachAdded(this._addBody.bind(this));
  set.eachRemoved(this._remove.bind(this));

  this._world.step(dt);
}
```

### Features
* Compositional architecture, reducing coupling and encouraging reusability
* State machine to switch between groups of logic
* Input with mouse, keyboard, hotkeys, and gamepad support
* Rendering system using WebGL and Pixi.js, abstracting away knowledge of the libraries used
* Physics system for handling collision detection and resolution
* Object creator that reads JSON and composes an entity for rapid prototyping
* Camera with rotation, scaling, and movement

### To-Do:
* [ ] Add more examples
* [ ] Support sprites
* [ ] Show debug shapes
* [ ] Support polygon collisions
* [ ] Add broad phase collision detection

[balls]: ./docs/images/balls-demo.png
