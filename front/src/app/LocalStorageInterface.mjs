
import { CONFIG } from "./config.mjs";
import { modal } from "../utility/modal.mjs";

/**
 * @class 
 * @name LocalStorageInterface
 * @Classdesc Communication between Cart and Product Detail. Manage of LocalStorage.
 */

 export class LocalStorageInterface {

  /**
   * @param { string } localCartName The name of the localStorage item.
   * @param { Array.<object> } cartList The list of products added to the cart.
   */

  constructor( localCartName = CONFIG.LOCAL_CART ) {

    this.localCartName = localCartName;
    this.cartList = JSON.parse( localStorage.getItem( this.localCartName ) ) || [];  
  
  }

  /**
   * @method search Look for the index of a product with a given color and id.
   * @param { string } id
   * @param { string } color
   * @returns { number } return the index of the product with the color and id.
   */
  
  search( id, color ) {

    return this.cartList.findIndex(

      ( element ) => element.id == id && element.color == color

    );

  }

  /**
   * @method add Add an item to the cart.
   * @param { string } id The product Id.
   * @param { string } Quantity
   * @param { string } color
   * @returns { Array } cartList - the total list of products in the cart.
   */

  add ( id, quantity, color ) {

  const isItemRepeated = this.search( id, color );

  if ( isItemRepeated === -1 ) {

    this.cartList.push( { id: id, quantity: quantity, color: color } );
    localStorage.setItem( this.localCartName, JSON.stringify( this.cartList ) );

  } else {

    this.cartList[ isItemRepeated ].quantity += parseInt( quantity );
    localStorage.setItem( this.localCartName, JSON.stringify( this.cartList ) );

  }

  modal( "Produit ajouté au panier!" );
  
  return this.cartList;

}
  
  /**
  * @method remove Remove an item with a given Id and color.
  * @param { string } id
  * @param { string } color
  * @returns { Array || void } cartList - list of cart items. 
  */
  
  remove( id, color ) {

    let indexObject = this.search( id, color );
  
    if ( indexObject != -1 ) {

      this.cartList.splice( indexObject, 1 );

      localStorage.setItem( this.localCartName, JSON.stringify( this.cartList ) );
      return this.cartList;

    } else {

      modal( "Le produit n'a été pas trouvé" );

    }
  }
  
  /**
   * @method modify Modify the quantity of an item.
   * @param { string } id
   * @param { string } color
   * @param { string } quantity New value of quantity.
   * @returns { void }
   */
  
  modify( id, color, quantity ) {

    let index = this.search( id, color );
  
    if ( index != -1 ) {

      let cartItemToModify = this.cartList[ index ];

      cartItemToModify.quantity = quantity;
      localStorage.setItem( this.localCartName, JSON.stringify( this.cartList ) );

    } else {

      modal( "Erreur: L'objet à modifier n'existe plus" );

    }
  }

  /**
   * @method reset Reset the list of cart items from the cart and from de localstorage.
   * @returns { void }
   */

  reset() {

    localStorage.removeItem( this.localCartName );
    this.cartList = [];

  }

  /**
   * @method getProdIdToCommand Get the list of all the Id of the products to command.
   * @returns { Array.< string > } The list of the id.
   */

  getProdIdToOrder(){

    let myListToOrder = [];

    this.cartList.forEach( ( el ) => {

      myListToOrder.push( el.id );

    });

    return myListToOrder;

  }

}
  