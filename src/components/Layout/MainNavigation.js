/* Material-UI */
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
// import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

import { useContext } from "react";
import AuthContext from "../../store/auth-context";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  /* Logging out only means that we clear our token, firebase does not care. */
  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          {/* TODO update to Logo */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            InstaDecision
          </Typography>
          {/* Login page should only be shown if user is not authenticated. */}
          {/* {!isLoggedIn && (
            <Button component={Link} to="/auth" color="inherit">
              Login
            </Button>
          )} */}
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          {/* Profile page should only be shown if user is logged in. */}
          {isLoggedIn && (
            <div>
              <IconButton
                component={Link}
                to="/createPoll"
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                {/* <AccountCircle /> */}
              </IconButton>
            </div>
          )}
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MainNavigation;
