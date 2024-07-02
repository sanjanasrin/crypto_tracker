import {
  CircularProgress,
  ThemeProvider,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { CryptoTraderState } from "../cryptoTrackerContext";
import axios from "axios";
import { HistoricalData } from "../config/api";
import { darkTheme } from "./Header";
import SelectGrapButton from "./SelectGrapButton";
import * as echarts from "echarts";

export const timeFrame = [
  {
    label: "24 Hours",
    value: 1,
  },
  {
    label: "7 Days",
    value: 7,
  },
];

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
  chart: {
    width: "100%",
    height: 400, // Adjust height as needed
  },
}));

const BitCoinInfo = ({ bitCoin }) => {
  const [previousData, setPreviousData] = useState();
  const [days, setDays] = useState(7);
  const { currency } = CryptoTraderState();
  const [flag, setFlag] = useState(false);
  const classes = useStyles();
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null); // State to manage error
  const maxRetries = 3;
  let chartInstance = null;

  const fetchHPreviousDataPerBitCoin = async () => {
    try {
      const { data } = await axios.get(
        HistoricalData(bitCoin?.id, days, currency)
      );
      console.log(data);
      setFlag(true);
      setPreviousData(data.prices);
      setRetryCount(0); // Reset retry count on success
      setError(null); // Reset error state on success
    } catch (error) {
      if (error?.response?.status === 429 && retryCount < maxRetries) {
        // Implement a retry mechanism with a limit
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchHPreviousDataPerBitCoin();
        }, 5000); // Retry after 5 seconds
      } else {
        setFlag(true);
        if (retryCount >= maxRetries) {
          setError("Too many tries to API. Please try again later.");
        } else {
          setError("Failed to fetch historic data for Bitcoin.");
          console.error("Failed to fetch historic data for Bitcoin:", error);
        }
      }
    }
  };

  useEffect(() => {
    fetchHPreviousDataPerBitCoin();
  }, [days]);

  useEffect(() => {
    if (previousData && flag) {
      renderChart();
    }
  }, [previousData, flag]);

  const renderChart = () => {
    const chartDom = document.getElementById("chart");
    chartInstance = echarts.init(chartDom);
    chartInstance.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      xAxis: {
        type: "category",
        data: previousData.map((coin) => {
          let date = new Date(coin[0]);
          return days === 1
            ? date.toLocaleTimeString()
            : date.toLocaleDateString();
        }),
      },
      yAxis: {
        type: "value",
        name: `Price (Past ${days} Days) in ${currency}`,
      },
      series: [
        {
          data: previousData.map((coin) => coin[1]),
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#EEBC1D",
          },
          areaStyle: {}, // If you want to add area fill
        },
      ],
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!previousData || (!flag && !error) ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : error ? (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        ) : (
          <>
            <div id="chart" className={classes.chart}></div>
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {timeFrame.map((day) => (
                <SelectGrapButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setFlag(false);
                    setError(null); // Reset error state on changing time frame
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectGrapButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default BitCoinInfo;
