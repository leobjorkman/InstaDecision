import Home from "../components/Home";
import { makeStyles } from "@mui/styles";
import RabbatImg from "../media/rabbit.jpg";

const useStyles = makeStyles((theme) => ({
  homeP: {
    background: `url(${RabbatImg}) no-repeat center/cover`,
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
}));

const HomePage = () => {
  const classes = useStyles();
  return (
    <div className={classes.homeP}>
      <Home className={classes.home} />
    </div>
  );
};

export default HomePage;
