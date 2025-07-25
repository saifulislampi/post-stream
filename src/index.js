import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Set basename for GitHub Pages deployment
const basename = process.env.PUBLIC_URL || '';

root.render(
  <React.StrictMode>
    <Router basename={basename}>
      <App />
    </Router>
  </React.StrictMode>
);
