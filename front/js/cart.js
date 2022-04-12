/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/Cart.mjs":
/*!**************************!*\
  !*** ./src/app/Cart.mjs ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cart": () => (/* binding */ Cart)
/* harmony export */ });
/* harmony import */ var _apiInterface_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apiInterface.mjs */ "./src/app/apiInterface.mjs");
/* harmony import */ var _config_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.mjs */ "./src/app/config.mjs");
/* harmony import */ var _CartItem_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CartItem.mjs */ "./src/app/CartItem.mjs");
/* harmony import */ var _utility_modal_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utility/modal.mjs */ "./src/utility/modal.mjs");





/**
 * @class
 * @name Cart
 * @descrition Manage the cart and localStorage
 */

class Cart {
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
    this.#cartList = JSON.parse(localStorage.getItem(_config_mjs__WEBPACK_IMPORTED_MODULE_1__.CONFIG.LOCAL_CART)) || [];
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
      localStorage.setItem(_config_mjs__WEBPACK_IMPORTED_MODULE_1__.CONFIG.LOCAL_CART, JSON.stringify(this.#cartList));
    } else {
      this.#cartList[isItemRepeated].quantity += parseInt(quantity);
      localStorage.setItem(_config_mjs__WEBPACK_IMPORTED_MODULE_1__.CONFIG.LOCAL_CART, JSON.stringify(this.#cartList));
    }
    (0,_utility_modal_mjs__WEBPACK_IMPORTED_MODULE_3__.modal)("Produit ajouté au panier!");
  }

  /**
   * @method render Show the cart list on the DOM
   * @returns { array.<number,number> }
   */

  async render() {
    // get Ids of the products of the cart
    let myListOfProducts = this.getProdIdToOrder();

    try {
      let myItemList = await _apiInterface_mjs__WEBPACK_IMPORTED_MODULE_0__.apiInterface.getSomeProducts(myListOfProducts);

      // Render Elements of Cart
      this.#cartList.forEach((element) => {
        let item = myItemList.find((prod) => element.id === prod._id);

        let myItemCart = new _CartItem_mjs__WEBPACK_IMPORTED_MODULE_2__.CartItem({
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
      localStorage.setItem(_config_mjs__WEBPACK_IMPORTED_MODULE_1__.CONFIG.LOCAL_CART, JSON.stringify(this.#cartList));
      return this.sumTotalPriceAndQuantity();
    } else {
      (0,_utility_modal_mjs__WEBPACK_IMPORTED_MODULE_3__.modal)("Erreur: L'objet à modifier n'existe plus");
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
      localStorage.setItem(_config_mjs__WEBPACK_IMPORTED_MODULE_1__.CONFIG.LOCAL_CART, JSON.stringify(this.#cartList));
      return this.sumTotalPriceAndQuantity();
    } else {
      (0,_utility_modal_mjs__WEBPACK_IMPORTED_MODULE_3__.modal)("Le produit n'a été pas trouvé");
    }
  }

  /**
   * @method reset Reset the list of cart items from the cart and from de localstorage.
   * @returns { void }
   */

  reset() {
    localStorage.removeItem(_config_mjs__WEBPACK_IMPORTED_MODULE_1__.CONFIG.LOCAL_CART);
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


/***/ }),

/***/ "./src/app/CartItem.mjs":
/*!******************************!*\
  !*** ./src/app/CartItem.mjs ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CartItem": () => (/* binding */ CartItem)
/* harmony export */ });
/* harmony import */ var _utility_makeElement_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utility/makeElement.mjs */ "./src/utility/makeElement.mjs");
/* harmony import */ var _Product_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Product.mjs */ "./src/app/Product.mjs");



/**
 * @class
 * @name CartItem
 * @classdesc Create an HTMLElement Item of the Cart with a template and manage the item
 * @prop { Array.< Array.< string, object, array > > } template Item Cart Template of HTMLElement
 */

class CartItem extends _Product_mjs__WEBPACK_IMPORTED_MODULE_1__.Product {
  /**
   * @param { Product } item - Product data.
   */

  constructor(prod) {
    super(prod);
    this.color = prod.color;
    this.quantity = prod.quantity;
    this.template = [
      "article",
      { class: "cart__item", "data-id": this._id, "data-color": this.color },
      [
        [
          "div",
          { class: "cart__item__img" },
          ["img", { src: this.image, alt: this.altTxt }],
        ],
        [
          "div",
          { class: "cart__item__content" },
          [
            [
              "div",
              { class: "cart__item__content__titlePrice" },
              [
                ["h2", { content: this.name }],
                ["p", { content: this.price + " €" }],
              ],
            ],
            [
              "div",
              { class: "cart__item__content__settings" },
              [
                [
                  "div",
                  { class: "cart__item__content__settings__quantity" },
                  [
                    ["p", { content: "Qté:" }],
                    [
                      "input",
                      {
                        type: "number",
                        class: "itemQuantity",
                        name: "itemQuantity",
                        min: "1",
                        max: "100",
                        value: this.quantity,
                      },
                    ],
                  ],
                ],
                [
                  "div",
                  { class: "cart__item__content__settings__delete" },
                  ["p", { class: "deleteItem", content: "Supprimer" }],
                ],
              ],
            ],
          ],
        ],
      ],
    ];
  }
  /**
   * @method render - Create a new element CartItem and render it to the cart.
   * @param { HTMLElement } container - HTMLElemet where to render the cart item.
   * @returns { void }
   */
  render(container) {
    (0,_utility_makeElement_mjs__WEBPACK_IMPORTED_MODULE_0__.makeElement)(this.template, container);
  }
}


/***/ }),

/***/ "./src/app/Contact.mjs":
/*!*****************************!*\
  !*** ./src/app/Contact.mjs ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Contact": () => (/* binding */ Contact)
