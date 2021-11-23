import React from "react";
import firebase from "../components/Firebase/Firebase";
import Questionnaire from "../components/Questionnaire";

const PollView = ({ match }) => {
  const [poll, setPoll] = React.useState(null);

  React.useEffect(() => {
    firebase.get(match.params.id).then((poll) => setPoll(poll));
  }, []);

  if (!poll) return <p>Loading...</p>;

  console.log("POLL", poll);

  return (
    <div>
      <p>Description: {poll.description}</p>
      <Questionnaire id={match.params.id} />
    </div>
  );
};

export default PollView;
