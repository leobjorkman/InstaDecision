import React, { useState } from "react";

import { makeStyles } from "@mui/styles";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Firebase from "./Firebase/Firebase";

const useStyles = makeStyles((theme) => ({
  gradientButton: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
    width: "15%",
  },
  simpleForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  simpleFormEl: {
    width: "20%",
    margin: "2%",
  },
  text: {
    color: "#524c4b",
  },
}));

const Questionnaire = (props) => {
  const classes = useStyles();

  const [price, setPrice] = useState("");
  const [like, setLike] = useState("");
  const [dislike, setDislike] = useState("");

  const priceHandler = (e) => {
    setPrice(e.target.value);
  };

  const likeHandler = (e) => {
    setLike(e.target.value);
  };

  const dislikeHandler = (e) => {
    setDislike(e.target.value);
  };

  const addValues = (e) => {
    e.preventDefault();
    Firebase.update(props.id, price, like, dislike);
    setPrice("");
    setLike("");
    setDislike("");
  };

  console.log("poll", props.id);

  return (
    <div>
      <h1 className={classes.text}>Questionnaire</h1>
      <form className={classes.simpleForm} onSubmit={addValues}>
        <FormControl
          required
          sx={{ m: 1, minWidth: 120 }}
          className={classes.simpleFormEl}
          color="secondary"
        >
          <InputLabel id="demo-simple-select-required-label">Price</InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={price}
            label="Price *"
            onChange={priceHandler}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>$</MenuItem>
            <MenuItem value={2}>$$</MenuItem>
            <MenuItem value={3}>$$$</MenuItem>
            <MenuItem value={4}>$$$$</MenuItem>
          </Select>
          <FormHelperText>Required</FormHelperText>
        </FormControl>
        <TextField
          type="text"
          name="likes"
          onChange={likeHandler}
          value={like}
          helperText="Please enter your preferred food type"
          id="demo-helper-text-aligned"
          label="Food Preferences"
          color="secondary"
          required
          className={classes.simpleFormEl}
        />
        <TextField
          type="text"
          name="dislikes"
          onChange={dislikeHandler}
          value={dislike}
          helperText="Please enter your most disliked food type"
          id="demo-helper-text-aligned"
          label="Food Dislike"
          color="secondary"
          required
          className={classes.simpleFormEl}
        />
        <Button type="submit" className={classes.gradientButton}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Questionnaire;
