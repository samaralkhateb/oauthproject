//import { request } from 'https';

/**
 *
 * @param router - we assign routes and endpoint functions for each route
 *                  to this object.
 *
 * @param expressApp - we use the expressApp to apply the auth
 * protection using its oauth.authorise() method.
 *
 * @param restrictedAreaRoutesMethods - an object
 * we're going to create in a minute that will
 * provide the endpoint function for the route
 *
 * @return {router} The method returns a router with populated with the '/enter' route
 */

module.exports =  (router, expressApp, restrictedAreaRoutesMethods) => {
    
const mySqlConnection = require('../databaseHelpers/mySqlWrapper')
const accessTokenDBHelper = require('../databaseHelpers/accessTokensDBHelper')(mySqlConnection)
const userDBHelper = require('../databaseHelpers/userDBHelper')(mySqlConnection)
const oAuthModel = require('../authorisation/accessTokenModel')(userDBHelper, accessTokenDBHelper)


    //Here we declare the route for the protected area and we apply the auth protecion
    //by passing expressApp.oauth.authorise() in the second parameter
    router.get('/enter',
    expressApp.oauth.authorise(),
    function (req, res) {
     var access = 'Bearer'+' '+ R.access_token;
     // res.setHeader('Content-Type','application/x-www-form-urlencoded');
     res.setHeader('Authorization',access);
      // console.log(access);
      res.setHeader("a","a");
      res.end();
     });
   

     

    return router
}