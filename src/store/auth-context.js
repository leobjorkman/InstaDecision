import React, { useState, useEffect, useCallback } from "react";

let logoutTimer; // Used to check if the user logs out itself or if it gets logged out as the token expires.

const AuthContext = React.createContext({
  // Intial data of context
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime(); // Current time in ms.
  const adjExpirationTime = new Date(expirationTime); // Convert expiration time to Date object and get ms.

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token"); // For persistance this is done when the page is loaded (the state is initialized). If token doesn't exist it is underfined, else it is the stored token.
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  // else there is enough remaining time for token.
  return { token: storedToken, duration: remainingTime };
};

/* This component can be used as a wrapper around other components that then will have access
to the context. */
export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  /* Only if tokenData is truthy, so not null. */
  if (tokenData) {
    initialToken = tokenData.token; // For persistance this is done when the page is loaded (the state is initialized). If token doesn't exist it is underfined, else it is the stored token.
  }
  const [token, setToken] = useState(initialToken);

  // !! converts the truthy/falsy value into a true/false boolean value
  // - if token is a non-empty string it will return true, else false
  const userIsLoggedIn = !!token;

  /* Clear token on logout
  Here, useCallback is used as we want to prevent an infinite loop
  that can arise due to the useEffect later on, this has to be done 
  as we want to use the logOutHandler-function in the useEffect and 
  thus should add it as dependency, the reason that we don't need to 
  add any functions as dependencies here is that all except setToken are
  browser builtin functions (these we don't have to add as they are not 
  specific to our react app), setToken is a state updating function which we don't
  need to add either (react guarantees us that this function never changes). Also, reactTimer
  is a global variable which also is outside of that react rendering flow and 
  therefore also does not need to be added. */
  const logOutHandler = useCallback(() => {
    setToken(null);
    /* Persistance. */
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    /* The timer that is used for automatic logout if token expires should be reset if user logs out. */
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const logInHandler = (token, expirationTime) => {
    setToken(token);
    /* Persistance. */
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    /* TODO 10000 should be remainingTime but not working yet */

    logoutTimer = setTimeout(logOutHandler, remainingTime); // logoutHandler is a callback so that it is executed if timer expires.
  };

  /* If we automatically logged in the user, it will set the logouthandler to the remainingtime here. 
  So, it should take the calculated duration from the stored expirationtime. That is, only when we manually reload the page.*/
  useEffect(() => {
    if (tokenData) {
      console.log("from here", tokenData.duration);
      logoutTimer = setTimeout(logOutHandler, tokenData.duration); // logoutHandler is a callback so that it is executed if timer expires.
    }
  }, [tokenData, logOutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: logInHandler,
    logout: logOutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
