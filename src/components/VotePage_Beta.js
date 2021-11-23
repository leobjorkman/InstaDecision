/* TODO I think this is the page that renders an infinite amount of times */

import React, { useState, useRef, useEffect } from "react";

import { useRouteMatch } from "react-router-dom";

import firebase from "./Firebase/Firebase";

import ReactPlayer from 'react-player';

import spelvideo from "./Spelvideo.mp4";

import { useSpring, animated } from 'react-spring';

const VotePage = () => {
  const match = useRouteMatch();

  const [poll, setPoll] = useState(null);
  const [suggRest, setSuggRest] = useState(null);

  const [restaurants, setResturant] = useState({
    Pizza: 1,
    Pasta: 1,
    Sushi: 1,
    Meze: 1
  });



  /* Gets data from firebase. */


  // const restaurantInputRef = useRef();

  const handleVote = (e) => {
    /* Update current restaurant in firebase */

    console.log("target.value", e.target.value, restaurants[e.target.value]);

    restaurants[e.target.value] = restaurants[e.target.value] + 1;

    setResturant({ ...restaurants });
  };

  const getRandomNumber = (maxNum) => {
    return Math.floor(Math.random() * maxNum);
  };

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

  const getRandomColor = () => {
    const h = getRandomNumber(360);
    const s = getRandomNumber(100);
    const l = getRandomNumber(100);

    return `hsl(${h}deg, ${s}%, ${l}%)`;
  };

  function Clip({ url }) {
    return (
      <video autoPlay muted key={"../src/resources/Spelvideo.mkv"}>
        <source type="video/mkv" src={"../src/resources/Spelvideo.mkv"} />
      </video>
    );
  }

  const Expire = props => {
    const [visible, setVisible] = useState(true);
  
    useEffect(() => {
      setTimeout(() => {
        setVisible(false);
      }, props.delay);
    }, [props.delay]);
  
    return visible ? <div>{props.children}</div> : <div />;
  };

    const props = useSpring({ 
    to: { opacity: 1 }, 
    from: { opacity: 0 },
    leave: { from:{ opacity: 1},to: {opacity:0}},
    config: {
      duration: 4000 // duration for the whole animation form start to end
    }
  })

  const [shake, setShake] = useState(false);
    
  const animate = () => {
      
      // Button begins to shake
      setShake(true);
      
      // Buttons stops to shake after 2 seconds
      setTimeout(() => setShake(false), 2000);
      
  }
  /*<div className="video-background">
  <video autoPlay muted>
    <source type="video/mkv" src={require("../resources/Spelvideo.mkv")}/>
  </video>
</div>
<ReactPlayer src='../src/resources/Spelvideo.mp4' autoPlay/>
  <div style={{height:"30vh"}}>
          <video id="background-video" loop autoPlay muted>
              <source src={spelvideo} type="video/mp4" />
              Your browser does not support the video tag.
          </video>
        </div>
*/
//        <source src={"C:/Users/privat/Documents/GitHub/InstaDecision/src/resources/Spelvideo.mkv"} />

  return (
    
    <div className="container">
      <div style={{position: "fixed", zIndex: -1, width:"30vh"}}>
          <video id="background-video" autoPlay muted>
              <source src={spelvideo} type="video/mp4" />
              Your browser does not support the video tag.
          </video>
        </div>
      <animated.div style={props}>
      <div className="col justify-content-center">
        <div className="row justify-content-center">
          <h3>
            <label className="label label-default p-3" style={{color:"white"}}>
              Vote on your favorite option
            </label>
          </h3>
        </div>
      <div className="col" style={{width: "46vh",height:"70vh"}}>
        <div className="d-flex flex-row justify-content-center">
        <Expire delay="20000">
        <button 
          className = {shake ? `shake` : null}
          value="Meze"
          key="Meze"
          className="btn btn-primary m-2"
          style={{
            height:
              window.innerWidth / Object.keys(restaurants).length +
              restaurants["Meze"] * 10,
            maxHeight:
              Math.min(window.innerHeight / 3, window.innerWidth / 3) +
              restaurants["Meze"] * 10,
            width:
              window.innerWidth / Object.keys(restaurants).length +
              restaurants["Meze"] * 10,
            maxWidth:
              Math.min(window.innerHeight / 3, window.innerWidth / 3) +
              restaurants["Meze"] * 10,
            borderRadius:
              (window.innerWidth / Object.keys(restaurants).length +
                restaurants["Meze"] * 10) /
              2,
            backgroundColor: colors[1],
          }}
          key="Meze"
        >
          Meze{" "}

        </button>
        </Expire>

        <Expire delay="19000">
        <button
          value="Pasta"
          key="Pasta"
          className="btn btn-primary m-2"
          style={{
            height:
              window.innerWidth / Object.keys(restaurants).length +
              restaurants["Pasta"] * 10,
            maxHeight:
              Math.min(window.innerHeight / 3, window.innerWidth / 3) +
              restaurants["Pasta"] * 10,
            width:
              window.innerWidth / Object.keys(restaurants).length +
              restaurants["Pasta"] * 10,
            maxWidth:
              Math.min(window.innerHeight / 3, window.innerWidth / 3) +
              restaurants["Pasta"] * 10,
            borderRadius:
              (window.innerWidth / Object.keys(restaurants).length +
                restaurants["Pasta"] * 10) /
              2,
            backgroundColor: colors[9],
          }}
          key="Pasta"
        >
          Pasta{" "}
        </button>
        </Expire>
        </div>

        <div className="d-flex flex-row justify-content-center">
        <Expire delay="12000">
        <button
          value="Pizza"
          key="Pizza"
          className="btn btn-primary m-2"
          style={{
            height:
              window.innerWidth / Object.keys(restaurants).length +
              restaurants["Pizza"] * 10,
            maxHeight:
              Math.min(window.innerHeight / 3, window.innerWidth / 3) +
              restaurants["Pizza"] * 10,
            width:
              window.innerWidth / Object.keys(restaurants).length +
              restaurants["Pizza"] * 10,
            maxWidth:
              Math.min(window.innerHeight / 3, window.innerWidth / 3) +
              restaurants["Pizza"] * 10,
            borderRadius:
              (window.innerWidth / Object.keys(restaurants).length +
                restaurants["Pizza"] * 10) /
              2,
            backgroundColor: colors[6],
          }}
          key="Pizza"
        >
          Pizza{" "}
        </button>
        </Expire>
    


        <Expire delay="15400">
        <button
          value="Sushi"
          key="Sushi"
          className="btn btn-primary m-2"
          style={{
            height:
              window.innerWidth / Object.keys(restaurants).length +
              restaurants["Sushi"] * 10,
            maxHeight:
              Math.min(window.innerHeight / 3, window.innerWidth / 3) +
              restaurants["Sushi"] * 10,
            width:
              window.innerWidth / Object.keys(restaurants).length +
              restaurants["Sushi"] * 10,
            maxWidth:
              Math.min(window.innerHeight / 3, window.innerWidth / 3) +
              restaurants["Sushi"] * 10,
            borderRadius:
              (window.innerWidth / Object.keys(restaurants).length +
                restaurants["Sushi"] * 10) /
              2,
            backgroundColor: colors[4],
          }}
          key="Sushi"
        >
          Sushi{" "}
        </button>
        </Expire>
      </div>
      </div>
      </div>

      </animated.div>

      


    </div>
  );
};
export default VotePage;
