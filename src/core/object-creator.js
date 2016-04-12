"use strict";

/**
 * @typedef ComponentStore
 * @type Object
 * @property {Component} cls the class of the component
 * @property {Function(Entity, Component)=} preSet the callback to run before component is created.
 * @property {Function(Entity, Component)=} postSet the callback to run after component is created.
 */

/**
 * Creates objects from blueprints and copies existing objects.
 * Format for blueprints and data is
 * {
 * 	components: {
 * 		... component data
 * 	}
 * }
 */
class ObjectCreator {
  /**
   * Initializes the object creator.
   * @param  {EntitySystem} entitySystem the system to use for creating entities.
   */
  constructor(entitySystem) {
    this._entitySystem = entitySystem;

    /**
     * Stores components.
     * @type {ComponentStore}
     */
    this._componentStore = {};
    this._blueprints = {};
  }

  /**
   * Adds a component and specific ways to generate the component if provided.
   * @param {String} name the name of the component.
   * @param {Component} cls the component class.
   * @param {Function(Entity, Component)=} preSet the callback that runs before component creation.
   * @param {Function(Entity, Component)=} postSet the callback that runs after component creation.
   */
  addComponent(name, cls, preSet, postSet) {
    this._componentStore[name] = {
      cls: cls,
      preSet: preSet,
      postSet: postSet
    };
  }

  /**
   * Stores a blueprint of an object for creation through keys.
   * @param  {String} key  the key to store as.
   * @param  {Object} data the data to use as the blueprint.
   */
  storeBlueprint(key, data) {
    this._blueprints[key] = data;
  }

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

  /**
   * Creates a component from the blueprint store.
   * @param  {String} key the key of the blueprint.
   * @return {Entity}     the created entity.
   */
  createFromBlueprint(key) {
    let data = this._blueprints[key];
    if (!data) throw new Error('No key with "' + key + '" found');

    let entity = this.createFromData(data);
    if (!entity.type) {
      entity.type = key;
    }

    return entity;
  }
}

export default ObjectCreator;