/* harmony export */ });
/**
 * @class
 * @name Contact
 * @classdesc Contains and validate the contact for the command order.
 */

class Contact {
  firstName;
  lastName;
  address;
  city;
  email;

  /**
   * @method Validate Verify that the input values are correct
   * @param { string } champ The name of the input value ( id )
   * @param { string } value The value of the input
   * @returns { object { champ, result } } Return an object with the input id and
   * if the value is validated, returns true, else returns an error message.
   */

  validate(champ, value) {
    if (!value) {
      return { champ: champ, result: "Le champ est vide." };
    }
    let re;
    let errorMessage;
    switch (champ) {
      case "firstName":
      case "lastName":
        re = /^[A-zÀ-ú' -]*$/;
        errorMessage =
          'Seulement sont permis les lettres de l\'alphabet et "." et "-".';
        break;
      case "address":
        re = /(^[0-9]{1,} )?[^\s-][A-zÀ-ú,' \-.]{2,}/;
        errorMessage =
          "L'adresse doit être une adresse dans le format français valide.";
        break;
      case "city":
        re = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
        errorMessage =
          "Seulement sont permis les lettres de l'alphabet et \".-'\" sont aussi valides.";
        break;
      case "email":
        re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        errorMessage =
          "Email invalide. Exemple d'email valide: joeDoe@mail.com";
        break;
    }
    let myValidator = new RegExp(re);
    if (myValidator.test(value)) {
      this[champ] = value;
      return { champ: champ, result: true };
    } else {
      this[champ] = false;
      return { champ: champ, result: errorMessage };
    }
  }

  /**
   * @method getContact Get the contact data validated
   * @returns { object || false } Returns the contact data if are valid, if not, returns false.
   */

  getContact() {
    if (
      this.firstName &&
      this.lastName &&
      this.address &&
      this.city &&
      this.email
    ) {
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        address: this.address,
        city: this.city,
        email: this.email,
      };
    } else {
      return false;
    }
  }
}


/***/ }),

/***/ "./src/app/Product.mjs":
/*!*****************************!*\
  !*** ./src/app/Product.mjs ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Product": () => (/* binding */ Product)
/* harmony export */ });
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

