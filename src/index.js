import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import CryptoTrackerContext from "./cryptoTrackerContext";
import "react-alice-carousel/lib/alice-carousel.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CryptoTrackerContext>
      <App />
    </CryptoTrackerContext>
  </React.StrictMode>
);
