/**
 *
 *
 *
 *  @mixin
 *  @name module:smolagaming-miu/mixins~Logable
 *  @param {*} SuperClass=class{} The class to mix onto.
 *  @returns {Logable} The mixed class.
 *
 *  @see Logable
 */
const Logable = (SuperClass = class {}) =>
  /**
   *  Using this mixin allows for ...
   *
   *  @class
   *  @alias _
   *  @param {object} options={}  An object containing options for this class,
   *                              as well as any other extending classes.
   *
   *  @see module:smolagaming-miu/mixins~Logable
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


    log(firstArg, ...args) {
      const finalArgs = [...args];

      if (typeof (firstArg) === 'string') {
        finalArgs.unshift(`[${this.constructor.name}] ${firstArg}`);
      } else {
        finalArgs.unshift(`[${this.constructor.name}]`, firstArg);
      }
      console.log(...finalArgs);
    }
  };


export default Logable;