class Product {
  /**
   * @param { Object } prod The object with the values of the properties.
   */

  constructor(prod) {
    this._id = prod._id;

    this.image = prod.image;

    this.altTxt = prod.altTxt;

    this.price = +prod.price;

    this.description = prod.description;

    this.name = prod.name;
  }
}


/***/ }),

/***/ "./src/app/apiInterface.mjs":
/*!**********************************!*\
  !*** ./src/app/apiInterface.mjs ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "apiInterface": () => (/* binding */ apiInterface)
/* harmony export */ });
/* harmony import */ var _config_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.mjs */ "./src/app/config.mjs");


/**
 * @Object
 * @name apiComunication
 * @description Api communication manager.
 */

const apiInterface = {
  /**
   * @function getProduct Fetch from API all the products or only one single product.
   * @param { string } id Optional - The Id of the product to fetch. Default is all products.
   * @returns { Array.<object> || object } Return the products or an array of products
   */
  getProduct: async (id = "") => {
    return await fetch(_config_mjs__WEBPACK_IMPORTED_MODULE_0__.CONFIG.API_URL + id).then((response) => {
      if (!response.ok) {
        throw new Error(response.status + ": " + response.statusText);
      } else {
        return response.json().then((data) => {
          let listOfProduct;
          if (Array.isArray(data)) {
            listOfProduct = [];

            data.forEach((el) => {
              listOfProduct.push({
                _id: el._id,
                image: el.imageUrl,
                altTxt: el.altTxt,
                price: el.price,
                description: el.description,
                name: el.name,
                colors: el.colors,
              });
            });
          } else {
            listOfProduct = {
              _id: data._id,
              image: data.imageUrl,
              altTxt: data.altTxt,
              price: data.price,
              description: data.description,
              name: data.name,
              colors: data.colors,
            };
          }
          return listOfProduct;
        });
      }
    });
  },

  /**
   * @method getSomeProducts Returns an array of several products
   * determinated by the ID's list.
   * @param { array.<string> } idList the id of the products to request
   * @returns { array.<object> } returns a list of products objects
   */

  getSomeProducts: async (idList) => {
    let myGetList = [];
    for (let i in idList) {
      myGetList.push(
        fetch(_config_mjs__WEBPACK_IMPORTED_MODULE_0__.CONFIG.API_URL + idList[i]).then((response) => {
          if (!response.ok) {
            throw new Error(response.status + ": " + response.statusText);
          } else {
            return response.json();
          }
        })
      );
    }

    return Promise.all(myGetList)
      .then((data) => {
        let listOfProduct = [];
        data.forEach((el) => {
          listOfProduct.push({
            _id: el._id,
            image: el.imageUrl,
            altTxt: el.altTxt,
            price: el.price,
            description: el.description,
            name: el.name,
            colors: el.colors,
          });
        });
        return listOfProduct;
      })
      .catch((err) => {
        throw new Error(err);
      });
  },

  /**
   * @function sendOrder Send the command order of products.
   * @param myCommand Object {contact:Array.<string>, list:Array.<string>}
   * @returns { string}  returns the command number.
   */

  sendOrder: async (myCommand) => {
    return await fetch(_config_mjs__WEBPACK_IMPORTED_MODULE_0__.CONFIG.API_URL + "order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myCommand),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status + ": " + response.statusText);
      } else {
        return response.json().then((data) => {
          return data.orderId;
        });
      }
    });
  },
};


/***/ }),

/***/ "./src/app/config.mjs":
/*!****************************!*\
  !*** ./src/app/config.mjs ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CONFIG": () => (/* binding */ CONFIG)
/* harmony export */ });
/* Configuration Data */
/**
 * @Object
 * @name CONFIG
 * @Description Sets de main parameters for all the website.
 */

const CONFIG = {
  API_URL: "http://localhost:3000/api/products/",

  PATH_NAME_COMMAND: "/front/html/confirmation.html",

  PATH_PRODUCT: "./product.html?id=",

  LOCAL_CART: "Kanap",
};


/***/ }),

