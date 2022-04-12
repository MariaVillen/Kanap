/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/app/ProductItem.mjs":
/*!*********************************!*\
  !*** ./src/app/ProductItem.mjs ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProductItem": () => (/* binding */ ProductItem)
/* harmony export */ });
/* harmony import */ var _Product_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Product.mjs */ "./src/app/Product.mjs");
/* harmony import */ var _utility_makeElement_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utility/makeElement.mjs */ "./src/utility/makeElement.mjs");
/* harmony import */ var _config_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.mjs */ "./src/app/config.mjs");
/* harmony import */ var _apiInterface_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./apiInterface.mjs */ "./src/app/apiInterface.mjs");





/**
 * @class Subclass from Product - Create an only item of List Product from index page.
 * @name ProductItem
 * @classdesc Rends the products items to de DOM
 */

class ProductItem extends _Product_mjs__WEBPACK_IMPORTED_MODULE_0__.Product {
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
    return (0,_utility_makeElement_mjs__WEBPACK_IMPORTED_MODULE_1__.makeElement)(
      [
        "a",
        { href: _config_mjs__WEBPACK_IMPORTED_MODULE_2__.CONFIG.PATH_PRODUCT + this._id },
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
      let data = await _apiInterface_mjs__WEBPACK_IMPORTED_MODULE_3__.apiInterface.getProduct();

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
      (0,_utility_makeElement_mjs__WEBPACK_IMPORTED_MODULE_1__.makeElement)(
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
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_ProductItem_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/ProductItem.mjs */ "./src/app/ProductItem.mjs");


window.onload = _app_ProductItem_mjs__WEBPACK_IMPORTED_MODULE_0__.ProductItem.loadAll(document.getElementById("items"));

})();

/******/ })()
;
//# sourceMappingURL=script.js.map