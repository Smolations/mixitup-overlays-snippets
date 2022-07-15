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
    mounted = false;


    get rect() {
      return this.$el[0].getBoundingClientRect();
    }

    get $childrenContainer() {
      return this.$el;
    }


    constructor({ ...superOpts } = {}) {
      super(superOpts);
    }


    /**
     * mainly for use _after_ initial render.
     */
    addChild(...components) {
      components.forEach((component) => {
        component.parent = this;
        this.children.push(component);
      });
      return this;
    }

    /**
     * used in render() so chain can function properly
     */
    append(component) {
      this.$childrenContainer.append(component.$el);
      return this;
    }

    /**
     * used in render() so chain can function properly
     */
    prepend(component) {
      this.$childrenContainer.prepend(component.$el);
      return this;
    }

    // set or get the value of a css variable on the root
    // element of a component (i.e. $el)
    var(name, value) {
      // optional validation?
      if (this.vars && !this.vars[varName]) {
        console.error('varName %o not recognized!', varName);
        return;
      } else if (typeof(value) !== 'undefined') {
        this.$el.css(name, value);
      }

      return this.$el.css(name);
    }


    /**
     * Renders the component into the DOM.
     *
     * ideally this would be great, but not all grid cells have
     * rendered in the normal render flow so things like
     * this.rect won't be accurate at this point. probably ideal to render
     * the Page as early as possible, then add panels later..
     *
     * @param {Component} parentComponent The parent into which this component should render.
     * @param {Boolean} [prepend=false] Whether the element should be prepended or
     *                                  appended to the `parent`.
     */
    render(parentComponent, prepend = false) {
      const op = prepend ? 'prepend' : 'append';
      const parent = parentComponent || this.parent;
      const parentIsJquery = !!parent.jquery;

      // only for Page should this accept a jquery object
      if (!parentIsJquery && !parent.$el) {
        throw new Error('Component render() must be passed a parent!');
      }

      // this accounts for late child adds, but not child removals, but
      // that might be fine for most purposes..
      if (!this.mounted) {
        // now children can access the parent if necessary. should be
        // careful not to create any specific deps on parents though..
        if (parentIsJquery) {
          this.parent = { $el: parent };
          parent[op](this.$el);
        } else {
          this.parent = parent;
          parent[op](this);
        }
      }

      // remove all children and re-render. not sure if this will
      // ever result in weirdness since most page actions are one-and-done.
      this.children.length && this.$childrenContainer.empty();

      // the order of these is likely going to have an impact down the line..
      // for example, what do re-renders look like?
      // console.log('%oing into %o: %o', op, parentComponent.$el, this.$el)
      this.children.forEach((child) => child.render(this));

      this.mounted = true;
    }
  };


export default Component;
