import "./App.css";

import React, { useContext } from "react";
import Layout from "./components/Layout/Layout";
import { Switch, Route, Redirect } from "react-router";
import AuthPage from "./views/AuthPage";
import ConnectPage from "./views/ConnectPage";
import UserProfile from "./components/Profile/UserProfile";
import AuthContext from "./store/auth-context";
import Poll from "./components/Firebase/Poll";
import PollView from "./views/PollView";
import VoteView from "./views/VoteView";
import VoteViewBeta from "./views/VoteView_Beta";
import InfoCollectview from "./views/InfoCollectView";
import HomePage from "./views/Homepage";
import JoinView from "./views/JoinView";

import ResultView from "./views/ResultView";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <div className="App">
      <Layout>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>

          <Route path="/createPoll">
            <Poll />
          </Route>

          <Route path="/polls/:id/result" component={ResultView} />
          <Route path="/result" component={ResultView} />

          {!authCtx.isLoggedIn && (
            <Route path="/auth">
              <AuthPage />
            </Route>
          )}

          {authCtx.isLoggedIn && (
            <Route path="/profile">
              <p>Profile</p>
              <UserProfile />
            </Route>
          )}

          {/* Find other users. */}
          {authCtx.isLoggedIn && (
            <Route path="/connect">
              <p>Connect</p>
              <ConnectPage />
            </Route>
          )}

          <Route path="/profile">
            {authCtx.isLoggedIn && <UserProfile />}
            {!authCtx.isLoggedIn && <Redirect to="/auth" />}
          </Route>

          <Route path="/polls/:id/preferences" component={InfoCollectview} />

          <Route path="/polls/:id/voting">
            <VoteView />
          </Route>
          <Route path="/voteviewbeta">
            <VoteViewBeta />
          </Route>

          <Route path="/polls/:id" component={PollView} />

          <Route path="/join" component={JoinView} />

          {/* If user enters an invalid route. * means everythinig
          the user entered if it has not been handled by the routes above.*/}
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
