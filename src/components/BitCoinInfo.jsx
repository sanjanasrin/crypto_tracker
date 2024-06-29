import { CircularProgress, ThemeProvider, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { CryptoTraderState } from "../cryptoTrackerContext";
import axios from "axios";
import { HistoricalChart } from "../config/api";
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
  let chartInstance = null; // Variable to store the ECharts instance

  const fetchHPreviousDataPerBitCoin = async () => {
    try {
      const { data } = await axios.get(
        HistoricalChart(bitCoin?.id, days, currency)
      );
      console.log(data);
      setFlag(true);
      setPreviousData(data.prices);
    } catch (error) {
      if (error.response.status === 429) {
        // Implement a retry mechanism or wait before retrying
        setTimeout(() => {
          fetchHPreviousDataPerBitCoin();
        }, 5000); // Retry after 5 seconds
      } else {
        console.error("Failed to fetch historic data for Bitcoin:", error);
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
        {!previousData || !flag ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
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
