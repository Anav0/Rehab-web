import React from "react";
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import {MainPage} from "./pages/main-page";
import {ErrorPage} from "./pages/error-page";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact={true} path={'/'}>
                    <MainPage/>
                </Route>
                <Route exact={true} path={'/error/:code/:msg?'}>
                    <ErrorPage />
                </Route>
                <Route exact={true} path="*">
                    <ErrorPage />
                </Route>
            </Switch>
        </Router>

    );
};
export default App;