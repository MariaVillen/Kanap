/**
 * @class Superclass
 * @name Product
 * @classdesc It sets the properties of the products.
 * @property { string } _id The Id of the product
 * @property { string } image The URL of the image product
 * @property { string } altTxt The alternative text of the image product
 * @property { number } price The price of the product
 * @property { string } description A description of the product
 * @property { string } name Name of the product
 */

export class Product {

  /**
   * @param { Object } prod The object with the values of the properties.
   */

  constructor ( prod ) {

    this._id = prod._id;

    this.image = prod.image;

    this.altTxt = prod.altTxt;

    this.price = prod.price;

    this.description = prod.description;

    this.name = prod.name;

  }
}
