import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import App from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider> 
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
