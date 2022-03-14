import { CONFIG } from "./app/config.mjs";
import { makeElement } from "./utility/makeElement.mjs";
import { modal } from "./utility/modal.mjs";
import { Cart } from "./app/Cart.js";
import { Contact } from "./app/Contact.mjs";
import { apiInterface } from "./app/apiInterface.mjs";
import { getURLparam } from "./utility/utility.mjs";

/**
 * @class 
 * @name CartApp 
 * @classdesc Manage the Cart and Confirmation page
 */

class CartApp {

  /**
   * @property { string } localCartName - The name of the localSorage for the cart.
   * @property { HTMLElement } itemCartContainer - Element that contains the list of cart products.
   * @property { HTMLElement } totalQuantity - Element that show the total quantity of products.
   * @property { HTMLElement } totalPrice - Element that show the total price of products.
   * @property { HTMLElement } contactForm - Form to add the contact information.
   * @property { Cart } cart
   * @property { Contact } contact
   */

  static localCartName = CONFIG.LOCAL_CART;
  static itemCartContainer = document.getElementById( "cart__items" );
  static totalQuantity = document.getElementById( "totalQuantity" );
  static totalPrice = document.getElementById( "totalPrice" );
  static contactForm = document.getElementsByClassName( "cart__order__form" )[ 0 ];
  static cart = new Cart( this.itemCartContainer );
  static contact = new Contact();
  
  /**
   * @method init static - Initiate the js of the cart/confirmation page
   * @returns { void }
   */
 
  static init() {
  
    const orderId = getURLparam( "command" );
  
    if ( orderId ) {
  
      document.getElementById( "orderId" ).textContent = orderId;
      return;
  
    } else if ( orderId === "" ) {
  
      window.location.href = "./index.html";
  
    } else {
  
      try {

        this.load();

        //Adding event change quantity of product
        this.itemCartContainer.addEventListener( "change", ( event ) => {

          this.modifyCartItem( event );

        });

        //Adding event delete product from cart
        this.itemCartContainer.addEventListener( "click", ( event ) => {

          this.removeCartItem( event );

        });

        //Adding event change and validate form's inputs
        this.contactForm.addEventListener( "input", ( event ) => {

          event.preventDefault();

          const validation = this.contact.validate (
            event.target.id,
            event.target.value
          );

          if ( validation.result === true ) {

            document.getElementById( validation.champ + "ErrorMsg" ).textContent ="";

          } else {

            document.getElementById( validation.champ + "ErrorMsg" ).textContent =
              validation.result;

          }

        });

        //Adding event submit order form
        this.contactForm.addEventListener( "submit", async ( event ) => {

          event.preventDefault();
          event.stopPropagation();
          this.submitCart();

        });

      } catch ( err ) {

        modal( "Desolé, un erreur est survenu. Veuillez réessayer ultérieurement." );
        console.log( err );

      }

    }

  }

  /**
   * @method load static - Load the carts products items.
   * @returns { void }
   */

  static async load() {

    // The cart don't have products to show.

    if ( this.cart.isEmpty() ) {

      this.itemCartContainer.appendChild (

        makeElement( [
          "p",{
            content: "Votre panier est vide.",
            style: "text-align: center; font-size: 2em; padding: 2em;",}
        ] )
        
      );

      this.totalQuantity.textContent = 0;
      this.totalPrice.textContent = 0;

    }

    // Load the products to show

    try {

      let result = await this.cart.render();

      this.totalQuantity.textContent = result.quantity;
      this.totalPrice.textContent = result.price;

    } catch ( err ) {

      modal( "Desolé, un erreur est survenu. Veuillez réessayer ultérieurement." );
      console.log( err );

    }

  }

  /**
   * @method modifyCartItem static - Modify the quantity of the cart product
   * @param { EventListenerObject } event - Event Object. 
   * @returns { void }
   */

  static modifyCartItem( event ) {

    const id = event.target.closest( "article" ).getAttribute( "data-id" );
    const color = event.target.closest( "article" ).getAttribute( "data-color" );
    const quantity = parseInt( event.target.value );

    // Quantity validation
    if ( quantity < 1 ) {

      modal("La quantité à commander ne peut pas être inferieur a 1");
      return;

    } else if ( quantity > 100 ) {

      modal("La quantité à commander ne peut pas être superieur a 100");
      return;

    }

    // Change quantity
    let total = this.cart.modifyQuantity( id, color, quantity );

    // Change new total value and quantity on DOM
    this.totalQuantity.textContent = total.quantity;
    this.totalPrice.textContent = total.price;

  }

  /**
   * @method removeCartItem Static - Remove a product element from the cart.
   * @param { EventListenerObject } event 
   * @returns { void }
   */

  static removeCartItem( event ) {

    if (event.target.classList.contains( "deleteItem" )) {

      const item = event.target.closest( "article" );
      const id = item.getAttribute( "data-id" );
      const color = item.getAttribute( "data-color" );

      // Erase from localStorage the item
      const total = this.cart.deleteCartItem( id, color );
      item.remove();

      // Add new price and quantity on DOM
      this.totalQuantity.textContent = total.quantity;
      this.totalPrice.textContent = total.price;

      // Cart without products after remove.
  
      if ( this.cart.isEmpty() ) {

        this.itemCartContainer.appendChild(
          makeElement( [
            "p", { content: "Votre panier est vide",
                   style: "text-align: center; font-size: 2em; padding: 2em;"}
          ] )
        );
      }
    }
  }

  /**
   * @method submitCart - Add the product to the cart / localStorage.
   * @returns { void }
   */

  static async submitCart() {
  
    // Get the ID list of products to order
    
    const listToCommand = this.cart.localCart.getProdIdToOrder();


    // There are no products in cart.

    if ( listToCommand.length == 0 ) {

      modal( "Vous n'avez pas de produits à commander", () => {

        window.location.href = "./index.html";

      } );

    } else {
      
      // Create Order Object
      const myCommand = {

        contact: this.contact.getContact(),
        products: listToCommand,

      };

      // Send order
      try {

        let commandNumber = await apiInterface.sendOrder(myCommand);

        if ( commandNumber ) {

        // Delete Cart and localStorage.
        this.cart.localCart.reset();

        window.location.href =
          "./confirmation.html?command=" + commandNumber;

        } else {

          throw new Error ( "Order Fail" );

        } 

      } catch ( error ) {
        
        modal( "Desolé, un erreur est survenu. Veuillez réessayer ultérieurement."
        );
        console.log( error );
      
      }
    }
  }
}

window.onload = CartApp.init();
