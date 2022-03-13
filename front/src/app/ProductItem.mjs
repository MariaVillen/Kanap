import { Product } from "./Product.mjs";
import { makeElement } from "../utility/makeElement.mjs";
import { CONFIG } from "./config.mjs";

/**
 * @class Subclass from Product - Create an only item of List Product from index page.
 * @name ProductItem
 * @classdesc Rends the products items to de DOM
 */

export class ProductItem extends Product {

  /** 
   * @param { Object } prod The object with the product properties.
   */

  constructor( prod ) {

    super( prod );

  }

  /**
   * @method render Create a DOM Element to show de products on the list of index.
   * @param { HTMLElement } container
   * @returns { HTMLElement } 
   */

  render( container ) {

    return makeElement(

      [
        "a",
        { href: CONFIG.PATH_PRODUCT + this._id },
        [
          "article",
          null,
          [
            [ "img", { src: this.image, alt: this.altTxt } ],
            [ "h3", { class: "productName", content: this.name } ],
            [ "p", { class: "productDescription", content: this.description } ],
          ],
        ],
      ],

      container

    );

  }

}