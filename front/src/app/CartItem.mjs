
import { makeElement } from "../utility/makeElement.mjs";
import { Product } from "./Product.mjs";
/**
 * @class 
 * @name CartItem
 * @classdesc Create an HTMLElement Item of the Cart with a template and manage the item
 * @prop { Array.< Array.< string, object, array > > } template Item Cart Template of HTMLElement
 */

 export class CartItem extends Product {

    /**
     * @param { Product } item - Product data.
     */
  
    constructor( prod ) {

      super( prod );

      this.color =  prod.color;
      this.quantity = prod.quantity;

      this.template = 
      ["article",{ class: "cart__item", "data-id": this._id, "data-color": this.color },[   
            ["div", { class: "cart__item__img" },
                ["img", { src: this.image, alt: this.altTxt }]
            ],
            ["div", { class: "cart__item__content" },[
              [ "div", { class: "cart__item__content__titlePrice" },[
                  ["h2", { content: this.name }],
                  ["p", { content: this.price + " €" }]]
              ],
              ["div", { class: "cart__item__content__settings" }, [
                  [ "div", { class: "cart__item__content__settings__quantity" }, [
                      ["p", { content: "Qté:" }],
                      ["input", {
                          type: "number",
                          class: "itemQuantity",
                          name: "itemQuantity",
                          min: "1",
                          max: "100",
                          value: this.quantity,
                        }]]
                  ],
                  ["div", { class: "cart__item__content__settings__delete" },
                    ["p", { class: "deleteItem", content: "Supprimer" }],
                  ]]
             ]]]]];
        }

   /**
   * @method render - Create a new element CartItem and render it to the cart.
   * @param { HTMLElement } container - HTMLElemet where to render the cart item.
   * @returns { void }
   */

  render( container ) {

    makeElement( this.template, container );

  }
 
}