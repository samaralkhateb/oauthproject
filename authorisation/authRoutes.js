module.exports = (router, expressApp, authRoutesMethods) => {

    //route for registering new users
    router.post('/registerUser', authRoutesMethods.registerUser)

    //route for allowing existing users to login

    router.post('/login', expressApp.oauth.grant(), authRoutesMethods.login)

    /*
            <td><%=R.expires_in%></td>
            <td><%=R.token_type%></td>
            <td><%=R.access_token%></td>
    */

    return router
}

