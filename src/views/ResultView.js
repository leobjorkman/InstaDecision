import React from "react";
import firebase from "../components/Firebase/Firebase";
import Result from "../components/Result";

const ResultView = ({ match }) => {
  const [poll, setPoll] = React.useState(null);

  React.useEffect(() => {
    firebase.get(match.params.id).then((poll) => setPoll(poll));
  }, [match.params.id]);

  if (!poll) return <p>Loading...</p>;

  return <Result id={match.params.id} />;
};

export default ResultView;
