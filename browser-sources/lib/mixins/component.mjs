/**
 *
 *
 *
 *  @mixin
 *  @name module:smolagaming-miu/mixins~Configable
 *  @param {*} SuperClass=class{} The class to mix onto.
 *  @returns {Component} The mixed class.
 *
 *  @see Component
 */
const Component = (SuperClass = class {}) =>

  /**
   *  Using this mixin allows for an instance to become a component
   *
   *  @class
   *  @alias Component
   *  @param {object} options={}  An object containing options for this class,
   *                              as well as any other extending classes.
   *
   *  @see module:smolagaming-miu/mixins~Component
   */
  class extends SuperClass {
    $el;
    children = [];

    /**
     *  Returns the jquery element for the component.
     *  @type {jquery}
     */
    get $el() {
      if (!this.$el) {
        throw new Error('Component instance must add its own $el!');
      }
    }

    get rect() {
      return this.$el[0].getBoundingClientRect();
    }

    get $childrenContainer() {
      return this.$el;
    }


    constructor({ ...superOpts } = {}) {
      super(superOpts);

      // not entirely sure i want all components acting like an array,
      // though it does seem convenient at this point. unfortunately
      // const _this = this;
      // const arrayAccessorProxySpec = {
      //   get(target, prop, receiver) {
      //     if (prop in target) {
      //       return Reflect.get(target, prop, receiver);
      //     } else {
      //       return target._children[prop];
      //     }
      //   }
      // }

      // return new Proxy(this, arrayAccessorProxySpec);
    }

    addChild(...components) {
      components.forEach((component) => {
        component.parent = this;
        this.children.push(component);
      });
    }

    append(component) {
      this.$childrenContainer.append(component.$el);
    }

    prepend(component) {
      this.$childrenContainer.prepend(component.$el);
    }
    // push(component) {
    //   this.
    // }


    /**
     *  Renders the component into the DOM.
     *
     * // should there be a display:none characteristic to this? or should
     * this method just append to the parent?
     *   - start with latter, maybe do former?
     *
     * @param {Component} parentComponent The parent into which this component should render.
     * @param {Boolean} [prepend=false] Whether the element should be prepended or
     *                                  appended to the `parent`.
     */
    render(parentComponent, prepend = false) {
      const op = prepend ? 'prepend' : 'append';
      const parentIsJquery = !!parentComponent.jquery;

      // only for Page should this accept a jquery object
      if (!parentIsJquery && !parentComponent.$el) {
        throw new Error('Component render() must be passed a parent!');
      }

      // now children can access the parent if necessary. should be
      // careful not to create any specific deps on parents though..
      if (parentIsJquery) {
        this.parent = { $el: parentComponent };
        parentComponent[op](this.$el);
      } else {
        this.parent = parentComponent;
        parentComponent[op](this);
      }

      // the order of these is likely going to have an impact down the line..
      // for example, what do re-renders look like?
      // console.log('%oing into %o: %o', op, parentComponent.$el, this.$el)
      this.children.forEach((child) => child.render(this));
    }
  };


export default Component;