/***/ "./src/utility/makeElement.mjs":
/*!*************************************!*\
  !*** ./src/utility/makeElement.mjs ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makeElement": () => (/* binding */ makeElement)
/* harmony export */ });
/**
 * @function 
 * @name makeElement
 * @description create un HTMLElement with a given template.
 * @param { Array.< String, ?Object, ?Array } template The object Template.
 * @example ['a', {href: 'http:google.es', content: 'google'},
 *              ['p',{content: "mi parrafo"}, ['span', {content: 'my child'}]]
 *          ]
 * @param { HTMLElement } container The container where we append the element.
 * @returns { HTMLElement } The new element created with the given template.
 */

 function makeElement ( template, container ) {

  let myElementCreated = container;

  // If the third element of the array is only one array, then add [] because the third element is really an array of 
  // possible childs.
  // Example: {'p', null, ['span']} => {'p', null, [['span']]}

  if ( typeof template[ 0 ] === "string" ) {
    template = [ template ];
  }

  let domElement;

  template.forEach( ( el ) => {
    if ( typeof el[ 0 ] === "string") {
      domElement = document.createElement( el[ 0 ] );
      if ( myElementCreated ) {
        myElementCreated.appendChild( domElement );
      } else {
        myElementCreated = domElement;
      }
    }

    if ( typeof el[ 1 ] == "object" ) {
      for (let prop in el[ 1 ]) {
        switch ( prop ) {

          case "class":
            let myListClass = el[ 1 ].class;
            if ( Array.isArray( el[ 1 ].class ) ) {
              myListClass = el[ 1 ].class.join(",");
            }
            domElement.classList.add( myListClass );
            break;

          case "content":
            domElement.textContent = el[ 1 ].content;
            break;

          default:
            domElement.setAttribute(prop, el[ 1 ][ prop ]);
        }
      }
    }

    if ( Array.isArray( el[ 2 ] ) ) {
      if ( el[ 2 ].length == 1 ) {
        el[ 2 ] = [ el[ 2 ] ];
      }
      makeElement( el[ 2 ], domElement );
    }

  } );
  return myElementCreated;
}
  

/***/ }),

/***/ "./src/utility/modal.mjs":
/*!*******************************!*\
  !*** ./src/utility/modal.mjs ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "modal": () => (/* binding */ modal)
/* harmony export */ });
/* harmony import */ var _makeElement_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./makeElement.mjs */ "./src/utility/makeElement.mjs");


/**
 * @function 
 * @name modal 
 * @description Creates a modal windows for information purposes.
 * @param { string } message The message to show in the modal.
 * @param {function} cb  The callback function to execute when click on Ok button.
 * @retuns { void }
 */

function modal ( message, cb = () => {} ) {

  let template = [
    "div",
    {
      class: "modal",
      style: `position: fixed; 
               width: 100%; 
               height: 100%;
               display: inline-flex;
               background: transparent;
               align-items: center;
               justify-content: center;
               top: 0;`,
    },
    [
      "div",
      {
        style: `background: white;
              color: black;
              padding: 1em;
              box-shadow: 1px 1px 8px 2px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 80%;
              `,
      },
      [
        [
          "p",
          {
            content: message,
            style: `
      padding-bottom: 1em;
      `,
          },
        ],
        [
          "button",
          {
            content: "Ok",
            style: `
      background: #3498db;
      color: white;
      padding: 0.5em 2em;
      border: NONE;
      BORDER-RADIUS: 3PX;
      text-align: center;
      `,
          },
        ],
      ],
    ],
  ];
  let myModal = (0,_makeElement_mjs__WEBPACK_IMPORTED_MODULE_0__.makeElement)( template );
  document.getElementsByTagName( "body" )[ 0 ].appendChild( myModal );
  myModal.addEventListener( "click", ( e ) => {
    e.preventDefault();
    e.target.closest( ".modal" ).remove();
    cb();
  });
}


/***/ }),

/***/ "./src/utility/utility.mjs":
/*!*********************************!*\
  !*** ./src/utility/utility.mjs ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getURLparam": () => (/* binding */ getURLparam)
