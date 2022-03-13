
  /**
   * @class 
   * @name Contact
   * @classdesc Contains and validate the contact for the command order.
   */
  
   export class Contact {

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
  
    validate( champ, value ) {

      let re;
      let errorMessage;
  
      switch ( champ ) {

        case "firstName":

        case "lastName":

          re = /^[A-zÀ-ú' -]*$/;

          errorMessage =
            'Seulement sont permis les lettres de l\'alphabet et "." et "-".';
         
          break;
  
        case "address":

          re = /(^[0-9]{1,} )?[^\s-][A-zÀ-ú,' \-.]{2,}/;

          errorMessage = "L'adresse doit être une adresse dans le format français valide.";

          break;
  
        case "city":

          re = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;

          errorMessage = "Seulement sont permis les lettres de l\'alphabet et \".-'\" sont aussi valides.";
          
          break;
  
        case "email":

          re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

          errorMessage = "Email invalide. Exemple d'email valide: joeDoe@mail.com";

          break;
      }

      let myValidator = new RegExp( re );
  
      if ( myValidator.test( value ) ) {

        this[ champ ] = value;
        return { champ: champ, result: true };

      } else {

        this[ champ ] = false;
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
          this.email ) {

            return {
                firstName: this.firstName,
                lastName: this.lastName,
                address: this.address,
                city: this.city,
                email: this.email
            };

          } else {

              return false;

          }

    }
  }
  