/**
 *
 *
 *
 *  @mixin
 *  @name module:smolagaming-miu/mixins~Randable
 *  @param {*} SuperClass=class{} The class to mix onto.
 *  @returns {Randable} The mixed class.
 *
 *  @see Randable
 */
const Randable = (SuperClass = class { }) =>
  /**
   *
   *
   *  @class
   *  @alias Randable
   *  @param {object} options={}  An object containing options for this class,
   *                              as well as any other extending classes.
   *
   *  @see module:smolagaming-miu/mixins~Randable
   */
  class extends SuperClass {
    constructor({ ...superOpts } = {}) {
      super(superOpts);
    }


    /**
     * @param {Number} min
     * @param {Number} max
     */
    randInt(...args) {
      const [min, max] = this.#getMinMax(args);
      const diff = (max - min);
      const randomDiff = Math.floor(Math.random() * diff);

      return (min + randomDiff);
    }

    randFloat(...args) {
      const [min, max] = this.#getMinMax(args);
      const diff = (max - min);
      const randomDiff = Math.random() * diff;

      return (min + randomDiff);
    }


    #getMinMax(args) {
      let [min, max] = args;

      if (!max) {
        max = min;
        min = 0;
      }

      return [min, max];
    }
  };


export default Randable;
