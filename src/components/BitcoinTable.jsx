import React, { useEffect, useState } from "react";
import {
  Container,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  makeStyles,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { CoinListTable } from "../config/api";
import axios from "axios";
import { CryptoTraderState } from "../cryptoTrackerContext";
import { numberWithCommas } from "./Carousel/CoinCarousel";
import { Pagination } from "@material-ui/lab";
import { darkTheme } from "./Header";

const useStyles = makeStyles({
  row: {
    backgroundColor: "#16171a",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#131111",
    },
    fontFamily: "Roboto",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "gold",
    },
  },
});

const BitcoinTable = () => {
  const [bitCoin, setBitCoin] = useState([]);
  const [loadin, setLoadin] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null); // State to manage error
  const { currency, symbol } = CryptoTraderState();
  const classes = useStyles();
  const navigate = useNavigate();

  const fetchBitCoinData = async () => {
    try {
      setLoadin(true);
      const { data } = await axios.get(CoinListTable(currency));
      setBitCoin(data);
      setLoadin(false);
      setError(null); // Reset error state on success
    } catch (error) {
      console.error("Failed to fetch Bitcoin data:", error);
      setLoadin(false);
      setError("Failed to fetch Bitcoin data. Please try again later."); // Set error message
    }
  };

  useEffect(() => {
    fetchBitCoinData();
  }, [currency]);

  const handleSearch = () => {
    return bitCoin.filter(
      (bitCoin) =>
        bitCoin.name.toLowerCase().includes(searchBar) ||
        bitCoin.symbol.toLowerCase().includes(searchBar)
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, marginTop: 40, fontFamily: "Roboto" }}
        >
          Cryptocurrency Prices
        </Typography>

        <TextField
          label="Search Bar"
          variant="outlined"
          style={{
            marginBottom: 20,
            width: "30%",
            display: "flex",
            justifyContent: "flex-start",
          }}
          onChange={(e) => setSearchBar(e.target.value)}
        />

        <TableContainer component={Paper}>
          {loadin ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : error ? (
            <Typography variant="h6" color="error" style={{ padding: 10 }}>
              {error}
            </Typography>
          ) : (
            <Table aria-label="a dense table">
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Roboto",
                      }}
                      key={head}
                      align={head === "Coin" ? "" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        onClick={() => navigate(`/bitcoin/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                                color: "gold",
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "gold" }}>{row.name}</span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <span style={{ color: "gold" }}>
                            {symbol}{" "}
                            {numberWithCommas(row.current_price.toFixed(2))}
                          </span>
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          <span style={{ color: "gold" }}>
                            {symbol}{" "}
                            {numberWithCommas(
                              row.market_cap.toString().slice(0, -6)
                            )}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          count={(handleSearch()?.length / 10).toFixed(0)}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default BitcoinTable;
