import { Product } from "./Product.mjs";
import { makeElement } from "../utility/makeElement.mjs";
import { CONFIG } from "./config.mjs";
import { apiInterface } from "./apiInterface.mjs";

/**
 * @class Subclass from Product - Create an only item of List Product from index page.
 * @name ProductItem
 * @classdesc Rends the products items to de DOM
 */

export class ProductItem extends Product {
  /**
   * @param { Object } prod The object with the product properties.
   */

  constructor(prod) {
    super(prod);
  }

  /**
   * @method render Create a DOM Element to show de products on the list of index.
   * @param { HTMLElement } container
   * @returns { HTMLElement }
   */

  render(container) {
    return makeElement(
      [
        "a",
        { href: CONFIG.PATH_PRODUCT + this._id },
        [
          "article",
          null,
          [
            ["img", { src: this.image, alt: this.altTxt }],
            ["h3", { class: "productName", content: this.name }],
            ["p", { class: "productDescription", content: this.description }],
          ],
        ],
      ],
      container
    );
  }

  /**
   * @static
   * @method load Show the list of all products in the home page.
   * @returns { void }
   */

  static async loadAll(container) {
    try {
      let data = await apiInterface.getProduct();

      data.forEach((el) => {
        let prodItem = new ProductItem({
          _id: el._id,
          image: el.image,
          altTxt: el.altTxt,
          name: el.name,
          description: el.description,
          price: el.price,
        });
        prodItem.render(container);
      });
    } catch (error) {
      makeElement(
        [
          "div",
          { style: "text-align: center;" },
          [
            "p",
            {
              content: `Desolé, un erreur est survenu. 
                  Veuillez réessayer ultérieurement: ${error}`,
              style: "text-align: center;",
            },
          ],
        ],
        container
      );
    }
  }
}
