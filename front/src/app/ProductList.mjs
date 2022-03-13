import { makeElement } from "../utility/makeElement.mjs";
import { apiInterface } from "./apiInterface.mjs";
import { ProductItem } from "./ProductItem.mjs";

/**
 * @class
 * @name ProductList
 * @classdesc Show the List of Products on the Index page
 */

export class ProductList {

    list = [];

  /** 
   * @param { HTMLElement } container The Dom Element where we render the list. 
   */

  constructor( container = document.getElementById( "items" ) ) {

    this.container = container;

  }

  /**
   * @method load Show the list in the DOM.
   * @returns { void }
   */

  async load() {

    try {

      let data = await apiInterface.getProduct();
      
      data.forEach( ( el ) => {

        let prodItem = new ProductItem(
    
          {_id: el._id,
          image: el.image,
          altTxt: el.altTxt,
          name: el.name,
          description: el.description,
          price: el.price}

        );

        prodItem.render( this.container );

      });
    
    } catch ( error ) {
    
        makeElement (
        
          [
            "div", { style: "text-align: center;" },
            [ "p", {
                  content: `Desolé, un erreur est survenu. 
                  Veuillez réessayer ultérieurement: ${error}`,
                  style: "text-align: center;",
              },
            ],
          ],

        this.container
        
      );
    }
  }
}
