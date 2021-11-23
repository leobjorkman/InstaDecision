import React, { useState } from "react";
import firebase from "./Firebase"; // This is the add-function
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DoggyImg from "../../media/doggy.jpg";

import { useHistory } from "react-router-dom";
import { fontWeight } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  gradientButton: {
    background: "linear-gradient(60deg," + theme.palette.accent.main + " 20%, "+ theme.palette.primary.main + " 80%)",
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
  multilineColor:{
    color: theme.palette.secondary.main
  }, 
  text: {
    color: theme.palette.secondary.main,
    margin: "24px"
  },
  background: {
    background: `url(${DoggyImg}) no-repeat center/cover`,
    height:"100vh"
  },
}));

const Poll = () => {
  const classes = useStyles();
  const history = useHistory();

  const [pollName, setpollName] = useState("");
  const [numMembers, setNumMembers] = useState("");

  const pollNameHandler = (e) => {
    setpollName(e.target.value);
  };

  const numMembersHandler = (e) => {
    setNumMembers(e.target.value);
  };

  const addpollName = async (e) => {
    e.preventDefault();
    // Redirect
    const id = await firebase.add(pollName, numMembers);
    history.push(`/polls/${id}/preferences`);
    // Reset
    setpollName("");
    setNumMembers("");
  };

  return (
    <div className={classes.background}>
      <form onSubmit={addpollName} className={classes.simpleForm}>
        <h1 className={classes.text}>Create a poll!</h1>

        <TextField
          type="text"
          name="pollName"
          onChange={pollNameHandler}
          value={pollName}
          helperText="Please enter a poll name"
          id="demo-helper-text-aligned"
          label="Poll Name"
          InputProps={{
            className: classes.multilineColor
          }}
          required
          className={classes.simpleFormEl}
        />

        <TextField
          type="text"
          name="numMembers"
          onChange={numMembersHandler}
          value={numMembers}
          helperText="Please enter the number of members participating in decision"
          id="demo-helper-text-aligned"
          label="Number of Members"
          color="primary"
          required
          className={classes.simpleFormEl}
        />

        <Button type="submit" className={classes.gradientButton} style={{position:"fixed", bottom: "100px"}}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Poll;
