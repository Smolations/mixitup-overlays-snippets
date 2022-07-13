/**
 *
 *
 *
 *  @mixin
 *  @name module:smolagaming-miu/mixins~Mixin
 *  @param {*} SuperClass=class{} The class to mix onto.
 *  @returns {Mixin} The mixed class.
 *
 *  @see Mixin
 */
const Mixin = (SuperClass = class {}) =>
  /**
   *  Using this mixin allows for ...
   *
   *  @class
   *  @alias _
   *  @param {object} options={}  An object containing options for this class,
   *                              as well as any other extending classes.
   *
   *  @see module:smolagaming-miu/mixins~Mixin
   */
  class extends SuperClass {
    /**
     * member
     */
    $mem;

    /**
     *  getter
     *  @type {}
     */
    get getter() {
    }


    constructor({ ...superOpts } = {}) {
      super(superOpts);
    }


    method() {
    }
  };


export default Mixin;
