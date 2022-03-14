
import { apiInterface } from "./apiInterface.mjs";
import { LocalStorageInterface } from "./LocalStorageInterface.mjs";
import { CONFIG } from "./config.mjs";
import { CartItem } from "./CartItem.mjs";

/**
 * @class
 * @name Cart
 * @descrition Manage all the cart
 */
 
export class Cart {

  /**
   * @property { Array.<Array> } cartList [private]- The List of Cart Items with localStorage and
   *  the Products data related.
   * @property { int } totalPrice [private] - The total price of the cart to pay.
   * @property { int } totalQuantity [private]- The total quantity of items to command.
   * @property { localCartInterface } localCart LocalStorage manager
   * @property { HTMLElement } container The container of the list of products
   */

    #cartList = new Array( 0 );
    #totalQuantity = 0; 
    #totalPrice = 0;
    container;
 
    /**
     * @param { HTMLElement } container The container where to load de items
     * @param { string } cartName the name of the localStorage.
     */
  
    constructor( container, cartName = CONFIG.LOCAL_CART ) {

      this.container = container;
      this.localCart = new LocalStorageInterface( cartName );

    }
  
    /**
     *  @method sumTotalPriceAndQuantity to make adition of the total quantity and price of cart.
     *  @returns { Object: { quantity{ number }, price{ number } } }
     */
  
    sumTotalPriceAndQuantity = function () {

      if ( this.#cartList === [] ) {

        this.#totalQuantity = this.#totalPrice = 0;

      } else {

        this.#totalQuantity = this.#cartList.reduce(
          ( a, b ) => a + ( parseInt( b.quantity ) || 0),
          0
        );

        this.#totalPrice = this.#cartList.reduce(
          ( a, b ) => a + ( ( parseInt( b.quantity ) * parseInt( b.price ) ) || 0),
          0
        );
      }

    return { quantity: this.#totalQuantity, price: this.#totalPrice };

    };
  
    /**
    * @method render Show the cart list on the DOM
    * @returns { void }
    */
  
    async render() {

      // get Ids of the products of the cart
      let myListOfProducts = this.localCart.getProdIdToOrder();

      // Load api products
      
      try {

        let myItemList = await apiInterface.getSomeProducts( myListOfProducts ); 


        // Render Elements of Cart
        this.localCart.cartList.forEach( ( element ) => {

          let item = myItemList.find( ( prod ) => element.id === prod._id );

          let myItemCart = new CartItem ( 
            {_id: element.id, 
              quantity: element.quantity,
              color: element.color,
              image: item.image,
              name: item.name,
              description: item.description,
              altTxt: item.altTxt,
              price: item.price} 
          );

          this.#cartList.push( myItemCart );

          myItemCart.render( this.container );
        
        } );
      
       // Show total Price and Quantity
 
        return this.sumTotalPriceAndQuantity();
       
      } catch(err) {
          throw new Error (err);
      }
    }

  
    /**
     * @method modifyQuantity Modify the quantity of a product item on the cart.
     * @param { string } id The ID of the product to modify.
     * @param { string } color The color of the product to modify.
     * @param { string } newValue The new quantity.
     * @returns { Object: { quantity, price } } returns new total price and quantity.
     */
  
    modifyQuantity( id, color, newValue ) {

      // Modify localStorage

      this.localCart.modify( id, color, newValue );

      let index = this.#cartList.findIndex( ( el ) => ( el._id == id && el.color == color ) );

      if ( index >= 0 ) {

        this.#cartList[ index ].quantity = newValue;

      }

      return this.sumTotalPriceAndQuantity();

    }

    /**
     * @method deleteCartItem Deletes an product from the cart
     * @param {string} id The Id of the product to delete
     * @param {string} color The color of the product to delete.
     * @returns {Object} returns un object {quantity, price}
     */
  
    deleteCartItem( id, color ) {

      // Erasing form localStorage
      this.localCart.remove( id, color );

      let index = this.#cartList.findIndex(
        ( el ) => ( el._id == id && el.color == color )
      );
  
      if ( index >= 0 ) {
        this.#cartList.splice( index, 1 );
      }

      return this.sumTotalPriceAndQuantity();

    }

    isEmpty() {
      return this.localCart.cartList.length===0;
    }
  }