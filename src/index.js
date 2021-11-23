import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./store/auth-context";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"; // TODO should only be imported in files in which it is used

const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#F4CBD7",
      light: "#F7F5F6"
    },
    secondary: {
      main: "#6399A8",
      second: "#A9E3F5",
    },
    accent: {
      main: "#F5ED90",
      second: "#A8A46C",
    }


  },
});

ReactDOM.render(
  <AuthContextProvider>
    <BrowserRouter>
      <ThemeProvider theme={muiTheme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </AuthContextProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
