/**
 *
 * @return {accessRestrictedArea: accessRestrictedArea}
 */
module.exports =  {

  accessRestrictedArea: accessRestrictedArea
}

/**
 *
 * This method handles requests to the /enter endpoint of the api.
 * If this method is called it means that the user was successfully authenticated
 * and we can there grant them access to the resricted area that the /enter endpoint
 * protects.
 *
 * It sends a response to the client telling them that they've been granted access
 * to the restricted area.
 *
 * @param req - request from api client
 * @param res - response to respond to client
 */
function accessRestrictedArea(req, res) {
  
  
   res.send('You have gained access to the restricted area')
    
}