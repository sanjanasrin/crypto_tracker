import { Container, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import CoinCarousel from "./CoinCarousel";

const useStyles = makeStyles(() => ({
  backDrop: {
    backgroundImage: "url(./assets/neuralLinkBackdrop.jpg)",
  },
  backdropContainer: {
    height: 400,
    display: "flex",
    flexDirection: "column",
    paddingTop: 25,
    justifyContent: "space-around",
  },
  title: {
    display: "flex",
    height: "40%",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
}));

const Carousel = () => {
  const classes = useStyles();
  return (
    <div className={classes.backDrop}>
      <Container className={classes.backdropContainer}>
        <div className={classes.title}>
          <Typography
            variant="h3"
            style={{
              fontWeight: "bold",
              color: "gold",
              marginBottom: 15,
              fontFamily: "Roboto",
              textShadow: "0 0 20px gold",
            }}
          >
            Crypto Trader
          </Typography>
          <Typography
            variant="subTitle1"
            style={{
              fontWeight: "bold",
              color: "gold",
              textTransform: "capitalize",
              fontFamily: "Roboto",
            }}
          >
            Trade your favorite Crypto Currency
          </Typography>
        </div>
        <CoinCarousel></CoinCarousel>
      </Container>
    </div>
  );
};

export default Carousel;
