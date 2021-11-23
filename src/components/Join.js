import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DoggyImg from "../media/doggy.jpg";

const useStyles = makeStyles((theme) => ({
  gradientButton: {
    background:
      "linear-gradient(60deg," +
      theme.palette.accent.main +
      " 20%, " +
      theme.palette.primary.main +
      " 80%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: theme.palette.secondary.main,
    height: 48,
    padding: "0 30px",
    width: "40%",
    align: "bottom",
    fontWeight: "700",
    fontSize: "18px",
  },
  simpleForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.secondary.main,
  },
  simpleFormEl: {
    width: "80%",
    margin: "2%",
    color: theme.palette.secondary.main,
  },
  multilineColor: {
    color: theme.palette.secondary.main,
  },
  text: {
    color: theme.palette.secondary.main,
    margin: "24px",
  },
  background: {
    background: `url(${DoggyImg}) no-repeat center/cover`,
    height: "100vh",
  },
}));

const Join = () => {
  const classes = useStyles();
  const [id, setId] = useState("");

  const history = useHistory();

  /*  */

  const handleId = (e) => {
    setId(e.target.value);
  };

  const handleGoto = (e) => {
    e.preventDefault();
    history.push(`/polls/${id}/preferences`);
    setId("");
  };

  return (
    <div className={classes.background}>
      <form onSubmit={handleGoto} className={classes.simpleForm}>
        <h1 className={classes.text}>Join a poll!</h1>

        <TextField
          type="text"
          name="pollId"
          onChange={handleId}
          value={id}
          helperText="Enter Poll ID"
          id="demo-helper-text-aligned"
          label="Poll ID"
          InputProps={{
            className: classes.multilineColor,
          }}
          required
          className={classes.simpleFormEl}
        />

        <Button
          type="submit"
          className={classes.gradientButton}
          style={{ position: "fixed", bottom: "100px" }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Join;
