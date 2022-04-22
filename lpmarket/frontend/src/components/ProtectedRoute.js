import { Route, Redirect } from "react-router-dom"

function ProtectedRoute({ isAuth: isAuth, component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                return isAuth === true
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