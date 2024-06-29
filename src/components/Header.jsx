import React from "react";
import {
  AppBar,
  Container,
  Menu,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  makeStyles,
} from "@material-ui/core";
import { unstable_HistoryRouter, useNavigate } from "react-router-dom";
import { CryptoTraderState } from "../cryptoTrackerContext";

const useStyles = makeStyles(() => ({
  Title: {
    flex: 1,
    color: "gold",
    fontFamily: "Roboto",
    fontWeight: "bold",

    cursor: "pointer",
  },
}));

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const Header = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const { currency, setCurrency } = CryptoTraderState();
  console.log(currency);

  function handleLogoClick() {
    navigate("/");
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography className={classes.Title} onClick={handleLogoClick}>
              Crypto Trader
            </Typography>
            <Select
              variant="outlined"
              style={{
                width: 100,
                height: 40,
                marginRight: 15,
                color: "gold",
                borderColor: "gold",
              }}
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            >
              <MenuItem value={"USD"} style={{ color: "gold" }}>
                USD
              </MenuItem>
              <MenuItem value={"INR"} style={{ color: "gold" }}>
                INR
              </MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
