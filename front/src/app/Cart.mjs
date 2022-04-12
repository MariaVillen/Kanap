import { apiInterface } from "./apiInterface.mjs";
import { CONFIG } from "./config.mjs";
import { CartItem } from "./CartItem.mjs";
import { modal } from "../utility/modal.mjs";

/**
 * @class
 * @name Cart
 * @descrition Manage the cart and localStorage
 */

export class Cart {
  /**
   * @property { Array.<Array> } cartList [private]- The List of Cart Items with localStorage and
   *  the Products data related.
   * @property { number } totalPrice [private] - The total price of the cart to pay.
   * @property { int } totalQuantity [private]- The total quantity of items to command.
   * @property { localCartInterface } localCart LocalStorage manager
   * @property { HTMLElement } container The container of the list of products
   */

  #cartList = [];
  #totalQuantity = 0;
  #totalPrice = 0;
  #priceList = [];
  container;

  /**
   * @param { HTMLElement } container The container where the items are loaded.
   * @param { array.<object> } cartList the list of the cart items.
   */

  constructor(container) {
    this.container = container;
    this.#cartList = JSON.parse(localStorage.getItem(CONFIG.LOCAL_CART)) || [];
  }

  /**
   *  @method sumTotalPriceAndQuantity to make adition of the total quantity and price of cart.
   *  @returns { array.<number,number> } returns the total quantity and total price.
   */

  sumTotalPriceAndQuantity = function () {
    if (this.#cartList === []) {
      this.#totalQuantity = this.#totalPrice = 0;
      this.#priceList = [];
    } else {
      this.#totalQuantity = this.#cartList.reduce(
        (a, b) => a + (parseInt(b.quantity) || 0),
        0
      );
      this.#totalPrice = this.#priceList.reduce(
        (a, b) => a + (parseInt(b.quantity) * parseInt(b.price) || 0),
        0
      );
    }
    return [this.#totalQuantity, this.#totalPrice];
  };

  /**
   * @method getProdIdToCommand Get the list of all the Id of the products to command.
   * @returns { Array.<string > } The list of the id.
   */

  getProdIdToOrder() {
    let myListToOrder = [];
    this.#cartList.forEach((el) => {
      myListToOrder.push(el.id);
    });
    return myListToOrder;
  }

  /**
   * @method add Add an item to the cart.
   * @param { string } id The product Id.
   * @param { string } Quantity
   * @param { string } color
   * @returns { void }
   */

  add(id, quantity, color) {
    console.log(this.#cartList);
    const isItemRepeated = this.#cartList.findIndex(
      (el) => el.id == id && el.color == color
    );
    console.log(isItemRepeated);
    if (isItemRepeated === -1) {
      this.#cartList.push({ id: id, quantity: quantity, color: color });
      localStorage.setItem(CONFIG.LOCAL_CART, JSON.stringify(this.#cartList));
    } else {
      this.#cartList[isItemRepeated].quantity += parseInt(quantity);
      localStorage.setItem(CONFIG.LOCAL_CART, JSON.stringify(this.#cartList));
    }
    modal("Produit ajouté au panier!");
  }

  /**
   * @method render Show the cart list on the DOM
   * @returns { array.<number,number> }
   */

  async render() {
    // get Ids of the products of the cart
    let myListOfProducts = this.getProdIdToOrder();

    try {
      let myItemList = await apiInterface.getSomeProducts(myListOfProducts);

      // Render Elements of Cart
      this.#cartList.forEach((element) => {
        let item = myItemList.find((prod) => element.id === prod._id);

        let myItemCart = new CartItem({
          _id: element.id,
          quantity: element.quantity,
          color: element.color,
          image: item.image,
          name: item.name,
          description: item.description,
          altTxt: item.altTxt,
          price: item.price,
        });

        this.#priceList.push({
          id: element.id,
          quantity: element.quantity,
          price: item.price,
        });
        myItemCart.render(this.container);
      });
      return this.sumTotalPriceAndQuantity();
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * @method modifyQuantity Modify the quantity of a product item on the cart.
   * @param { string } id The ID of the product to modify.
   * @param { string } color The color of the product to modify.
   * @param { string } newValue The new quantity.
   * @returns { array.<number,number> } } returns new total price and quantity.
   */

  modifyQuantity(id, color, newValue) {
    // Modify localStorage
    let index = this.#cartList.findIndex(
      (el) => el.id == id && el.color == color
    );
    if (index >= 0) {
      this.#priceList[index].quantity = this.#cartList[index].quantity =
        newValue;
      localStorage.setItem(CONFIG.LOCAL_CART, JSON.stringify(this.#cartList));
      return this.sumTotalPriceAndQuantity();
    } else {
      modal("Erreur: L'objet à modifier n'existe plus");
    }
  }

  /**
   * @method deleteCartItem Deletes an product from the cart
   * @param {string} id The Id of the product to delete
   * @param {string} color The color of the product to delete.
   * @returns {array.<number,number>} returns un array with the total quantity and total price of the cart.
   */

  deleteCartItem(id, color) {
    // Erasing form localStorage
    let index = this.#cartList.findIndex(
      (el) => el.id == id && el.color == color
    );
    if (index >= 0) {
      this.#cartList.splice(index, 1);
      this.#priceList.splice(index, 1);
      localStorage.setItem(CONFIG.LOCAL_CART, JSON.stringify(this.#cartList));
      return this.sumTotalPriceAndQuantity();
    } else {
      modal("Le produit n'a été pas trouvé");
    }
  }

  /**
   * @method reset Reset the list of cart items from the cart and from de localstorage.
   * @returns { void }
   */

  reset() {
    localStorage.removeItem(CONFIG.LOCAL_CART);
    this.#priceList = this.#cartList = [];
  }

  /**
   * @method isEmpty Indicates if the cart is empty or not.
   * @returns {Boolean} True if empty, false if not.
   */

  isEmpty() {
    return this.#cartList.length === 0;
  }
}
