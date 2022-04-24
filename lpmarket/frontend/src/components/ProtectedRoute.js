import { Route, Redirect,  useLocation } from "react-router-dom"
import { isExpired, decodeToken } from "react-jwt";
function ProtectedRoute({ isAuth: isAuth, component: Component, ...rest }) {
    let storage = require('../tokenStorage.js');
    token = storage.retrieveToken()
    let isAuth = !isExpired(token) && decodeToken(token)  

    return (
        <Route
            {...rest}
            render={(props) => {
                return isAuth !== true
                ? <Component />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            }}
        />
    )
}

export default ProtectedRoute