import React, { useState } from "react";
import { makeStyles } from "@mui/styles";

import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";

import Firebase from "./Firebase/Firebase";

import CatImg from "../media/cat.jpg";

const useStyles = makeStyles((theme) => ({
  mainDiv: {
    background: `url(${CatImg}) no-repeat center/cover`,
    height: "55vh",
  },
  text: {
    color: theme.palette.secondary.main,
  },
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
    height: 60,
    padding: "0 30px",
    width: "60%",
    align: "bottom",
    fontWeight: "700",
    fontSize: "18px",
  },
  home: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    flexWrap: "noWrap",
  },

  heading: {
    position: "relative",
    fontSize: "3em",
    color: "white",
  },
}));

const InfoCollectPage = (props) => {
  const classes = useStyles();

  const match = useRouteMatch();
  const history = useHistory();

  const [pricePref, setPricePref] = useState("");
  const [dislike, setDislike] = useState("");
  const [like, setLike] = useState("");

  // TODO change this into an object with key color-name and value hex-value-of-color, and then refer to this value
  //      in the inline-styales.

  const colors = [
    "#b5179e",
    "#7209b7",
    "#560bad",
    "#480ca8",
    "#3a0ca3",
    "#3f37c9",
    "#4361ee",
    "#4895ef",
    "#4cc9f0",
    "#f72585",
  ];

  const options = {
    Pasta: 1,
    Pizza: 1,
    Sushi: 1,
    Burger: 1,
    Thai: 1,
    Indian: 1,
  };

  const handleRadioChange = (e) => {
    setPricePref(e.target.value);
  };

  const handleLikeChange = (e) => {
    setLike(e.target.value);
  };

  const handleDislikeChange = (e) => {
    setDislike(e.target.value);
  };

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    /* TODO implement error handling */
    console.log(like, dislike, pricePref);
    /* TODO send this data to firebase and send request to API */

    Firebase.update(match.params.id, pricePref, like, dislike);
    history.push(`/polls/${match.params.id}/voting`);

    setPricePref("");
    setLike("");
    setDislike("");
  };

  const handleCopyText = (e) => {
    e.preventDefault();
    const id = match.params.id;
    navigator.clipboard.writeText(id);
  };

  return (
    <form onSubmit={handleSubmitInfo}>
      <div className={classes.mainDiv}>
        <div className="col align-middle -sm " style={{ height: "50vh" }}>
          <button
            className={classes.gradientButton}
            onClick={handleCopyText}
            style={{ margin: "24px", fontSize: "22px" }}
          >
            Copy Poll ID
          </button>
          <div className="row p-4 align-middle">
            <h2 className={classes.text}>
              Please choose your preferred pricepoint
            </h2>
          </div>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gender"
              defaultValue="female"
              name="radio-buttons-group"
              className="mainContainer"
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="1"
                control={
                  <Radio
                    sx={{
                      color: "#6399A8",
                      "&.Mui-checked": {
                        color: "#FE6B8B", // secondary
                      },
                    }}
                  />
                }
                label={<Typography color="#6399A8">$</Typography>}
              />
              <FormControlLabel
                value="2"
                control={
                  <Radio
                    sx={{
                      color: "#6399A8",
                      "&.Mui-checked": {
                        color: "#FE6B8B", // secondary
                      },
                    }}
                  />
                }
                label={<Typography color="#6399A8">$$</Typography>}
              />
              <FormControlLabel
                value="3"
                control={
                  <Radio
                    sx={{
                      color: "#6399A8",
                      "&.Mui-checked": {
                        color: "#FE6B8B", // secondary
                      },
                    }}
                  />
                }
                label={<Typography color="#6399A8">$$$</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>

      <div
        style={{ backgroundColor: "#6399A8" }}
        className="container justify-content-center"
      >
        <div className="row justify-content-center p-3">
          <div className="row justify-content-center pt-3">
            <div className="col">
              <h3 style={{ color: "white" }}> I Like </h3>
            </div>
            <div className="col">
              <h3> </h3>
            </div>
            <div className="col">
              <h3 style={{ color: "white" }}> I Dislike </h3>
            </div>
          </div>

          <div>
            {Object.entries(options).map(([rest, _, i]) => (
              <div
                style={{
                  backgroundColor: "#F4CBD7",
                  padding: 16,
                  borderRadius: 20,
                  margin: 8,
                }}
                className="row justify-content-center"
              >
                <div className="col">
                  <input
                    type="radio"
                    className="radioBig"
                    name="test"
                    value={rest}
                    onChange={handleLikeChange}
                  />
                </div>
                <div className="col">
                  <h4 style={{ color: "#6399A8" }}> {rest} </h4>
                </div>
                <div className="col">
                  <input
                    type="radio"
                    className="radioBig"
                    name="test2"
                    id="pink"
                    value={rest}
                    onChange={handleDislikeChange}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="col">
            <button
              type="submit"
              className={classes.gradientButton}
              style={{ margin: "24px", fontSize: "22px" }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InfoCollectPage;
