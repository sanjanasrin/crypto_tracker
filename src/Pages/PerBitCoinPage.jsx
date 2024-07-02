import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoTraderState } from "../cryptoTrackerContext";
import axios from "axios";
import { SingleCoin } from "../config/api";
import useStylesPerBitCoin from "./stylesPerBitCoin";
import { LinearProgress, Typography, Alert } from "@material-ui/core";
import { numberWithCommas } from "../components/Carousel/CoinCarousel";
import BitCoinInfo from "../components/BitCoinInfo";

const PerBitCoinPage = () => {
  const { id } = useParams();
  const [bitCoin, setBitCoin] = useState();
  const [error, setError] = useState(null); // State to manage error
  const { currency, symbol } = CryptoTraderState();
  const classes = useStylesPerBitCoin();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const fetchBitCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setBitCoin(data);
      setRetryCount(0); // Reset retry count on success
      setError(null); // Reset error state on success
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code outside the range of 2xx
        if (error.response.status === 429 && retryCount < maxRetries) {
          // Implement a retry mechanism with a limit
          setTimeout(() => {
            setRetryCount((prevRetryCount) => prevRetryCount + 1);
            fetchBitCoin();
          }, 3000); // Retry after 3 seconds
        } else {
          if (retryCount >= maxRetries) {
            setError("Too many tries to API. Please try again later.");
          } else {
            setError("Failed to fetch coin data.");
            console.error("Failed to fetch coin data:", error.response.data);
          }
        }
      } else if (error.request) {
        // The request was made but no response was received
        if (error.message.includes("No 'Access-Control-Allow-Origin' header")) {
          setError(
            "CORS error: Access to the API has been blocked. Please check your CORS settings."
          );
        } else {
          setError("Failed to fetch coin data.");
          console.error("Failed to fetch coin data:", error.request);
        }
      } else {
        // Something happened in setting up the request that triggered an error
        setError("Error: " + error.message);
        console.error("Error", error.message);
      }
    }
  };

  useEffect(() => {
    fetchBitCoin();
  }, []);

  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

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
