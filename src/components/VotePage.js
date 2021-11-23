/* TODO I think this is the page that renders an infinite amount of times */

import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@mui/styles";

import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";

import firebase from "./Firebase/Firebase";

import BunnyImg from "../media/bunny2.jpg";


const useStyles = makeStyles((theme) => ({
  countdown: {
    color: "#F4CBD7",
  },
  countdownNum: {
    color: "#F4CBD7",
    fontSize: "200%",
    fontWeight: "bold",
  },
  countdownStatus: {
    color: "#F4CBD7",
  },
  mainDiv: {
    background: `url(${BunnyImg}) no-repeat center/cover`,
    height: "100vh",
    },
  }));

const VotePage = () => {
  const classes = useStyles();

  const match = useRouteMatch();
  const history = useHistory();

  const [suggRest, setSuggRest] = useState(null);
  const [voteRest, setVoteRest] = useState(null);

  const [fbRest, setFbRest] = useState(null);

  const STATUS = {
    STARTED: "Started",
    STOPPED: "Stopped",
  };


  const INITIAL_COUNT = 2000;

  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT);
  const [status, setStatus] = useState(STATUS.STOPPED);

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60;

  const handleStart = () => {
    setStatus(STATUS.STARTED);
  };
  const handleStop = () => {
    setStatus(STATUS.STOPPED);
  };
  const handleReset = () => {
    setStatus(STATUS.STOPPED);
    setSecondsRemaining(INITIAL_COUNT);
  };
  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        setStatus(STATUS.STOPPED);
        history.push(`/polls/${match.params.id}/result`);
      }
    },
    status === STATUS.STARTED ? 1000 : null
    // passing null stops the interval
  );

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const twoDigits = (num) => String(num).padStart(2, "0");

  /* Gets data from firebase, fetches data from API and then sets data in firebase. */
  React.useEffect(() => {
    firebase.get(match.params.id).then((data) =>
      fetch("http://localhost:5000/get_restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({
          like: ["Pizza","Sushi"],
          dislike: ["Pasta", "Thai"],
          price: "1",
          numMembers: "1",
        }),
      })
        .then((response) => response.json())
        .then((text) => {
          setSuggRest(text);
          updateFirebase(text);
          setStatus(STATUS.STARTED);
        })
    );
  }, []);

  if (suggRest) {
    console.log("SuggRest", suggRest);
  }

  const updateFirebase = (text) => {
    console.log("text",text)
    const newArr = text.restaurants.map((rest) => {
      return { ...rest, votes: 1 };
    });
    firebase.setRestaurants(match.params.id, newArr);
    setVoteRest(newArr);
  };

  const handleVote = async (e) => {
    /* Update current restaurant in firebase */

    console.log("target.value", e.target.value);

    const newArr = voteRest.map((rest) => {
      if (e.target.value === rest.name) {
        return { ...rest, votes: rest.votes + 1 };
      } else {
        return rest;
      }
    });
    setVoteRest(newArr);
    await firebase.setRestaurants(match.params.id, voteRest);
  };

  const getRandomNumber = (maxNum) => {
    return Math.floor(Math.random() * maxNum);
  };

  const colors = [
    "#6399A8",
    "#A9E3F5",
    "#F5ED90",
    "#A8A46C",
    "#F7F5F6"
  ];

  const getRandomColor = () => {
    const h = getRandomNumber(360);
    const s = getRandomNumber(100);
    const l = getRandomNumber(100);

    return `hsl(${h}deg, ${s}%, ${l}%)`;
  };

  if (!voteRest) return <p>Loading...</p>;

  return (
    <div className={classes.mainDiv}>
    <div className="container justify-content-center">
      <div>
        <h4 style={{ padding: 20, color: "#6399A8" }} className={classes.countdown}>
          Voting ends in:
        </h4>
        <div style={{ padding: 20, color: "#6399A8" }} className={classes.countdownNum}>
          {twoDigits(hoursToDisplay)}:{twoDigits(minutesToDisplay)}:
          {twoDigits(secondsToDisplay)}
        </div>
        <div className={classes.countdownStatus}>Status: {status}</div>
      </div>
      <div className="col-sm">
        <div className="row justify-content-center">
          <h3>
            <label className="label label-default p-3" style={{color: "#6399A8"}}>
              Vote on your favorite option
            </label>
          </h3>
        </div>
        <div className="row justify-content-center m-2">
          {console.log(voteRest)}
          {voteRest.map((restaurant) => (
            <button
              value={restaurant.name}
              key={restaurant.name}
              onClick={handleVote}
              className="btn btn-accent m-2"
              style={{
                height:
                  window.innerWidth / suggRest.restaurants.length +
                  restaurant.votes * 10,
                /* restaurants[restaurant.name] * 10, */
                maxHeight:
                  Math.min(window.innerHeight / 3, window.innerWidth / 3) +
                  restaurant.votes * 10,
                /* restaurants[restaurant.name] * 10, */
                width:
                  window.innerWidth / suggRest.restaurants.length +
                  restaurant.votes * 10,
                /* restaurants[restaurant.name] * 10, */
                maxWidth:
                  Math.min(window.innerHeight / 3, window.innerWidth / 3) +
                  restaurant.votes * 10,
                /* restaurants[restaurant.name] * 10, */
                borderRadius:
                  (window.innerWidth / suggRest.restaurants.length +
                    restaurant.votes * 10 * 5) /
                  2,
                backgroundColor: colors[Math.floor(Math.random() * 5)],
                backgroundImage: `url(${restaurant.photo_url})`,
                resizeMode: 'center',
                color: 'white',
                fontWeight: '500'


              }}
              key={restaurant.name}
            >
              {restaurant.name} {restaurant.distance} m
            </button>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};
export default VotePage;
