import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";

import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

import firebase from "./Firebase/Firebase";

import Button from "@mui/material/Button";
import { hex6 } from "@react-spring/shared";
import { FormatItalic } from "@mui/icons-material";

import DoggyImg from "../media/doggy2.jpg";


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "start",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    padding: 0,
    margin: 0,
  },
  gradientButton: {
    background:
      "linear-gradient(60deg," +
      theme.palette.accent.main +
      " 20%, " +
      theme.palette.primary.light +
      " 80%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: theme.palette.secondary.main,
    height: 60,
    padding: "0 10px",
    width: "60%",
    align: "bottom",
    fontWeight: "700",
    fontSize: "18px",
  },
  inspirationText: { width: "80%", color: "#524c4b" },

  imageCropper: {
    width: "250px",
    height: "250px",
    position: "relative",
    overflow: "hidden",
    borderRadius: "50%",
    borderColor: "#E3E3E3",
    boxShadow: "0 4px 6px 3px rgba(0, 0, 0, .5)",
  },
  profilePic: {
    display: "inline",
    margin: "0 auto",
    marginLeft: "-25%", //centers the image
    height: "100%",
    width: "auto",
  },
  mainDiv: {
    background: `url(${DoggyImg}) no-repeat center/cover`,
    height: "100vh",
    },
}));

const Result = (props) => {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();

  const [restaurant, setRestaurant] = useState(null);

  React.useEffect(() => {
    firebase.get(match.params.id).then((data) => {
      console.log("FBdata", data.restaurants);
      setRestaurant(data.restaurants);
      const newObj = data.restaurants
        .slice(1)
        .reduce(
          (acc, curr) => (curr.votes >= acc.votes ? curr : acc),
          data.restaurants[0]
        );
      setRestaurant(newObj);
    });
  }, []);

  const handleReset = () => {
    history.push("/");
  };

  if (!restaurant) {
    return <p>Loading ... </p>;
  }

  return (
    <div className={classes.mainDiv}>
    <div className={classes.container}>
      <h4
        className={classes.inspirationText}
        style={{ paddingTop: "8px", fontStyle: "italic" }}
      >
        Congratulations, you have a great place to eat!{" "}
      </h4>
      <h1
        className={classes.inspirationText}
        style={{
          marginTop: "30px",
          fontSize: "44px",
          fontFamily: "'Lobster', cursive",
        }}
      >
        {restaurant.name}
      </h1>
      <div
        className="row"
        style={{
          width: "250px",
          backgroundColor: "#A3A3A3",
          marginTop: "50px",
          borderRadius: "8px",
        }}
      >
        <div className={classes.imageCropper}>
          <img
            /* src="https://qsr.se/wp-content/uploads/vapiano-qsr.jpg" */
            src={restaurant.photo_url}
            className={classes.profilePic}
          ></img>
        </div>
      </div>
      <h6 className={classes.inspirationText} style={{ margin: "8px" }}>
        {restaurant.formatted_address} ({restaurant.distance}m)
      </h6>
      <Button
        type="submit"
        className={classes.gradientButton}
        onClick={handleReset}
        align="end"
        style={{position:"fixed", bottom: "24px"}}
      >
        Create new poll
      </Button>
    </div>
    </div>
  );
};

export default Result;
