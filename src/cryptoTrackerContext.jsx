import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const Crypto = createContext();

const CryptoTraderContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");

  useEffect(() => {
    if (currency == "INR") {
      setSymbol("₹");
    } else if (currency === "USD") {
      setSymbol("$");
    }
  }, [currency]);
  return (
    <Crypto.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </Crypto.Provider>
  );
};

export default CryptoTraderContext;

export const CryptoTraderState = () => {
  return useContext(Crypto);
};
