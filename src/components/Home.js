import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { palette } from "@mui/system";
import { ImportantDevices } from "@mui/icons-material";
import { fabClasses } from "@mui/material";

import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  home: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    flexWrap: "noWrap",
    flexDirection: "column",
  },

  heading: {
    position: "relative",
    fontSize: "3em",
    color: theme.palette.secondary.main,
    fontSize: "50px",
    fontFamily: "'Lobster', cursive",
  },
}));

/* CSS */

const Home = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.home}>
      <form className="col">
        <button
          className="btn btn-secondary m-4"
          type="Create"
          onClick={() => history.push("/createPoll")}
          style={{
            height: 50,
            width: 160,
            background: "#6399A8",
            color: "#f7f5f6",
            border: "0px",
          }}
        >
          {" "}
          <h2> Create Poll </h2>{" "}
        </button>
        <button
          className="btn btn-secondary m-4"
          type="Join"
          onClick={() => history.push(`/join`)}
          style={{
            height: 50,
            width: 160,
            background: "#6399A8",
            color: "#f7f5f6",
            border: "0px",
          }}
        >
          {" "}
          <h2> Join Poll </h2>{" "}
        </button>
      </form>
      <h1
        className={classes.heading}
        style={{ position: "fixed", top: "420px", left: "10px" }}
      >
        Home
      </h1>
    </div>
  );
};

export default Home;
