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

 export function makeElement ( template, container ) {

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
  