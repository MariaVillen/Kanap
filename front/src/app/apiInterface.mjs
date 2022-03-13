import { CONFIG } from "./config.mjs";

/**
 * @Object 
 * @name apiComunication 
 * @description Api communication manager.
 */

export const apiInterface = {

  /**
   * @function getProduct Fetch from API all the products or only one single product.
   * @param { string } id Optional - The Id of the product to fetch. Default is all products.
   * @returns { Array.<object> || object } Return the products or an array of products
   */

  getProduct: async ( id = "" ) => {
 
    return await fetch( CONFIG.API_URL + id ).then( 
 
      ( response ) => {
 
        if ( !response.ok ) {
 
          throw new Error ( response.status + ": " + response.statusText );
 
        } else {
 
          return response.json().then( ( data ) => {
            let listOfProduct;

            if ( Array.isArray( data ) ){
            
              listOfProduct = [];
              
              data.forEach( ( el ) => {
                listOfProduct.push( {
                  _id: el._id,
                  image: el.imageUrl,
                  altTxt: el.altTxt,
                  price: el.price,
                  description: el.description,
                  name: el.name,
                  colors: el.colors
                } 
              );
            });
          } else { 
            listOfProduct = {
              _id: data._id,
              image: data.imageUrl,
              altTxt: data.altTxt,
              price: data.price,
              description: data.description,
              name: data.name,
              colors: data.colors
            }}

            return listOfProduct;
          
          });
 
        }
      }
    );
  },

  /**
   * @method getSomeProducts Returns an array of several products
   * determinated by the ID's list.
   * @param { array.<string> } idList the id of the products to request
   * @returns { array.<object> } returns a list of products objects
   */

  getSomeProducts: async ( idList ) => {

    let myGetList = [];

    for ( let i in idList ) {
    
      myGetList.push(
    
        fetch( CONFIG.API_URL + idList[i] ).then( ( response ) => {
    
          if ( !response.ok ) {

            throw new Error( response.status + ": " + response.statusText );
          
          } else {
          
            return response.json();
          
          }
        })
      );
    }

    return Promise.all( myGetList )
      .then(
        ( data ) => {
          let listOfProduct = [];

          data.forEach( ( el ) => {

            listOfProduct.push( {
              _id: el._id,
              image: el.imageUrl,
              altTxt: el.altTxt,
              price: el.price,
              description: el.description,
              name: el.name,
              colors: el.colors
            } );

          } )

          return listOfProduct;

        } )
      .catch( ( err ) => {
        throw new Error ( err );
      } );
  },

  /**
   * @function sendOrder Send the command order of products.
   * @param myCommand Object {contact:Array.<string>, list:Array.<string>} 
   * @returns { string}  returns the command number.
   */

  sendOrder: async ( myCommand ) => {

    return await fetch( CONFIG.API_URL + "order", {

      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify( myCommand ),

    } ).then( 

      ( response ) => { 

      if ( !response.ok ) {
      
        throw new Error( response.status + ": " + response.statusText );
      
      } else {
      
        return response.json().then( ( data ) => {
          return data.orderId;
        });
      
      }

    });
  },
};
