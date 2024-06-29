import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoTraderState } from "../cryptoTrackerContext";
import axios from "axios";
import { SingleCoin } from "../config/api";
import useStylesPerBitCoin from "./stylesPerBitCoin";
import { LinearProgress, Typography } from "@material-ui/core";
import { numberWithCommas } from "../components/Carousel/CoinCarousel";
import BitCoinInfo from "../components/BitCoinInfo";

const PerBitCoinPage = () => {
  const { id } = useParams();
  const [bitCoin, setBitCoin] = useState();
  const { currency, symbol } = CryptoTraderState();
  const classes = useStylesPerBitCoin();

  const fetchBitCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setBitCoin(data);
    } catch (error) {
      console.error("Failed to fetch coin data:", error);
    }
  };

  useEffect(() => {
    fetchBitCoin();
  }, []);

  if (!bitCoin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={bitCoin?.image.large}
          alt={bitCoin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {bitCoin?.name}
        </Typography>

        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                bitCoin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                bitCoin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
        </div>
      </div>
      <BitCoinInfo bitCoin={bitCoin} />
    </div>
  );
};

export default PerBitCoinPage;
