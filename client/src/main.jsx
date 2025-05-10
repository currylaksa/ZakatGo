import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { TransactionsProvider } from "./context/TransactionContext";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <TransactionsProvider>
    <App />
  </TransactionsProvider>,
);
