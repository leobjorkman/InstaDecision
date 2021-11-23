import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../../store/auth-context";

const AuthForm = () => {
  const history = useHistory();

  const [isLogin, setIsLogin] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  /* Switch between signup and login */
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  /* Triggered when user submits form */
  const submitHandler = (event) => {
    event.preventDefault(); // prevents browser default of sending request automatically, we want to send our own request

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    /* TODO add validation to make sure that the entered email is a valid email address and that the password is 
       e.g. 7 characters long */

    setIsLoading(true); // to start loading
    let url; // as the URLs are the only things differing between signup and login
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBsyKfQRU7kdb10NPEjL8XVDv5unn6MriY";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBsyKfQRU7kdb10NPEjL8XVDv5unn6MriY";
    }

    /* Send request to sign up with email / password API */
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false); // response has been received
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            // TODO show custom message
            // 1. If user already exists
            // 2. If password is not good enough
            // 3. If the email is invalid format
            let errorMessage = "Authentication failed!";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        /* Set timer that expires after 1 hour as default. */
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace("/"); // redirect to different page - replace means that the user cannot use the back-button
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request... </p>}

          <button type="button" onClick={switchAuthModeHandler}>
            {isLogin ? "Create New Account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