/* harmony export */ });

/**
 * @Function
 * @name getURLparam
 * @description Returns the value of a given parameter of a URL.
 * @param { string } param The name of the parameter.
 * @returns { string || false } Returns the value if exits, if not returns false.
 */

function getURLparam ( param ) {

    const url = new URL( window.location.href );

    const search_params = new URLSearchParams( url.search );

    return ( search_params.has( param ) ) ? search_params.get( param ) || "" : false;

};



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/cart.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utility_makeElement_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utility/makeElement.mjs */ "./src/utility/makeElement.mjs");
/* harmony import */ var _utility_modal_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utility/modal.mjs */ "./src/utility/modal.mjs");
/* harmony import */ var _app_Cart_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/Cart.mjs */ "./src/app/Cart.mjs");
/* harmony import */ var _app_Contact_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/Contact.mjs */ "./src/app/Contact.mjs");
/* harmony import */ var _app_apiInterface_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app/apiInterface.mjs */ "./src/app/apiInterface.mjs");
/* harmony import */ var _utility_utility_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utility/utility.mjs */ "./src/utility/utility.mjs");







/**
 * @class
 * @name CartApp
 * @classdesc Manage the Cart and Confirmation page
 */

class CartApp {
  /**
   * @property { HTMLElement } itemCartContainer - Element that contains the list of cart products.
   * @property { HTMLElement } totalQuantity - Element that show the total quantity of products.
   * @property { HTMLElement } totalPrice - Element that show the total price of products.
   * @property { HTMLElement } contactForm - Form to add the contact information.
   * @property { Cart } cart
   * @property { Contact } contact
   */

  static itemCartContainer = document.getElementById("cart__items");
  static totalQuantity = document.getElementById("totalQuantity");
  static totalPrice = document.getElementById("totalPrice");
  static contactForm = document.getElementsByClassName("cart__order__form")[0];
  static cart = new _app_Cart_mjs__WEBPACK_IMPORTED_MODULE_2__.Cart(this.itemCartContainer);
  static contact = new _app_Contact_mjs__WEBPACK_IMPORTED_MODULE_3__.Contact();

  /**
   * @method init static - Initiate the js of the cart/confirmation page
   * @returns { void }
   */

