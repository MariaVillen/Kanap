import { makeElement } from "./makeElement.mjs";

/**
 * @function 
 * @name modal 
 * @description Creates a modal windows for information purposes.
 * @param { string } message The message to show in the modal.
 * @param {function} cb  The callback function to execute when click on Ok button.
 * @retuns { void }
 */

export function modal ( message, cb = () => {} ) {

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
  let myModal = makeElement( template );
  document.getElementsByTagName( "body" )[ 0 ].appendChild( myModal );
  myModal.addEventListener( "click", ( e ) => {
    e.preventDefault();
    e.target.closest( ".modal" ).remove();
    cb();
  });
}
