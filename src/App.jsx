import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./Pages/HomePage";
import PerBitCoinPage from "./Pages/PerBitCoinPage";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#14161A",
    color: "gold",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();
  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header></Header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bitcoin/:id" element={<PerBitCoinPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