  static init() {
    const orderId = (0,_utility_utility_mjs__WEBPACK_IMPORTED_MODULE_5__.getURLparam)("command");

    if (orderId) {
      document.getElementById("orderId").textContent = orderId;
      return;
    } else if (orderId === "") {
      window.location.href = "./index.html";
    } else {
      try {
        this.load();

        //Adding event change quantity of product
        this.itemCartContainer.addEventListener("change", (event) => {
          this.modifyCartItem(event);
        });

        //Adding event delete product from cart
        this.itemCartContainer.addEventListener("click", (event) => {
          this.removeCartItem(event);
        });

        //Adding event change and validate form's inputs
        this.contactForm.addEventListener("input", (event) => {
          event.preventDefault();
          const validation = this.contact.validate(
            event.target.id,
            event.target.value
          );
          if (validation.result === true) {
            document.getElementById(validation.champ + "ErrorMsg").textContent =
              "";
          } else {
            document.getElementById(validation.champ + "ErrorMsg").textContent =
              validation.result;
          }
        });

        //Adding event submit order form
        this.contactForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.submitCart();
        });
      } catch (err) {
        (0,_utility_modal_mjs__WEBPACK_IMPORTED_MODULE_1__.modal)(
          "Desolé, un erreur est survenu. Veuillez réessayer ultérieurement."
        );
        console.log(err);
      }
    }
  }

  /**
   * @method load static - Load the carts products items.
   * @returns { void }
   */

  static async load() {
    // The cart don't have products to show.

    if (this.cart.isEmpty()) {
      this.itemCartContainer.appendChild(
        (0,_utility_makeElement_mjs__WEBPACK_IMPORTED_MODULE_0__.makeElement)([
          "p",
          {
            content: "Votre panier est vide.",
            style: "text-align: center; font-size: 2em; padding: 2em;",
          },
        ])
      );
      this.totalQuantity.textContent = 0;
      this.totalPrice.textContent = 0;
    }
    // Load the products to show
    try {
      const [totalQuantity, totalPrice] = await this.cart.render();
      this.totalQuantity.textContent = totalQuantity;
      this.totalPrice.textContent = totalPrice;
    } catch (err) {
      (0,_utility_modal_mjs__WEBPACK_IMPORTED_MODULE_1__.modal)(
        "Desolé, un erreur est survenu. Veuillez réessayer ultérieurement."
      );
      console.log(err);
    }
  }

  /**
   * @method modifyCartItem static - Modify the quantity of the cart product
   * @param { EventListenerObject } event - Event Object.
   * @returns { void }
   */

  static modifyCartItem(event) {
    const id = event.target.closest("article").getAttribute("data-id");
    const color = event.target.closest("article").getAttribute("data-color");
    const quantity = parseInt(event.target.value);
    // Quantity validation
    if (quantity < 1) {
      (0,_utility_modal_mjs__WEBPACK_IMPORTED_MODULE_1__.modal)("La quantité à commander ne peut pas être inferieur a 1");
      return;
    } else if (quantity > 100) {
      (0,_utility_modal_mjs__WEBPACK_IMPORTED_MODULE_1__.modal)("La quantité à commander ne peut pas être superieur a 100");
      return;
    }
    // Change quantity
    const [totalQuantity, totalPrice] = this.cart.modifyQuantity(
      id,
      color,
      quantity
    );
    // Change new total value and quantity on DOM
    this.totalQuantity.textContent = totalQuantity;
    this.totalPrice.textContent = totalPrice;
  }

  /**
   * @method removeCartItem Static - Remove a product element from the cart.
   * @param { EventListenerObject } event
   * @returns { void }
   */
  static removeCartItem(event) {
    if (event.target.classList.contains("deleteItem")) {
      const item = event.target.closest("article");
      const id = item.getAttribute("data-id");
      const color = item.getAttribute("data-color");
      // Erase from localStorage the item
      const [totalQuantity, totalPrice] = this.cart.deleteCartItem(id, color);
      item.remove();
      // Add new price and quantity on DOM
      this.totalQuantity.textContent = totalQuantity;
      this.totalPrice.textContent = totalPrice;
      // Cart without products after remove.
      if (this.cart.isEmpty()) {
        this.itemCartContainer.appendChild(
          (0,_utility_makeElement_mjs__WEBPACK_IMPORTED_MODULE_0__.makeElement)([
            "p",
            {
              content: "Votre panier est vide",
              style: "text-align: center; font-size: 2em; padding: 2em;",
            },
          ])
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
    const listToCommand = this.cart.getProdIdToOrder();
    // There are no products in cart.
    if (listToCommand.length == 0) {
      (0,_utility_modal_mjs__WEBPACK_IMPORTED_MODULE_1__.modal)("Vous n'avez pas de produits à commander", () => {
        window.location.href = "./index.html";
      });
    } else {
      // Create Order Object
      const myCommand = {
        contact: this.contact.getContact(),
        products: listToCommand,
      };
      // Send order
      try {
        let commandNumber = await _app_apiInterface_mjs__WEBPACK_IMPORTED_MODULE_4__.apiInterface.sendOrder(myCommand);
        if (commandNumber) {
          // Delete Cart and localStorage.
          this.cart.reset();
          window.location.href = "./confirmation.html?command=" + commandNumber;
        } else {
          throw new Error("Order Fail");
        }
      } catch (error) {
        (0,_utility_modal_mjs__WEBPACK_IMPORTED_MODULE_1__.modal)(
          "Desolé, un erreur est survenu. Veuillez réessayer ultérieurement."
        );
        console.log(error);
      }
    }
  }
}

window.onload = CartApp.init();

})();

/******/ })()
;
//# sourceMappingURL=cart.js.map