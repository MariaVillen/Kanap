import { apiInterface } from "./app/apiInterface.mjs";
import { LocalStorageInterface } from "./app/LocalStorageInterface.mjs";
import { modal } from "./utility/modal.mjs";
import { getURLparam } from "./utility/utility.mjs";


/**
 * @class ProductApp
 * @description Manage the logic of the Product Detail page.
 */

class ProductApp {

  /**
   * @property { Object } container - All HTMLElements to output information.
   * @property { Object } item - Product to load by ID.
   */

  static container = {
    image: document.querySelector( ".item__img" ),
    name: document.getElementById( "title" ),
    price: document.getElementById( "price" ),
    description: document.getElementById( "description" ),
    colors: document.getElementById( "colors" ),
    quantity: document.getElementById( "quantity" ),
  };

  static item;

  /**
   * @method init Static - Initializate de js of page.
   * @returns { void }
   */

  static init() {

    /* Check if there is an Product Id */
    const idProduct = getURLparam( "id" );
    
    if ( idProduct ) {

      this.load( idProduct );

    } else {
      
      modal( "Le produit n'a pas été spécifié. Veuillez choisir un produit",
             () => { window.location.href = "./index.html"; }
      );

    }
  }

  /**
   * @method load static Load the product data
   * @param { string } idProduct The id number of the product passed on the URL. 
   * @returns { void }
   */

  static async load( idProduct ) {

    try {

      /* Loading Product from api */
      this.item = await apiInterface.getProduct( idProduct );

      /* Adding information to page */
      this.container.image.innerHTML = `<img src="${ this.item.image }" alt="${ this.item.altTxt }">`;
      this.container.name.textContent = this.item.name;
      this.container.price.textContent = this.item.price;
      this.container.description.textContent = this.item.description;
      this.container.quantity.value = 1;

      this.item.colors.forEach( ( el ) => {
        this.container.colors.innerHTML += `<option value="${ el }">${ el }</option>`;
      });

      // Event submit form
      document.getElementById( "addToCart" ).addEventListener( "click", ( event ) => {
        event.preventDefault(); 
        this.submit();
      } );

    } catch ( error ) {
      
      console.log( error );

      modal(
        "Desolé, un erreur est survenu. Veuillez réessayer ultérieurement",
        () => { window.location.href = "./index.html"; }
      );

    }

  }

  /**
   * @method submit Check entries and submit product to localStorage cart.
   * @returns {void}
   */

  static submit() {

      const quantity = parseInt( this.container.quantity.value );

      if ( quantity < 1 ) {

        modal( "La quantité à commander ne peut pas être inferieur a 1" );
        return;

      } else if ( quantity > 100 ) {

        modal( "La quantité à commander ne peut pas être superieur a 100" );
        return;

      }

      if ( !this.container.colors.value ) {

        modal( "Vous devez choisir une couleur" );
        return;
    
      }

      // Adding product to Cart
      const myCart = new LocalStorageInterface();

      myCart.add( this.item._id, quantity, this.container.colors.value );

  }
  
}

window.onload = ProductApp.init();
