import { makeStyles } from "@material-ui/core";
import axios, { Axios } from "axios";
import React, { useEffect, useState } from "react";
import { CryptoTraderState } from "../../cryptoTrackerContext";
import { CoinsData } from "../../config/api";
import AliceCarousel, { Link } from "react-alice-carousel";

const useStyles = makeStyles(() => ({
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "gold",
  },
}));

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinCarousel = () => {
  const classes = useStyles();
  const [trendin, setTrendin] = useState([]);
  const { currency, symbol } = CryptoTraderState();

  const fetchCoinsData = async () => {
    try {
      const { data } = await axios.get(CoinsData(currency));
      setTrendin(data);
    } catch (error) {
      console.error("Failed to fetch trending coins data:", error);
    }
  };

  console.log(trendin);

  useEffect(() => {
    fetchCoinsData();
  }, [currency]);

  const items = trendin.flatMap((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;
    return (
      <Link className={classes.carouselItem} to={`./bitcoin/${coin.id}`}>
        <img
          src={coin?.image}
          alt={coin?.name}
          height="80"
          style={{ marginBottom: 10 }}
        ></img>
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "#0ecb82" : "red",
              fontWeight: 500,
            }}
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        responsive={responsive}
        autoPlay
        items={items}
        disableButtonsControls
      ></AliceCarousel>
    </div>
  );
};

export default CoinCarousel;
