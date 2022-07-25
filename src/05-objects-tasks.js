/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(w, h) {
  this.width = w;
  this.height = h;
  this.getArea = () => this.width * this.height;
}
/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(o) {
  return JSON.stringify(o);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(p, j) {
  return Object.setPrototypeOf(JSON.parse(j), p);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelectorBuilder {
  constructor(o) {
    this.s = '';
    this.o = o || 0;
  }

  checkOrder(o) {
    if (this.o > o) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
      );
    }

    this.o = o;
  }

  checkUnique(v) {
    if (new RegExp(v).test(this.s)) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector',
      );
    }
  }

  element(v) {
    this.checkOrder(1);
    this.checkUnique('^[A-Za-z]');
    this.s += v;

    return this;
  }

  id(v) {
    this.checkOrder(2);
    this.checkUnique('#');
    this.s += `#${v}`;

    return this;
  }

  class(v) {
    this.checkOrder(3);
    this.s += `.${v}`;

    return this;
  }

  attr(v) {
    this.checkOrder(4);
    this.s += `[${v}]`;

    return this;
  }

  pseudoClass(v) {
    this.checkOrder(5);
    this.s += `:${v}`;

    return this;
  }

  pseudoElement(v) {
    this.checkOrder(6);
    this.checkUnique('::');
    this.s += `::${v}`;

    return this;
  }

  stringify() {
    return this.s;
  }
}

const cssSelectorBuilder = {
  element(v) {
    return new CssSelectorBuilder(1).element(v);
  },

  id(v) {
    return new CssSelectorBuilder(2).id(v);
  },

  class(v) {
    return new CssSelectorBuilder(3).class(v);
  },

  attr(v) {
    return new CssSelectorBuilder(4).attr(v);
  },

  pseudoClass(v) {
    return new CssSelectorBuilder(5).pseudoClass(v);
  },

  pseudoElement(v) {
    return new CssSelectorBuilder(6).pseudoElement(v);
  },

  combine(s1, b, s2) {
    return new CssSelectorBuilder().element(
      `${s1.stringify()} ${b} ${s2.stringify()}`,
    );
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
