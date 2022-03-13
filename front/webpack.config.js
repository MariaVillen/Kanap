const path = require( 'path' );

module.exports = {

    mode: "development",

    entry: {
        script: "./src/script.js",
        product: "./src/product.js",
        cart: "./src/cart.js"
    },

    output: {
        clean: true,
        /*compareBeforeEmit: false,*/
        filename: "[name].js",
        path: path.resolve( __dirname, "js" ),
        publicPath: "/js/",
        pathinfo: true
    },

    devServer: {      

        static: {
           directory: path.join( __dirname, '' ),
        }
       
      },
      
    devtool: 'source-map',
}