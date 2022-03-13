
/**
 * @Function
 * @name getURLparam
 * @description Returns the value of a given parameter of a URL.
 * @param { string } param The name of the parameter.
 * @returns { string || false } Returns the value if exits, if not returns false.
 */

export function getURLparam ( param ) {

    const url = new URL( window.location.href );

    const search_params = new URLSearchParams( url.search );

    return ( search_params.has( param ) ) ? search_params.get( param ) || "" : false;

};

